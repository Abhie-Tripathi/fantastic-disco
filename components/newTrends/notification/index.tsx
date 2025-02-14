//@ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pause, Pencil, Search } from "lucide-react";
import {
  act,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import PlayPause from "/public/play_pause.svg";
import Edit from "/public/edit.svg";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columnsDropdown, trendsNotificationFormDropdown } from "@/data/trends";
import { Input } from "@/components/new-ui/Input/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Thresholds } from "@/types";

const TrendsNotification = ({
  threshold,
  thresholds,
  activeColumn,
  showNotificationForm,
  setShowNotificationForm,
}: {
  threshold: number;
  thresholds: Thresholds;
  activeColumn: keyof Thresholds;
  showNotificationForm: boolean;
  setShowNotificationForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [thresholdArea, setThresholdArea] = useState({
    lowerThreshold: threshold * 0.5,
    upperThreshold: threshold * 1.5,
  });
  useEffect(() => {
    setThresholdArea({
      lowerThreshold: threshold * 0.5,
      upperThreshold: threshold * 1.5,
    });
  }, [threshold]);
  const handleInputChange = (e: { target: { value: any } }) => {
    setThresholdArea({
      ...thresholdArea,
      lowerThreshold: e.target.value,
    });
  };
  return (
    <Dialog
      open={showNotificationForm}
      onOpenChange={() => setShowNotificationForm(false)}
    >
      <DialogContent className="flex flex-col gap-5 max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between mt-4">
          <DialogTitle className="text-xl text-primary font-semibold">
            Configure Notifications
          </DialogTitle>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-1">
              <Image
                src={PlayPause}
                width={20}
                height={20}
                alt="PlayPause Icon"
              />
              <span className="text-primary font-semibold">Pause</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Image src={Edit} width={20} height={20} alt="Edit Icon" />
              <span className="text-primary font-semibold"> Edit</span>
            </Button>
          </div>
        </DialogHeader>
        <div className="w-full">
          <Swiper
            className="w-full h-full"
            modules={[Navigation, Pagination]}
            grabCursor={true}
            centeredSlides={true}
            spaceBetween={1}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            onSwiper={(swiper) => setTotalSlides(swiper.slides.length)}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
            }}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
            }}
          >
            <SwiperSlide>
              <div className="flex flex-col gap-2">
                <div className="flex w-1/2 self-end gap-4">
                  <Label className="flex-1">Lower</Label>
                  <Label className="flex-1">Upper</Label>
                </div>
                <ul className="flex flex-col gap-4">
                  {columnsDropdown
                    .filter((option) =>
                      Object.keys(thresholds).includes(option.value)
                    )
                    .map((option) => (
                      <li className="" key={option.value}>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-sm flex-1">
                            {option.label}
                          </p>
                          <div className="flex gap-4 flex-1">
                            <div className="flex">
                              <input
                                type="number"
                                className="w-full px-1 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                value={thresholds[option.value as keyof Thresholds] * 0.5 || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="flex">
                              <input
                                type="number"
                                className="w-full px-1 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                value={thresholds[option.value as keyof Thresholds] * 1.5 || ""}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col gap-6">
                <div className="flex gap-6 justify-between">
                  <div className="flex flex-col flex-1">
                    <p className="font-semibold text-sm">FREQUENCY</p>
                    <span className="text-[#425466] text-sm">
                      Set notifications frequency
                    </span>
                  </div>
                  <Select
                  // onValueChange={(value) => {
                  //   field.onChange(value);
                  //   setIndustry(value);
                  // }}
                  // defaultValue={field.value || ""}
                  >
                    <SelectTrigger id="frequency" className="flex-1">
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {trendsNotificationFormDropdown.map((data, index) => (
                        <SelectItem
                          value={data.value}
                          key={data.label}
                          id={data.label}
                        >
                          {data.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <hr className=""></hr>
                <div className="flex justify-between">
                  <div className="flex flex-col flex-1">
                    <p className="font-semibold text-sm">MANAGE RECIPIENTS</p>
                    <span className="text-[#425466] text-sm">
                      Manage users to be notified.
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold">Users (12)</p>
                    <div className="relative w-full max-w-md">
                      <input
                        type="text"
                        placeholder="Search Members"
                        className="w-inherit text-sm pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <Search
                        width={16}
                        height={16}
                        stroke="#A8A8A8"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      />
                    </div>
                    <ul>
                      {Array.from({ length: 3 }, (_, index) => (
                        <li key={index} className="flex justify-between py-4">
                          <div className="flex items-center gap-4">
                            <Checkbox />
                            <Avatar>
                              {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                              <AvatarFallback>JJ</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">
                                John Joffery
                              </p>
                              <span className="text-sm text-foreground">
                                Managing Director
                              </span>
                            </div>
                          </div>
                          <p className="text-foreground">
                            johnjoff@radisson.com
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <button
              disabled={activeIndex === 0}
              className={`prev flex gap-2 ${
                activeIndex === 0 ? "opacity-50" : ""
              } text-primary font-medium justify-center items-center absolute left-10 bottom-0 transform -translate-y-1/2 z-10 cursor-pointer w-4 h-4`}
            >
              &#8592;
              <p>Prev</p>
            </button>
            <button
              disabled={activeIndex === totalSlides - 1}
              className={`next flex gap-2 ${
                activeIndex === totalSlides - 1 ? "opacity-50" : ""
              } text-primary font-medium justify-center items-center absolute left-28 bottom-0 transform -translate-y-1/2 z-10 cursor-pointer w-4 h-4`}
            >
              <p>Next</p>
              &#8594;
            </button>
            {/* <div className="custom-pagination flex justify-center mt-4"></div> */}
          </Swiper>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TrendsNotification;
