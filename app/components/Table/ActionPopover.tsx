"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookmarkIcon, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Interest } from "@/types/events";

interface ActionPopoverProps {
  interests: Interest | undefined;
  onSubmit: (value: string) => void;
}

const actions = [
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
  { value: "bookmark", label: "Bookmark" },
] as const;

type ActionType = (typeof actions)[number]["value"];

export function ActionPopover({ interests, onSubmit }: ActionPopoverProps) {
  const [selectedAction, setSelectedAction] = useState<
    ActionType | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (selectedAction) {
      onSubmit(selectedAction);
      setIsOpen(false);
      setSelectedAction(undefined);
    }
  };

  const isSaved =
    interests?.bookmark ||
    interests?.speak ||
    interests?.sponsor ||
    interests?.attend ||
    interests?.exhibit;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <BookmarkIcon
            className={isSaved ? "fill-primary" : "text-muted-foreground"}
            width={16}
            height={16}
          />
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
            onValueChange={(value: ActionType) => setSelectedAction(value)}
            className="space-y-3"
          >
            {actions.map((action) => (
              <div key={action.value} className="flex items-center space-x-2">
                <RadioGroupItem value={action.value} id={action.value} />
                <Label htmlFor={action.value} className="text-sm font-normal">
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
