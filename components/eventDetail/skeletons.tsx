import { isEventeli } from "@/config";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
export function EventDetailMapSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("w-full", className)}></Skeleton>;
}
