"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { isEventeli } from "@/config";

type VideoModalProps = {
  source: string;
  variant?: "icon" | "text";
};

const cdnLink = "https://c1.10times.com";

const gtmVideoLinks: Record<string, string> = {
  coordinate: cdnLink + "/walkthrough/coordinate-gtm.mp4",
  eventSearch: cdnLink + "/walkthrough/event-search.mp4",
  companies: cdnLink + "/walkthrough/company-search.mp4",
  trackers: cdnLink + "/walkthrough/tracker-gtm.mp4",
  trends: cdnLink + "/walkthrough/trends-gtm.mp4",
  intelScore: cdnLink + "/walkthrough/intel-score.mp4",
  search: cdnLink + "/walkthrough/search-combined.mp4",
};

const geoVideoLinks: Record<string, string> = {
  coordinate: cdnLink + "/walkthrough/coordinate-gtm.mp4",
  eventSearch: cdnLink + "/walkthrough/event-search.mp4",
  companies: cdnLink + "/walkthrough/company-search.mp4",
  // trackers: cdnLink + "/walkthrough/tracker-gtm.mp4",
  trends: cdnLink + "/walkthrough/trends-gtm.mp4",
  intelScore: cdnLink + "/walkthrough/intel-score.mp4",
  search: cdnLink + "/walkthrough/search-combined.mp4",
};

const VideoModal = ({ source, variant = "icon" }: VideoModalProps) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const videoLinks = isEventeli ? geoVideoLinks : gtmVideoLinks;

  const handleVideoModal = () => {
    setShowVideoModal(true);
  };

  if (!videoLinks[source]) {
    return <></>;
  }

  return (
    <>
      {variant === "text" ? (
        <div
          className="text-xs text-primary font-medium flex gap-1 items-center cursor-pointer"
          onClick={handleVideoModal}
        >
          <Play className="h-3 w-3" />
          Video Walkthrough
        </div>
      ) : (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <div
                className="bg-secondary rounded-md px-2 h-8 inline-flex items-center"
                onClick={handleVideoModal}
              >
                <Play className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
              <p>Video Walkthrough</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="p-0 gap-0 z-[11000] max-w-3xl">
          <DialogHeader className="px-6 pt-6"></DialogHeader>
          <div className="w-full h-full p-2 pt-5">
            <video
              className="max-h-[80vh] w-full object-contain rounded-md border-none"
              autoPlay
              controls
            >
              <source src={videoLinks[source]} type="video/mp4" />
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoModal;