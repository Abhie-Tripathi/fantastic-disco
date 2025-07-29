"use client";
import { useConfiguration } from "@/hooks/useConfiguration";
// import StatusIcon from "@/app/components/internal/eventdetail/icons/status";
// import StatusIcon2 from "@/app/components/internal/eventdetail/icons/status2";
import StatusEnd from "@/app/components/internal/eventdetail/icons/statusEnd";
import StatusMid from "@/app/components/internal/eventdetail/icons/statusMid";
import StatusStart from "@/app/components/internal/eventdetail/icons/statusStart";

// interface Props {
//   eventId: string;
//   enquiryId: string;
// }

export const OutreachProgressBar = () => {
  const { outreachConfiguration } = useConfiguration.outreach();
  const currentStatus = "IN_NEGOTIATION";

  const currentIndex =
    outreachConfiguration?.outreach?.findIndex(
      (item: any) => item.status === currentStatus
    ) || 0;

  return (
    <div className="flex justify-evenly rounded-md my-3 border p-3 px-5 gap-4 bg-accent">
      {outreachConfiguration?.outreach.map((item, index: number) => {
        const isActive = index <= currentIndex;

        if (item.status !== "PENDING" && item.status !== "REJECTED") {
          return (
            <div
              key={index}
              className="text-white cursor-pointer text-base relative text-center"
              //   onClick={() => handleStatusChange(item.status)}
            >
              {item.status === "SHORTLISTED" ? (
                <StatusStart
                  fillColor={
                    isActive
                      ? "var(--primary-color)"
                      : "var(--primary-foreground)"
                  }
                  borderColor={isActive ? "var(--primary-color)" : "#C9C9C9"}
                />
              ) : item.status === "IN_DISCUSSION" ||
                item.status === "IN_NEGOTIATION" ||
                item.status === "CONFIRMED" ? (
                <StatusMid
                  fillColor={
                    isActive
                      ? "var(--primary-color)"
                      : "var(--primary-foreground)"
                  }
                  borderColor={isActive ? "var(--primary-color)" : "#C9C9C9"}
                />
              ) : item.status === "CANCELLED" ? (
                <StatusEnd
                  fillColor={isActive ? "var(--primary-color)" : "var(--primary-foreground)"}
                  borderColor={isActive ? "var(--primary-color)" : "#C9C9C9"}
                />
              ) : (
                <></>
              )}

              {item.status !== "PENDING" && item.status !== "REJECTED" && (
                <div
                  className={`absolute top-0 h-full w-full flex items-center justify-center truncate text-xs md:text-sm ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
