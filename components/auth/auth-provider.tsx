"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { env } from "@/lib/env";
import type { Profile } from "@/types";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockUser = {
    id: "mock-user",
    email: "member@ssgym.test"
  } as User;

  async function loadProfile(userId: string) {
    if (!supabase) {
      setProfile({
        id: "mock-user",
        email: "member@ssgym.test",
        full_name: "S&S Gym Member",
        role: "admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return;
    }

    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile((data as Profile | null) ?? null);
  }

  async function refreshProfile() {
    const currentUser = session?.user;
    if (currentUser) {
      await loadProfile(currentUser.id);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      if (!supabase || env.useMockAuth) {
        setSession({ user: mockUser } as Session);
        await loadProfile("mock-user");
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }
      setIsLoading(false);
    }

    boot();

    if (!supabase || env.useMockAuth) return () => undefined;

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        await loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      isLoading,
      isAdmin: profile?.role === "admin",
      refreshProfile,
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
      }
    }),
    [session, profile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
