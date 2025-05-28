// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";

type VideoModalProps = {
  //   open: boolean;
  //   onOpenChange: (open: boolean) => void;
  source: string;
};

const videoLinks: Record<string, string> = {
  coordinate: "/walkthrough/coordinate-gtm.mp4",
  search: "/walkthrough/event-search.mp4",
  companies: "/walkthrough/people-search.mp4",
  people: "/walkthrough/people-search.mp4",
  trackers: "/walkthrough/tracker-gtm.mp4",
  trends: "/walkthrough/trends-gtm.mp4",
  intelScore: "/walkthrough/intel-score.mp4",
};

const VideoModal = ({ source }: VideoModalProps) => {
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
      <Button
        size="sm"
        variant="secondary"
        className="px-2 py-0"
        onClick={handleVideoModal}
      >
        <Play className="h-4 w-4" />
      </Button>

      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl  p-0 gap-0 z-[11000]">
          <DialogHeader className="px-6 pt-6">
            {/* <DialogTitle className="tracking-normal">
            Trend Analysis Templates
          </DialogTitle>
          <DialogDescription>
            Choose a template to quickly analyze specific event trends
          </DialogDescription> */}
          </DialogHeader>
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
