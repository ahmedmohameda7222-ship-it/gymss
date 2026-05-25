import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeading title="Admin Settings" description="Review important S&S Gym deployment and privacy settings." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Netlify build command: npm run build</p>
            <p>Publish directory: .next</p>
            <p>Framework preset: Next.js</p>
            <p>NEXT_PUBLIC_USE_MOCK_AUTH=false for real Supabase auth.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Passwords are handled by Supabase Auth and are never stored in app tables.</p>
            <p>Progress photos are stored in a protected Supabase Storage bucket.</p>
            <p>Users can only access their own private logs through RLS policies.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
