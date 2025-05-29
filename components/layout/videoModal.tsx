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

type VideoModalProps = {
  source: string;
  variant?: "icon" | "text";
};

const videoLinks: Record<string, string> = {
  coordinate: "/walkthrough/coordinate-gtm.mp4",
  eventSearch: "/walkthrough/event-search.mp4",
  companies: "/walkthrough/company-search.mp4",
  trackers: "/walkthrough/tracker-gtm.mp4",
  trends: "/walkthrough/trends-gtm.mp4",
  intelScore: "/walkthrough/intel-score.mp4",
  search: "/walkthrough/search-combined.mp4",
};

const VideoModal = ({ source, variant = "icon" }: VideoModalProps) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleVideoModal = () => {
    setShowVideoModal(true);
  };

  if (!videoLinks[source]) {
    console.log("path not found!!");
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
              <Button
                size="sm"
                variant="secondary"
                className="px-2 py-0"
                onClick={handleVideoModal}
              >
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
              <p>Video Walkthrough</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl  p-0 gap-0 z-[11000]">
          <DialogHeader className="px-6 pt-6"></DialogHeader>
          <div className="h-full p-2 pt-5">
            <video
              className="object-cover rounded-md border-none"
              width="100%"
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
