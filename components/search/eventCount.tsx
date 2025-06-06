import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import { useEventsService } from "@/services/eventsService";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const EventCount = ({ view }: { view: string }) => {
  const { getEventsCount } = useEventsService();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.set("view", "list");

  const searchParamsString = params.toString();

  const paramsObject = Object.fromEntries(params.entries());

  const { data, isLoading, error } = useQuery({
    queryKey: ["eventsCount", searchParamsString],
    queryFn: () => getEventsCount(paramsObject),
  });

  const label: Record<string, string> = {
    events: "Events",
    people: "People",
    companies: "Companies",
  };

  if (error) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Badge className="bg-red-100 text-red-500">!</Badge>
        <p className="text-red-500 font-semibold text-sm sm:text-base">Error</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-fit">
      {isLoading ? (
        <Loader2 className="animate-spin text-primary w-4 h-4" />
      ) : (
        <Badge className="bg-primary text-white text-xs whitespace-nowrap font-medium md:font-semibold">
          {new Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 2,
          }).format((data as any)?.count || 0)}
        </Badge>
      )}
      <p className="text-primary font-medium md:font-semibold text-sm md:text-base whitespace-nowrap">
        {label[view]}
      </p>
    </div>
  );
};

export default EventCount;
