"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const participationOptions = [
  { value: "bookmark", label: "Bookmark" },
  { value: "attend", label: "Attend" },
  { value: "speak", label: "Speak" },
  { value: "exhibit", label: "Exhibit" },
  { value: "sponsor", label: "Sponsor" },
];

export default function ExhibitionParticipation() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("attend");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted value:", value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Participation Options</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Canadian National Exhibition
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <ScrollArea className="h-[180px] pr-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    How would you like to participate?
                  </p>
                  <RadioGroup
                    value={value}
                    onValueChange={setValue}
                    className="space-y-2"
                  >
                    {participationOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </ScrollArea>
            </form>
          </CardContent>
          <CardFooter className="pb-4">
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
