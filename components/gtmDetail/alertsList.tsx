import { TriangleAlert } from "lucide-react";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { alertIcons, getAlertLevelBorderColor } from "@/constants/eventTypes";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";
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
import { Event } from "@/types/events";

// interface Props {
//   alert: Alert;
//   alertCount: number;
//   showMoreAlert: boolean;
//   setShowMoreAlerts: Dispatch<SetStateAction<boolean>>;
// }

// const AlertBanner = ({
//   alert,
//   alertCount,
//   showMoreAlert,
//   setShowMoreAlerts,
// }: Props) => {
//   const startDate = new Date(alert.startDate);
//   const endDate = new Date(alert.endDate);

//   const isDifferentYear = startDate.getFullYear() !== endDate.getFullYear();
//   const isDifferentMonth = startDate.getMonth() !== endDate.getMonth();

//   const formattedStartDate = format(
//     startDate,
//     `dd${isDifferentMonth || isDifferentYear ? " MMM" : ""}${
//       isDifferentYear ? " yyyy" : ""
//     }`
//   );

//   const formattedEndDate = format(endDate, `dd MMM yyyy`);
//   return (
//     <li
//       key={alert.id}
//       className={`flex items-center gap-2 justify-center bg-white border-2 ${getAlertLevelBorderColor(
//         alert.level
//       )} p-2 rounded-sm text-sm`}
//     >
//       {/* <TriangleAlert fill="#DA2F35" color="#FFEBEB" width={20} height={20} /> */}
//       {alertIcons[alert.type]}
//       <span>
//         <span className="text-[var(--negative-color)] font-semibold">
//           {alert.name}
//         </span>{" "}
//         from
//         <span className="text-[var(--negative-color)] font-semibold">
//           {" "}
//           {formattedStartDate}
//         </span>{" "}
//         to
//         <span className="text-[var(--negative-color)] font-semibold">
//           {" "}
//           {formattedEndDate}
//         </span>
//         {!showMoreAlert && alertCount > 1 && (
//           <span
//             className="ml-4 cursor-pointer"
//             onClick={() => setShowMoreAlerts(true)}
//           >
//             {"+"}
//             {alertCount - 1}
//           </span>
//         )}
//       </span>
//     </li>
//   );
// };

const AlertList = ({ alerts }: { alerts: Event["alerts"] | [] }) => {
  if (!alerts || alerts.length === 0) return null;

  const groupedAlerts = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return (
    // alerts &&
    // alerts.length > 0 && (
    //   <ul className="flex flex-col gap-2">
    //     {alerts.length >= 1 &&
    //       alerts
    //         .slice(0, 1)
    //         .map((alert) => (
    //           <AlertBanner
    //             key={alert.id}
    //             alertCount={alerts.length}
    //             alert={alert}
    //             showMoreAlert={showMoreAlert}
    //             setShowMoreAlerts={setShowMoreAlerts}
    //           />
    //         ))}

    //     {showMoreAlert &&
    //       alerts
    //         .slice(1, alerts.length)
    //         .map((alert) => (
    //           <AlertBanner
    //             key={alert.id}
    //             alertCount={alerts.length}
    //             alert={alert}
    //             showMoreAlert={showMoreAlert}
    //             setShowMoreAlerts={setShowMoreAlerts}
    //           />
    //         ))}
    //   </ul>
    // )
    <Card className="w-full shadow-none border bg-background">
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
                    {alerts.length} active alerts
                  </p>
                </div>
                <div className="hidden items-center gap-4 ml-4 xl:flex">
                  {Object.entries(groupedAlerts).map(([type, count], index) => (
                    <div key={type} className="flex items-center">
                      {index > 0 && (
                        <Separator
                          orientation="vertical"
                          className="mx-4 h-8"
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-1.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                            {alertIcons[type] ||
                              (type.toLowerCase() === "warning" ? (
                                <AlertTriangle className="h-4 w-4 text-primary" />
                              ) : (
                                <Info className="h-4 w-4 text-primary" />
                              ))}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium capitalize">
                              {type.toLowerCase()}
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
            <div className="grid gap-4 xl:grid-cols-3 pt-4">
              {alerts
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                .map((alert, index) => (
                  <Card key={index} className="bg-card transition-colors">
                    <CardContent className="flex items-start justify-between p-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium">
                          {alert.name || alert.type}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formattedDateRange(alert.startDate, alert.endDate)}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md border-2",
                          getAlertLevelBorderColor(alert.level)
                        )}
                      >
                        {alertIcons[alert.type] ||
                          (alert.type.toLowerCase() === "warning" ? (
                            <AlertTriangle className="h-4 w-4 text-primary" />
                          ) : (
                            <Info className="h-4 w-4 text-primary" />
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default AlertList;
