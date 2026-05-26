"use client";

import dynamic from "next/dynamic";
import { CheckCircle2, PlusCircle, Trash2, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/ui/toaster";
import { deleteMealPlanItem, getTodayMealPlanItems, markMealPlanItemDone, mealTypes } from "@/services/database/repository";
import type { MealPlanItem, MealType } from "@/types";

const FoodBrowser = dynamic(
  () => import("@/components/meals/food-browser").then((module) => module.FoodBrowser),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-md border bg-white p-4 text-sm text-muted-foreground">
        Loading food picker...
      </div>
    )
  }
);

type MacroTotals = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

function emptyTotals(): MacroTotals {
  return { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
}

function addItemToTotals(total: MacroTotals, item: Pick<MealPlanItem, "calories" | "protein_g" | "carbs_g" | "fat_g">): MacroTotals {
  return {
    calories: total.calories + Number(item.calories || 0),
    protein_g: total.protein_g + Number(item.protein_g || 0),
    carbs_g: total.carbs_g + Number(item.carbs_g || 0),
    fat_g: total.fat_g + Number(item.fat_g || 0)
  };
}

export function MyMealPlanBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MealPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPlan() {
      if (!user) {
        if (active) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        const planItems = await getTodayMealPlanItems(user.id);
        if (active) setItems(planItems);
      } catch (error) {
        if (!active) return;
        setItems([]);
        setLoadError(error instanceof Error ? error.message : "Could not load today's meal plan.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPlan();

    return () => {
      active = false;
    };
  }, [user]);

  const plannedTotals = useMemo(() => {
    return items.filter((item) => item.status === "planned").reduce(addItemToTotals, emptyTotals());
  }, [items]);

  const doneTotals = useMemo(() => {
    return items.filter((item) => item.status === "done").reduce(addItemToTotals, emptyTotals());
  }, [items]);

  async function markDone(item: MealPlanItem) {
    if (item.status === "done") return;

    try {
      setIsUpdatingId(item.id);
      const result = await markMealPlanItemDone(item);
      setItems((current) => current.map((currentItem) => (currentItem.id === result.item.id ? result.item : currentItem)));
      toast({ title: "Meal marked done", description: `${item.food_name} was added to today's calories.` });
    } catch (error) {
      toast({
        title: "Could not mark meal done",
        description: error instanceof Error ? error.message : "Please run the latest Supabase SQL migration and try again."
      });
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function removeItem(item: MealPlanItem) {
    try {
      setIsUpdatingId(item.id);
      await deleteMealPlanItem(item);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      toast({ title: "Meal removed", description: item.status === "done" ? "Linked calorie log was removed too." : "Planned meal was removed." });
    } catch (error) {
      toast({ title: "Could not remove meal", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setIsUpdatingId(null);
    }
  }

  function addPlannedItem(item: MealPlanItem) {
    setItems((current) => {
      if (current.some((currentItem) => currentItem.id === item.id)) return current;
      return [item, ...current];
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Planned" value={plannedTotals.calories} detail={`${Math.round(plannedTotals.protein_g)}g protein planned`} />
        <SummaryCard label="Done today" value={doneTotals.calories} detail={`${Math.round(doneTotals.protein_g)}g protein logged`} />
        <SummaryCard label="Planned carbs" value={plannedTotals.carbs_g} suffix="g" detail={`${Math.round(plannedTotals.fat_g)}g fat planned`} />
        <SummaryCard label="Done carbs" value={doneTotals.carbs_g} suffix="g" detail={`${Math.round(doneTotals.fat_g)}g fat logged`} />
      </div>

      {loadError ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-5 text-sm text-amber-900">
            My Meal Plan opened, but today's saved items could not be loaded. Run the latest Supabase meal-plan SQL migration if this is the first deploy.
            <span className="mt-2 block text-xs">{loadError}</span>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Today's meals</h2>
          <p className="text-sm text-muted-foreground">Planned food counts only after you press Mark done.</p>
        </div>
        <Button onClick={() => setShowFoodPicker((current) => !current)}>
          <PlusCircle className="h-4 w-4" />
          {showFoodPicker ? "Hide food picker" : "Add food"}
        </Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading today's meal plan...</p> : null}

      <div className="grid gap-4 xl:grid-cols-4">
        {mealTypes.map((type) => (
          <MealColumn key={type} type={type} items={items.filter((item) => item.meal_type === type)} onDone={markDone} onDelete={removeItem} updatingId={isUpdatingId} />
        ))}
      </div>

      {showFoodPicker ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add food to My Meal Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground">Choose Breakfast, Lunch, Snack, or Dinner before adding food.</p>
          </CardHeader>
          <CardContent>
            <FoodBrowser onPlanAdded={addPlannedItem} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value, detail, suffix = " kcal" }: { label: string; value: number; detail: string; suffix?: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold">
          {Math.round(Number(value) || 0)}{suffix}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function MealColumn({
  type,
  items,
  onDone,
  onDelete,
  updatingId
}: {
  type: MealType;
  items: MealPlanItem[];
  onDone: (item: MealPlanItem) => void;
  onDelete: (item: MealPlanItem) => void;
  updatingId: string | null;
}) {
  const totals = items.reduce(
    (sum, item) => ({
      calories: sum.calories + Number(item.calories || 0),
      protein_g: sum.protein_g + Number(item.protein_g || 0)
    }),
    { calories: 0, protein_g: 0 }
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2"><Utensils className="h-4 w-4" /> {type}</span>
          <Badge variant="outline">{items.length}</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{Math.round(totals.calories)} kcal | {Math.round(totals.protein_g)}g protein</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!items.length ? <p className="text-sm text-muted-foreground">No food planned yet.</p> : null}
        {items.map((item) => (
          <div key={item.id} className="rounded-md border bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold leading-5">{item.food_name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.quantity}x {item.serving_size}</p>
                <p className="mt-1 text-xs text-muted-foreground">{Math.round(Number(item.calories || 0))} kcal | {Math.round(Number(item.protein_g || 0))}g protein</p>
              </div>
              <Badge variant={item.status === "done" ? "success" : "outline"}>{item.status}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <Button size="sm" onClick={() => onDone(item)} disabled={item.status === "done" || updatingId === item.id}>
                <CheckCircle2 className="h-4 w-4" />
                {item.status === "done" ? "Done" : "Mark done"}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(item)} disabled={updatingId === item.id} aria-label={`Remove ${item.food_name}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
