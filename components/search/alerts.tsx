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

export default function Alerts() {
  const searchParams = useSearchParams();
  const { getEventsWithSearchParams, getEventsCount } = useEventsService();
  const [alerts, setAlerts] = useState<AlertResponse | null>(null);
  const [alertCounts, setAlertCounts] = useState<AlertCountItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAlertCounts = async () => {
      const alertCounts = (await getEventsCount({
        eventTypes: "alert",
        groupBy: "eventType",
      })) as unknown as AlertCount;

      if (alertCounts?.count) {
        setAlertCounts(alertCounts.count);
      }
    };

    fetchAlertCounts();
  }, [searchParams]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const filteredParams = new URLSearchParams(searchParams.toString());
      filteredParams.set("eventTypes", "alert");
      filteredParams.set("view", "list");
      filteredParams.set("page", currentPage.toString());
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
    };

    fetchAlerts();
  }, [searchParams, currentPage]);

  if (!alerts || !alerts.events || alerts.events.length === 0) return null;

  const totalPages = Math.ceil(alerts.count / itemsPerPage);

  return (
    <Card className="w-full mb-6 shadow-none border bg-background">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="alerts-overview" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:bg-accent/50 transition-colors hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <TriangleAlert className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Alerts Overview</h2>
                  <p className="text-sm text-muted-foreground text-left">
                    {alerts.count} active alerts
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  {alertCounts.map(({ alertType, count }, index) => (
                    <div key={alertType} className="flex items-center">
                      {index > 0 && (
                        <Separator
                          orientation="vertical"
                          className="mx-4 h-8"
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-1.5">
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
                  ))}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 pt-4">
              {alerts.events
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
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
