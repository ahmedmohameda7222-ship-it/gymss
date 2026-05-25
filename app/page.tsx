import Link from "next/link";
import { Activity, Dumbbell, LineChart, Smartphone, Soup, Utensils } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const features = [
  { icon: Utensils, title: "Track your meals", text: "Log food, portions, calories, and macros in a simple daily view." },
  { icon: Dumbbell, title: "Log your workouts", text: "Browse workouts, start sessions, and save workout history." },
  { icon: Soup, title: "Follow Egyptian food macros", text: "Use the Egyptian food database with adjustable serving quantities." },
  { icon: LineChart, title: "View your progress", text: "Follow weight, measurements, consistency, and nutrition trends." },
  { icon: Smartphone, title: "Works perfectly on mobile", text: "Every core action is designed for phones first." },
  { icon: Activity, title: "Private gym dashboard", text: "Built for members, not public sales pages or subscriptions." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <main>
        <section className="blue-surface text-white">
          <div className="container grid min-h-[calc(100vh-4rem)] gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">Private fitness dashboard</p>
              <h1 className="mt-4 text-5xl font-bold tracking-normal sm:text-6xl">S&S Gym</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-blue-100">
                Simple workout, meal, and progress tracking for real life.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">Create account</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-blue-200 bg-white/10 text-white hover:bg-white/15">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
              <p className="mt-6 max-w-lg text-sm text-blue-100">
                General fitness tracking only. Not medical advice. Nutrition values are approximate.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-blue backdrop-blur">
              <div className="rounded-lg bg-white p-4 text-slate-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today</p>
                    <h2 className="text-xl font-bold">Dashboard snapshot</h2>
                  </div>
                  <span className="rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">S&S Gym</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniMetric label="Calories" value="1,420" detail="780 remaining" />
                  <MiniMetric label="Protein" value="92g" detail="58g left" />
                </div>
                <div className="mt-5 space-y-4">
                  <ProgressLine label="Calories" value={64} />
                  <ProgressLine label="Protein" value={61} />
                  <ProgressLine label="Workout" value={75} />
                </div>
                <div className="mt-5 rounded-md bg-blue-50 p-4">
                  <p className="text-sm font-semibold">Welcome back to S&S Gym. Ready for today?</p>
                  <p className="mt-1 text-sm text-slate-600">Add food, start a workout, or record progress.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardContent className="pt-5">
                    <Icon className="h-8 w-8 text-primary" />
                    <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border bg-slate-50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function ProgressLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
