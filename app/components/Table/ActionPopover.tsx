"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrackerContext } from "@/context/tracker";
import { useToast } from "@/hooks/use-toast";
import { useConfiguration } from "@/hooks/useConfiguration";
import { useIntent } from "@/hooks/useIntent";
import { useTrackerServices } from "@/services/trackerServices";
import { Interest } from "@/types/events";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { useState } from "react";

interface ActionPopoverProps {
  eventId: string;
  interests: Interest | undefined;
  trackerId?: string;
  setInterest: any;
  setEventId: any;
  view?: string;
}

export function ActionPopover({
  eventId,
  interests,
  trackerId,
  setInterest,
  setEventId,
  view,
}: ActionPopoverProps) {
  console.log("Action Popover -> ",interests);
  const { removeBookmark } = useTrackerServices();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setSavedEventCount, savedEventCount } = useTrackerContext();
  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error,
  } = useConfiguration.interest();
  const { createUserEventInterest, isLoading: isSubmitting } =
    useIntent.createUserEventInterest();
  const [selectedAction, setSelectedAction] = useState<string | undefined>(
    () => {
      if (interests?.speak) return "SPEAK";
      if (interests?.sponsor) return "SPONSOR";
      if (interests?.attend) return "ATTEND";
      if (interests?.exhibit) return "EXHIBIT";
      if (interests?.bookmark) return "BOOKMARK";
      return undefined;
    }
  );
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    ...(interestConfiguration?.interest || []),
    ...(!interests?.bookmark
      ? [{ label: "Bookmark", status: "BOOKMARK" }]
      : [{ label: "Un-Bookmark", status: "UN-BOOKMARK" }]),
  ];
  const handleSubmit = async () => {
    // if (view === "bookmarked") {
    //   const response = await removeBookmark(
    //     interests?.bookmark?.interestId || ""
    //   );
    //   if (response?.interest && setInterest) {
    //     setInterest({
    //       [response.interest.toLowerCase()]: {
    //         interestId: response.id,
    //       },
    //     });
    //   }
    //   setSavedEventCount(savedEventCount - 1);
    //   setEventId(response?.eventId);
    //   setIsOpen(false);
    // } else if (selectedAction) {
    if (selectedAction === "UN-BOOKMARK") {
      const response = await removeBookmark(
        interests?.bookmark?.interestId || ""
      );
      if (response?.interest && setInterest) {
        if (selectedAction === "UN-BOOKMARK")
          setSavedEventCount(savedEventCount - 1);
        setInterest({
          [response.interest.toLowerCase()]: {
            interestId: response.id,
          },
        });
      }

      toast({
        title: "Success",
        description: "Your interest has been recorded",
        variant: "default",
      });
      setEventId(response?.eventId);
      setIsOpen(false);
    } else {
      createUserEventInterest(
        {
          eventId,
          interest: selectedAction || "",
          sourceModule: trackerId ? "TRACKER" : "RESEARCH",
          ...(trackerId && { sourceId: trackerId }),
        },
        {
          onSuccess: (response: any) => {
            if (response?.interest) {
              setInterest({
                [response.interest.toLowerCase()]: {
                  interestId: response.id,
                },
              });
            }
            if (response?.eventId && setEventId) {
              setEventId(response?.eventId);
            }
            if (selectedAction === "BOOKMARK")
              setSavedEventCount(savedEventCount + 1);
            setIsOpen(false);
            toast({
              title: "Success",
              description: "Your interest has been recorded",
              variant: "default",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
    // }
  };

  const isSaved =
    interests?.bookmark ||
    interests?.speak ||
    interests?.sponsor ||
    interests?.attend ||
    interests?.exhibit;

  if (error) {
    return <div>Error</div>;
  }

  if (isConfigLoading) {
    return <Skeleton className="w-4 h-4" />;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">
              Choose an <span className="text-primary">Action</span> to Proceed
            </h4>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <RadioGroup
            value={selectedAction}
            onValueChange={(value: string) => setSelectedAction(value)}
            className="space-y-3"
          >
            {actions.map((action) => (
              <div key={action.label} className="flex items-center space-x-2">
                <RadioGroupItem value={action.status} id={action.status} />
                <Label htmlFor={action.status} className="text-sm font-normal">
                  {action.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleSubmit}
            className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white mt-4"
            size="sm"
            disabled={!selectedAction}
          >
            Submit
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
