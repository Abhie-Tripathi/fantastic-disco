import { Skeleton } from "@/components/ui/skeleton";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import Image from "next/image";

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-6 gap-5 items-center">
      <Skeleton className="col-span-1 w-full h-full" />

      <div className="col-span-4 gap-2 flex flex-col">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <Skeleton className="col-span-1 h-10" />
    </div>
  );
};

const FetchedTracker = () => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex gap-1 mb-1">
          <Image src={fetchIcon} height={18} width={18} alt="loading" />
          <span className="font-medium text-base">
            Hang in there ! We&apos;re analysing the best for you...
          </span>
        </div>
        <div className="text-sm text-[var(--secondary-text-color)]">
          We&apos;re gathering the information to create your trackers
        </div>
      </div>

      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

export default FetchedTracker;
