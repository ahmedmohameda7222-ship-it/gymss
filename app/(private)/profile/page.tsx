"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase/client";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");

  async function saveProfile() {
    if (supabase && profile) {
      const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
      if (error) return toast({ title: "Profile update failed", description: error.message });
      await refreshProfile();
    }
    toast({ title: "Profile saved", description: "Your S&S Gym profile has been updated." });
  }

  return (
    <>
      <PageHeading title="Profile Settings" description="Manage your S&S Gym profile and onboarding preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Admin can see email and profile info only, never passwords.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value={profile?.email ?? ""} disabled placeholder="Email from Supabase Auth" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name, e.g. Ahmed" />
            </div>
            <Button onClick={saveProfile}>
              <Save className="h-4 w-4" />
              Save profile
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>Safety notes</CardTitle>
            <CardDescription>Keep training and nutrition sensible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-900">
            <p>This app is for general fitness tracking only.</p>
            <p>It is not medical advice. Speak with a doctor if you have medical conditions.</p>
            <p>Do not train through serious pain.</p>
            <p>Nutrition values are approximate and may vary depending on preparation and portion size.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
