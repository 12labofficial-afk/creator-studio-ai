import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Firebase Admin SDK initialization

type FirebaseServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function stripOuterQuotes(value: string) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function previewForError(value: string) {
  return value.trim().slice(0, 24).replace(/\s+/g, " ");
}

function tryParseServiceAccount(rawValue: string): FirebaseServiceAccount {
  const raw = stripOuterQuotes(rawValue);

  // 1) Plain JSON
  try {
    const parsed = JSON.parse(raw);
    return parsed as FirebaseServiceAccount;
  } catch {
    // ignore
  }

  // 2) Base64(JSON)
  try {
    const decoded = atob(raw.trim());
    if (decoded.trim().startsWith("{")) {
      const parsed = JSON.parse(decoded);
      return parsed as FirebaseServiceAccount;
    }
  } catch {
    // ignore
  }

  throw new Error(
    `FIREBASE_SERVICE_ACCOUNT_KEY must be the full Firebase service account JSON (starts with '{' and ends with '}'). ` +
      `Current value looks like: '${previewForError(raw)}…'`
  );
}

async function initFirebaseAdmin() {
  const serviceAccountKey = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_KEY");
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY not configured");
  }

  const serviceAccount = tryParseServiceAccount(serviceAccountKey);

  if (!serviceAccount.client_email || !serviceAccount.private_key || !serviceAccount.project_id) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY JSON is missing required fields (client_email, private_key, project_id)");
  }

  // Get Firebase access token
  const tokenUrl = `https://oauth2.googleapis.com/token`;
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.database",
    aud: tokenUrl,
    iat: now,
    exp: now + 3600,
  };

  // Import crypto key and sign JWT
  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const privateKeyPem = String(serviceAccount.private_key).replace(/\\n/g, "\n");
  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureInput = encoder.encode(`${headerB64}.${payloadB64}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, signatureInput);
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${headerB64}.${payloadB64}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    throw new Error(`Failed to get Firebase access token: ${text}`);
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData?.access_token) {
    throw new Error("Firebase token response missing access_token");
  }

  return {
    accessToken: tokenData.access_token,
    projectId: serviceAccount.project_id,
  };
}

async function fetchFirestoreCollection(accessToken: string, projectId: string, collection: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch ${collection}: ${error}`);
  }
  
  const data = await response.json();
  return data.documents || [];
}

function parseFirestoreValue(value: any): any {
  if (!value) return null;
  
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.nullValue !== undefined) return null;
  if (value.mapValue) {
    const result: any = {};
    for (const [key, val] of Object.entries(value.mapValue.fields || {})) {
      result[key] = parseFirestoreValue(val);
    }
    return result;
  }
  if (value.arrayValue) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }
  
  return null;
}

function parseFirestoreDocument(doc: any) {
  const fields = doc.fields || {};
  const result: any = {};
  
  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseFirestoreValue(value);
  }
  
  // Extract document ID from the name
  const nameParts = doc.name.split('/');
  result._id = nameParts[nameParts.length - 1];
  
  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Initialize Firebase Admin
    const { accessToken, projectId } = await initFirebaseAdmin();
    
    const results = {
      users: { migrated: 0, errors: [] as string[] },
      projects: { migrated: 0, errors: [] as string[] },
      transactions: { migrated: 0, errors: [] as string[] },
    };

    // Migrate users/profiles
    console.log("Fetching users from Firestore...");
    const usersData = await fetchFirestoreCollection(accessToken, projectId, "users");
    
    for (const doc of usersData) {
      try {
        const userData = parseFirestoreDocument(doc);
        
        const { error } = await supabase.from("profiles").upsert({
          firebase_uid: userData._id,
          email: userData.email || null,
          display_name: userData.displayName || userData.name || null,
          avatar_url: userData.photoURL || userData.avatarUrl || null,
          credits: userData.credits || 0,
          created_at: userData.createdAt || new Date().toISOString(),
        }, { onConflict: "firebase_uid" });
        
        if (error) {
          results.users.errors.push(`User ${userData._id}: ${error.message}`);
        } else {
          results.users.migrated++;
        }
      } catch (e: unknown) {
        results.users.errors.push(`User parse error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // Get profile ID mapping for foreign keys
    const { data: profiles } = await supabase.from("profiles").select("id, firebase_uid");
    const profileIdMap = new Map(profiles?.map(p => [p.firebase_uid, p.id]) || []);

    // Migrate projects
    console.log("Fetching projects from Firestore...");
    const projectsData = await fetchFirestoreCollection(accessToken, projectId, "projects");
    
    for (const doc of projectsData) {
      try {
        const projectData = parseFirestoreDocument(doc);
        const userId = profileIdMap.get(projectData.userId || projectData.user_id);
        
        if (!userId) {
          results.projects.errors.push(`Project ${projectData._id}: User not found`);
          continue;
        }
        
        const { error } = await supabase.from("projects").upsert({
          firebase_id: projectData._id,
          user_id: userId,
          name: projectData.name || projectData.title || "Untitled",
          type: projectData.type || "script",
          content: projectData.content || projectData.data || {},
          status: projectData.status || "completed",
          created_at: projectData.createdAt || new Date().toISOString(),
        }, { onConflict: "firebase_id" });
        
        if (error) {
          results.projects.errors.push(`Project ${projectData._id}: ${error.message}`);
        } else {
          results.projects.migrated++;
        }
      } catch (e: unknown) {
        results.projects.errors.push(`Project parse error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // Migrate transactions
    console.log("Fetching transactions from Firestore...");
    const transactionsData = await fetchFirestoreCollection(accessToken, projectId, "transactions");
    
    for (const doc of transactionsData) {
      try {
        const txData = parseFirestoreDocument(doc);
        const userId = profileIdMap.get(txData.userId || txData.user_id);
        
        if (!userId) {
          results.transactions.errors.push(`Transaction ${txData._id}: User not found`);
          continue;
        }
        
        const { error } = await supabase.from("transactions").upsert({
          firebase_id: txData._id,
          user_id: userId,
          amount: txData.amount || 0,
          credits: txData.credits || 0,
          payment_id: txData.paymentId || txData.razorpay_payment_id || null,
          status: txData.status || "completed",
          created_at: txData.createdAt || new Date().toISOString(),
        }, { onConflict: "firebase_id" });
        
        if (error) {
          results.transactions.errors.push(`Transaction ${txData._id}: ${error.message}`);
        } else {
          results.transactions.migrated++;
        }
      } catch (e: unknown) {
        results.transactions.errors.push(`Transaction parse error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Migration error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
