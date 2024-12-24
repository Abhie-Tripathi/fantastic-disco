"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import React, { memo, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { alertIcons, getAlertLevelBorderColor } from "@/constants/eventTypes";
import { Alert } from "@/types";
import { formattedDateRange } from "@/utils/date";

export function AlertItem({ alert }: { alert: Alert }) {
  console.log(alert.startDate, alert.endDate)
  const alertItem = useMemo(
    () => (
      <div className="mb-2 pb-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium capitalize text-muted-foreground">
            {alert.type.toLowerCase()}
          </span>
          <span
            className={cn(
              "p-1 border-2 rounded-sm",
              getAlertLevelBorderColor(alert.level.toLowerCase())
            )}
          >
            {alertIcons[alert.type]}
          </span>
        </div>
        <p className="text-sm">{alert.name || `New ${alert.type} alert`}</p>
        <time className="text-xs text-muted-foreground">
          {formattedDateRange(alert.startDate, alert.endDate)}
        </time>
      </div>
    ),
    [alert]
  );

  return alertItem;
}

const Alerts = () => {
  const searchParams = useSearchParams();
  const eventService = useEventsService();
  const filteredParams = new URLSearchParams(searchParams.toString());
  filteredParams.set("eventTypes", "alert");
  filteredParams.set("view", "list");

  const {
    data: alerts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events", filteredParams.toString()],
    queryFn: () =>
      eventService.getEventsWithSearchParams(filteredParams.toString()),
    refetchOnWindowFocus: false,
  });

  if (error || !alerts?.events.length) return null;

  return (
    <div className="absolute z-10 top-4 right-1/2 translate-x-1/2">
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "w-full p-2 flex items-center text-sm border rounded justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            )}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Possibility of
            <span className={cn("mx-1 font-semibold underline text-primary")}>
              {alerts.events.length} Alert{alerts.events.length !== 1 && "s"}
            </span>
            in this Region
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ScrollArea className="h-[300px] pr-4">
            {alerts.events.map((alert) => (
              <AlertItem key={alert.id} alert={alert as Alert} />
            ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(Alerts);
