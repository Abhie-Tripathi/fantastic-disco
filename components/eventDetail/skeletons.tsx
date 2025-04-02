import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
export function EventDetailMapSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("flex justify-center items-center w-full", className)}
    >
      <span>Fetching nearby events...</span>
    </Skeleton>
  );
}
