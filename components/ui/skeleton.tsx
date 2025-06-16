// components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--accent-color)]", className)}
      {...props}
    />
  );
}

export { Skeleton };