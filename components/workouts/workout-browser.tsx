"use client";

import Link from "next/link";
import { Play, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getWorkouts } from "@/services/database/repository";
import type { Workout } from "@/types";

const allValue = "all";

export function WorkoutBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allValue);
  const [equipment, setEquipment] = useState(allValue);
  const [difficulty, setDifficulty] = useState(allValue);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    getWorkouts(query, {
      category: category === allValue ? undefined : category,
      equipment: equipment === allValue ? undefined : equipment,
      difficulty: difficulty === allValue ? undefined : difficulty
    }).then(setWorkouts);
  }, [category, difficulty, equipment, query]);

  const options = useMemo(() => {
    const source = workouts.length ? workouts : [];
    return {
      categories: Array.from(new Set(source.map((item) => item.category))),
      equipment: Array.from(new Set(source.map((item) => item.equipment))),
      difficulty: Array.from(new Set(source.map((item) => item.difficulty)))
    };
  }, [workouts]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search workouts, e.g. Squat or Cable Row"
            className="pl-10"
          />
        </div>
        <FilterSelect value={category} onValueChange={setCategory} placeholder="Category" values={options.categories} />
        <FilterSelect value={equipment} onValueChange={setEquipment} placeholder="Equipment" values={options.equipment} />
        <FilterSelect value={difficulty} onValueChange={setDifficulty} placeholder="Difficulty" values={options.difficulty} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{workout.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{workout.target_muscle}</p>
                </div>
                <Badge>{workout.difficulty}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{workout.category}</Badge>
                <Badge variant="outline">{workout.equipment}</Badge>
                {workout.sets ? <Badge variant="outline">{workout.sets} sets</Badge> : null}
                {workout.reps ? <Badge variant="outline">{workout.reps}</Badge> : null}
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{workout.instructions}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link href={`/workouts/${workout.id}`}>Details</Link>
                </Button>
                <Button asChild>
                  <Link href={`/workouts/session/${workout.id}`}>
                    <Play className="h-4 w-4" />
                    Start
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  values
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  values: string[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allValue}>All {placeholder.toLowerCase()}</SelectItem>
        {values.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
