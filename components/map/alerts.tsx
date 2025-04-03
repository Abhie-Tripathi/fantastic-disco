"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import React, { memo, useMemo, useState } from "react";
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
import { Alert, AlertCount, AlertCountItem } from "@/types/events/alerts";
import { formattedDateRange } from "@/utils/date";

interface AlertResponse {
  events: Alert[];
  total: number;
}

export function AlertItem({
  alert,
  onClick,
}: {
  alert: Alert;
  onClick?: () => void;
}) {
  return (
    <div
      className="w-full rounded-lg p-2 cursor-pointer hover:bg-gray-50"
      onClick={(e) => {
        onClick?.();
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium capitalize text-muted-foreground">
          {alert.basic.type.toLowerCase()}
        </span>
        <span
          className={cn(
            "p-1 border-2 rounded-sm",
            getAlertLevelBorderColor(alert.basic.level.toLowerCase())
          )}
        >
          {alertIcons[alert.basic.type]}
        </span>
      </div>
      <p className="text-sm">{alert.basic.name || `New ${alert.basic.type} alert`}</p>
      <time className="text-xs text-muted-foreground">
        {formattedDateRange(alert.basic.startDate, alert.basic.endDate)}
      </time>
    </div>
  );
}

interface AlertsProps {
  selectedAlert: string | undefined;
  setSelectedAlert: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Alerts = ({ selectedAlert, setSelectedAlert }: AlertsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const eventService = useEventsService();
  const filteredParams = new URLSearchParams(searchParams.toString());
  filteredParams.set("eventTypes", "alert");
  filteredParams.set("view", "list");

  if (filteredParams.get("viewBound")) {
    const viewBound = JSON.parse(
      filteredParams.get("viewBound")?.toString() || "{}"
    );
    filteredParams.delete("viewBound");
    filteredParams.set(
      "viewBound",
      JSON.stringify({
        boundType: "point",
        coordinates: {
          latitude: viewBound.coordinates.latitude,
          longitude: viewBound.coordinates.longitude,
          radius: viewBound.coordinates.radius,
        },
      })
    );
  }

  const {
    data: alerts,
    error,
    isLoading,
  } = useQuery<AlertResponse, Error>({
    queryKey: ["alerts", filteredParams.toString()],
    queryFn: async () => {
      const response = await eventService.getEventsWithSearchParams(filteredParams.toString());
      return response as AlertResponse;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: alertCounts,
  } = useQuery<AlertCount, Error>({
    queryKey: ["alertCounts"],
    queryFn: async () => {
      const response = await eventService.getEventsCount({
        eventTypes: "alert",
        groupBy: "eventType",
      });
      return response as unknown as AlertCount;
    },
    refetchOnWindowFocus: false,
  });

  const selectedAlertData = useMemo(() => {
    return alerts?.events.find((alert: Alert) => alert.basic.id === selectedAlert);
  }, [alerts, selectedAlert]);

  if (error || !alerts?.events?.length) return null;

  const onClickHandler = (id: string) => {
    setSelectedAlert(id);
    setOpen(false);
  };

  return (
    <div className="absolute z-10 top-4 right-1/2 translate-x-1/2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {selectedAlertData ? (
            <div className="w-64 p-2 border flex items-center rounded-lg shadow-xl justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <AlertItem alert={selectedAlertData} />
            </div>
          ) : (
            <div className="w-full p-2 flex items-center text-sm border rounded justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Possibility of
              <span className={cn("mx-1 font-semibold underline text-primary")}>
                {alerts.total} Alert
                {alerts.total !== 1 && "s"}
              </span>
              in this Region
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <ScrollArea className="h-[300px] pr-4">
            <div className="[&>*:not(:last-child)]:border-b">
              {alerts.events.map((alert: Alert) => (
                <AlertItem
                  key={alert.basic.id}
                  alert={alert}
                  onClick={() => onClickHandler(alert.basic.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(Alerts);
