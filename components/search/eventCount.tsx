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
    events: "Events Found",
    people: "People Found",
    companies: "Companies Found",
  };

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-red-100 text-red-500">!</Badge>
        <p className="text-red-500 font-semibold">Error loading count</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="animate-spin text-primary" />
      ) : (
        <Badge className="bg-primary text-white">
          {new Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format((data as any)?.count || 0)}
        </Badge>
      )}
      <p className="text-primary font-semibold">{label[view]}</p>
    </div>
  );
};

export default EventCount;
