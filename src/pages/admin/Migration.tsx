import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader2, CheckCircle, AlertCircle, Users, FolderOpen, CreditCard } from "lucide-react";

interface MigrationResult {
  migrated: number;
  errors: string[];
}

interface MigrationResults {
  users: MigrationResult;
  projects: MigrationResult;
  transactions: MigrationResult;
}

const MigrationPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MigrationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const runMigration = async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("migrate-firebase");

      if (fnError) throw fnError;

      if (data.success) {
        setResults(data.results);
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${data.results.users.migrated} users, ${data.results.projects.migrated} projects, and ${data.results.transactions.migrated} transactions.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Migration Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Firebase to Supabase Migration
          </h1>
          <p className="text-muted-foreground mt-2">
            One-time migration of all user data, projects, and transactions from Firebase Firestore.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Migration Details</CardTitle>
            <CardDescription>
              This will migrate the following data from your Firebase Firestore:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Users & Profiles</p>
                  <p className="text-sm text-muted-foreground">Email, name, credits</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <FolderOpen className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Projects</p>
                  <p className="text-sm text-muted-foreground">Scripts, content, history</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Transactions</p>
                  <p className="text-sm text-muted-foreground">Payment history, credits</p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This migration uses upsert operations, so it's safe to run multiple times. 
                Existing records will be updated, not duplicated.
              </AlertDescription>
            </Alert>

            <Button
              onClick={runMigration}
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Migration...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Start Migration
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Migration Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Users */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </span>
                  <span className="text-green-600 font-semibold">
                    {results.users.migrated} migrated
                  </span>
                </div>
                {results.users.errors.length > 0 && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {results.users.errors.slice(0, 3).join(", ")}
                    {results.users.errors.length > 3 && ` +${results.users.errors.length - 3} more`}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Projects
                  </span>
                  <span className="text-green-600 font-semibold">
                    {results.projects.migrated} migrated
                  </span>
                </div>
                {results.projects.errors.length > 0 && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {results.projects.errors.slice(0, 3).join(", ")}
                    {results.projects.errors.length > 3 && ` +${results.projects.errors.length - 3} more`}
                  </div>
                )}
              </div>

              {/* Transactions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Transactions
                  </span>
                  <span className="text-green-600 font-semibold">
                    {results.transactions.migrated} migrated
                  </span>
                </div>
                {results.transactions.errors.length > 0 && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {results.transactions.errors.slice(0, 3).join(", ")}
                    {results.transactions.errors.length > 3 && ` +${results.transactions.errors.length - 3} more`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MigrationPage;
