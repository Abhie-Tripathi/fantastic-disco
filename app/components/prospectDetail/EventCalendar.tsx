import Text from "@/components/new-ui/Text";
// import { CircleSlash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Buildings, Location, Plus, Users } from "geist-icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MapChart from "@/public/internal/MapChart.png";

export const EventCalendar = () => {
  return (
    <div className="flex gap-6 max-xl:flex-col">
      <div className="flex flex-1 flex-col gap-4 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 w-full">
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
                  disabled={true}
                >
                  <Users color="#666666" width="12px" height="12px" />
                  Past
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="">
              {/* <div className="flex flex-col gap-4"> */}
              <div className="flex flex-row gap-6 p-2 my-4">
                <div className="flex flex-col rounded-lg shadow-md h-14 w-14 border border-[var(--border-color)]">
                  <span className="bg-[var(--primary-light-color)] text-xs font-semibold text-primary text-center py-1 rounded-tl-md rounded-tr-md">
                    DEC
                  </span>
                  <span className="text-xs font-semibold text-center py-2">
                    12
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-1 flex-wrap">
                  <Text fontWeight="medium" variant="noMargin">
                    Clerkenwell Design Conference
                  </Text>
                  <p className="flex items-center gap-2 text-[12px] font-medium">
                    <Location color="var(--muted-foreground)" width="12px" height="12px" />
                    <span>London, UK</span>
                  </p>

                  <p className="text-[#666666] text-[12px]">
                    <span>May 01, Wednesday</span>
                  </p>

                  <p className="flex items-center gap-2 text-[12px] text-[#666666]">
                    <Plus
                      width="12px"
                      height="12px"
                      color="var(--muted-foreground)"
                    />
                    <span className="underline underline-offset-2">
                      Add to my calendar
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-6 p-2 my-4">
                <div className="flex flex-col rounded-lg shadow-md h-14 w-14 border border-[var(--border-color)]">
                  <span className="bg-[var(--primary-light-color)] text-xs font-semibold text-primary text-center py-1 rounded-tl-md rounded-tr-md">
                    DEC
                  </span>
                  <span className="text-xs font-semibold text-center py-2">
                    12
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-1 flex-wrap">
                  <Text fontWeight="medium" variant="noMargin">
                    Clerkenwell Design Conference
                  </Text>
                  <p className="flex items-center gap-2 text-[12px] font-medium">
                    <Location color="var(--muted-foreground)" width="12px" height="12px" />
                    <span>London, UK</span>
                  </p>

                  <p className="text-[#666666] text-[12px]">
                    <span>May 01, Wednesday</span>
                  </p>

                  <p className="flex items-center gap-2 text-[12px] text-[#666666]">
                    <Plus
                      width="12px"
                      height="12px"
                      color="var(--muted-foreground)"
                    />
                    <span className="underline underline-offset-2">
                      Add to my calendar
                    </span>
                  </p>
                </div>
              </div>
              {/* </div> */}

              <Button variant="outline" className="w-full text-primary my-2">
                See 4 more events
              </Button>
            </TabsContent>

            <TabsContent value="past" className="flex-grow overflow-hidden">
              <div className="px-4 py-2"></div>
            </TabsContent>
          </Tabs>
        </div>

        {/* <ul className="h-80">
          <span className="text-[#666666] text-sm flex items-center gap-2">
            <CircleSlash width={15} height={15} />
            No data available
          </span>
        </ul> */}
      </div>

      <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">
        <div className="flex justify-between">
          <Text
            color="primary"
            fontWeight="medium"
            variant="noMargin"
            size="large"
          >
            Events Participation
          </Text>
        </div>

        {/* Map Component */}
        <Image
          src={MapChart}
          alt="map"
          width={420}
          height={280}
          className="max-h-[300px] w-fill rounded-lg"
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] shadow-md border border-[var(--neutral-light-color)] p-2 rounded-md gap-2 w-auto h-full">
            <span className="text-[#6E6F89] text-xs">Events Attended</span>
            <span className="text-base font-bold">35</span>
          </div>

          <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] shadow-md border border-[var(--neutral-light-color)] p-2 rounded-md gap-2 w-auto h-full">
            <span className="text-[#6E6F89] text-xs">Most Attended in</span>
            <span className="text-base font-bold">Brazil</span>
          </div>

          <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] shadow-md border border-[var(--neutral-light-color)] p-2 rounded-md gap-2 w-auto h-full">
            <span className="text-[#6E6F89] text-xs">Other Countries..</span>
            <span className="text-base font-bold line-clamp-1">
              USA, China, India, South Africa
            </span>
          </div>
        </div>

        {/* <div className="flex justify-between">
          <Text
            color="primary"
            fontWeight="medium"
            variant="noMargin"
            size="large"
          >
            Industry Interests
          </Text>
        </div>
        <div className="flex gap-3 items-center text-base font-medium text-[var(--primary-color)] bg-[var(--background-secondary-color)] p-2 rounded-md">
          <Tag
            color="#6E6F89"
            width="16px"
            height="16px"
            style={{ fill: "red" }}
          />
          <span>Pharma</span>
          <span>Hospital</span>
          <span>Medicines</span>
        </div> */}
      </div>
    </div>
  );
};
