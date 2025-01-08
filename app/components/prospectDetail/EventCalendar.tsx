import Text from "@/components/new-ui/Text";
import { CircleSlash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Buildings, Filter, Users } from "geist-icons";

export const EventCalendar = () => {
  return (
    <div className="flex gap-6 max-xl:flex-col max-h-full">
      <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 w-full">
        <div className="flex justify-between">
          <Text
            color="primary"
            fontWeight="medium"
            variant="noMargin"
            size="large"
          >
            Event Calendar
          </Text>
        </div>

        <div>
          <Tabs
            defaultValue={"upcoming"}
            className="h-full overflow-y-auto w-full"
          >
            <div className="flex w-full justify-between">
              <TabsList className="grid grid-cols-2 h-auto px-2">
                <TabsTrigger
                  value="upcoming"
                  className="text-xs flex gap-2 items-center p-2"
                >
                  <Buildings
                    color="var(--muted-foreground)"
                    width="12px"
                    height="12px"
                  />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="text-xs flex gap-2 items-center p-2"
                >
                  <Users color="#666666" width="12px" height="12px" />
                  Past
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="">
              <div></div>
            </TabsContent>

            <TabsContent value="past" className="flex-grow overflow-hidden">
              <div className="px-4 py-2"></div>
            </TabsContent>
          </Tabs>
        </div>

        <ul className="h-80">
          <span className="text-[#666666] text-sm flex items-center gap-2">
            <CircleSlash width={15} height={15} />
            No data available
          </span>
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">Map Container</div>
    </div>
  );
};
