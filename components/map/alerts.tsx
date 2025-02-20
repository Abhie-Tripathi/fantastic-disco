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
import { Alert } from "@/types/events/alert";
import { formattedDateRange } from "@/utils/date";

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
  );
}

interface AlertsProps {
  selectedAlert: string;
  setSelectedAlert: React.Dispatch<React.SetStateAction<string>>;
}

const Alerts = ({ selectedAlert, setSelectedAlert }: AlertsProps) => {
  console.log("selectedAlert", selectedAlert);
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const eventService = useEventsService();
  const filteredParams = new URLSearchParams(searchParams.toString());
  filteredParams.set("eventTypes", "alert");
  filteredParams.set("view", "list");
  if (filteredParams.get("geoCoordinates")) {
    const geoCoordinates = JSON.parse(
      filteredParams.get("geoCoordinates")?.toString() || "{}"
    );
    filteredParams.delete("geoCoordinates");
    filteredParams.set(
      "viewBound",
      JSON.stringify({
        boundType: "point",
        coordinates: {
          latitude: geoCoordinates.latitude,
          longitude: geoCoordinates.longitude,
          radius: geoCoordinates.radius,
        },
      })
    );
  }

  const {
    data: alerts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["alerts", filteredParams.toString()],
    queryFn: () =>
      eventService.getEventsWithSearchParams(filteredParams.toString()),
    refetchOnWindowFocus: false,
  });

  const selectedAlertData = useMemo(() => {
    return alerts?.events.find((alert) => alert.id === selectedAlert);
  }, [alerts, selectedAlert]);

  if (error || !alerts?.events.length) return null;

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
              <AlertItem alert={selectedAlertData as unknown as Alert} />
            </div>
          ) : (
            <div className="w-full p-2 flex items-center text-sm border rounded justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Possibility of
              <span className={cn("mx-1 font-semibold underline text-primary")}>
                {alerts.events.length} Alert
                {alerts.events.length !== 1 && "s"}
              </span>
              in this Region
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <ScrollArea className="h-[300px] pr-4">
            <div className="[&>*:not(:last-child)]:border-b">
              {alerts.events.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert as unknown as Alert}
                  onClick={() => onClickHandler(alert.id)}
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
