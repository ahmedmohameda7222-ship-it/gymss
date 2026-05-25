"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProgressEntry } from "@/types";

export function ProgressCharts({ entries }: { entries: ProgressEntry[] }) {
  const data = entries.length
    ? entries.map((entry) => ({
        date: entry.entry_date.slice(5),
        weight: entry.body_weight_kg,
        waist: entry.waist_cm
      }))
    : [
        { date: "W1", weight: 78, waist: 88 },
        { date: "W2", weight: 77.8, waist: 87.5 },
        { date: "W3", weight: 77.4, waist: 87 },
        { date: "W4", weight: 77.1, waist: 86.5 }
      ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Body weight</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={35} />
              <Tooltip />
              <Line dataKey="weight" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Workout consistency</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ week: "W1", done: 3 }, { week: "W2", done: 4 }, { week: "W3", done: 3 }, { week: "W4", done: 5 }]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <Tooltip />
              <Bar dataKey="done" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
