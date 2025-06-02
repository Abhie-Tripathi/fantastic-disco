import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-md">
      {/* Main Skeleton Block */}
      <Skeleton className="w-full h-40 rounded-md" />

      {/* Three inline small blocks */}
      <div className="flex w-full gap-2">
        <Skeleton className="h-16 w-1/3 rounded-md" />
        <Skeleton className="h-16 w-1/3 rounded-md" />
        <Skeleton className="h-16 w-1/3 rounded-md" />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <CardSkeleton />
    </div>
  );
};

export default LoadingSkeleton;
