"use client";

import { useEffect, useState } from "react";
import { alertIcons, getAlertLevelBorderColor } from "@/constants/eventTypes";
import { useEventsService } from "@/services/eventsService";
import { useSearchParams } from "next/navigation";
import {
  AlertResponse,
  AlertCount,
  AlertCountItem,
} from "@/types/events/alerts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { formattedDateRange } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { PaginationComponent } from "@/components/pagination";

export default function Alerts() {
  const searchParams = useSearchParams();
  const { getEventsWithSearchParams, getEventsCount } = useEventsService();
  const [alerts, setAlerts] = useState<AlertResponse | null>(null);
  const [alertCounts, setAlertCounts] = useState<AlertCountItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAlertCounts = async () => {
      setIsLoadingCounts(true);
      try {
        const alertCounts = (await getEventsCount({
          ...Object.fromEntries(searchParams.entries()),
          eventTypes: "alert",
          groupBy: "alertType",
        })) as unknown as AlertCount;

        if (alertCounts?.count) {
          setAlertCounts(Object.entries(alertCounts.count).map(([alertType, count]) => ({
            alertType,
            count: count as number
          })));
        }
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchAlertCounts();
  }, [searchParams]);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const filteredParams = new URLSearchParams(searchParams.toString());
        filteredParams.set("eventTypes", "alert");
        filteredParams.set("view", "list");
        filteredParams.set("offset", offset.toString());
        filteredParams.set("limit", itemsPerPage.toString());

        if (filteredParams.get("viewBound")) {
          const viewBound = JSON.parse(filteredParams.get("viewBound") || "");
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
        const fetchedAlerts = (await getEventsWithSearchParams(
          filteredParams.toString()
        )) as AlertResponse;
        setAlerts(fetchedAlerts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [searchParams, offset, itemsPerPage]);

  if (!alerts || !alerts.events || alerts.events.length === 0) return null;

  const totalPages = Math.ceil(alerts.count / itemsPerPage);
  const currentPage = Math.floor(offset / itemsPerPage) + 1;

  return (
    <Card className="w-full mb-6 shadow-none border bg-background">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="alerts-overview" className="border-none">
          <AccordionTrigger className="px-4 sm:px-6 py-4 hover:bg-accent/50 transition-colors hover:no-underline">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0">
              <div className="flex flex-row items-start sm:items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <TriangleAlert className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-nowrap">Alerts Overview</h2>
                  <p className="text-sm text-muted-foreground text-left">
                    {isLoadingCounts ? "Loading..." : `${alerts.count} alerts`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {isLoadingCounts ? (
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-md bg-muted animate-pulse" />
                    <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                  </div>
                ) : (
                  alertCounts.map(({ alertType, count }, index) => (
                    <div key={alertType} className="flex items-center">
                      {index > 0 && (
                        <Separator
                          orientation="vertical"
                          className="mx-2 sm:mx-4 h-8 hidden sm:block"
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg bg-background px-2 sm:px-3 py-1.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                            {alertIcons[alertType] ||
                              (alertType.toLowerCase() === "warning" ? (
                                <AlertTriangle className="h-4 w-4 text-primary" />
                              ) : (
                                <Info className="h-4 w-4 text-primary" />
                              ))}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium capitalize">
                              {alertType.toLowerCase()}
                            </span>
                            <Badge className="h-5 px-2 text-xs font-semibold no-underline">
                              {count} {count === 1 ? "alert" : "alerts"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 sm:px-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4">
              {isLoading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <Card key={index} className="bg-card border-2">
                      <CardContent className="flex items-start justify-between p-4">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                          <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                      </CardContent>
                    </Card>
                  ))
                : alerts.events
                    .sort(
                      (a, b) =>
                        new Date(a.basic.startDate).getTime() -
                        new Date(b.basic.startDate).getTime()
                    )
                    .map((alert, index) => (
                      <Card
                        key={index}
                        className={cn(
                          "bg-card transition-colors border-2",
                          getAlertLevelBorderColor(alert.basic.level)
                        )}
                      >
                        <CardContent className="flex items-start justify-between p-4">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-medium">
                              {alert.basic.name || alert.basic.type}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formattedDateRange(
                                alert.basic.startDate,
                                alert.basic.endDate
                              )}
                            </p>
                          </div>
                          <div
                            className={
                              "flex h-8 w-8 items-center justify-center rounded-md border-2"
                            }
                          >
                            {alertIcons[alert.basic.type] ||
                              (alert.basic.type.toLowerCase() === "warning" ? (
                                <AlertTriangle className="h-4 w-4 text-primary" />
                              ) : (
                                <Info className="h-4 w-4 text-primary" />
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-4">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  count={alerts.count}
                  onPageChange={(page) => setOffset((page - 1) * itemsPerPage)}
                  onItemsPerPageChange={(value) =>
                    setItemsPerPage(Number(value))
                  }
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
