"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bookmark, BookmarkCheck, BookmarkIcon, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Interest } from "@/types/events";
import { useConfiguration } from "@/hooks/useConfiguration";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntent } from "@/hooks/useIntent";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { eventsKeys } from "@/hooks/useEvents";
import { useTrackerContext } from "@/context/tracker";

interface ActionPopoverProps {
  eventId: string;
  interests: Interest | undefined;
  trackerId?:string;
}

export function ActionPopover({
  eventId,
  interests,
  trackerId
}: ActionPopoverProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {setSavedEventCount, savedEventCount}=useTrackerContext(); 
  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error,
  } = useConfiguration.interest();
  const { createUserEventInterest, isLoading: isSubmitting } =
    useIntent.createUserEventInterest();
  const [selectedAction, setSelectedAction] = useState<string | undefined>(
    interests?.bookmark
      ? "BOOKMARK"
      : interests?.speak
      ? "SPEAK"
      : interests?.sponsor
      ? "SPONSOR"
      : interests?.attend
      ? "ATTEND"
      : interests?.exhibit
      ? "EXHIBIT"
      : undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    ...interestConfiguration?.interest || [],
    ...(!interests?.bookmark ? [{ label: "Bookmark", status: "BOOKMARK" }] : [{ label: "Un-Bookmark", status: "UN-BOOKMARK" }]),
  ];
  const handleSubmit = async() => {
    if (selectedAction) {
      if(selectedAction==="UN-BOOKMARK"){
        const response = await fetch(
          `https://api.dev.gtm.whr.ai/intents/user-event-interest/${eventId}`,
          {
            method: "DELETE",
          })
      }else{
      createUserEventInterest(
        {
          eventId,
          interest: selectedAction,
          sourceModule: trackerId ? "TRACKER" : "RESEARCH",
          ...(trackerId && { sourceId: trackerId }),
        },
        {
          onSuccess: () => {
            console.log(eventsKeys);
            
            queryClient.invalidateQueries({ queryKey: eventsKeys.all });
            setSavedEventCount(savedEventCount+1);
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
              description: "Failed to record your interest. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    }
    }
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