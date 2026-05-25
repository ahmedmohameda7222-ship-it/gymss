import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 font-bold text-slate-950", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-blue">
        <Dumbbell className="h-5 w-5" />
      </span>
      <span>S&S Gym</span>
    </Link>
  );
}
