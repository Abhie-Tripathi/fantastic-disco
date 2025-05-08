"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFilterContext } from "@/context/filterContext";
import { useToast } from "@/hooks/use-toast";
import { useFilterState } from "@/hooks/useFilterState";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface CreateTrackerDialog {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function CreateTrackerDialogShared({
  open,
  onOpenChange,
}: CreateTrackerDialog) {
  const [trackerName, setTrackerName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name: string) => {
    if (name.trim().length === 0) {
      return "Tracker name cannot be empty";
    }
    if (name.length > 50) {
      return "Tracker name must be 50 characters or less";
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTrackerName(newName);
    setError(validateName(newName));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="tracking-normal">Create Tracker</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Input
              id="name"
              placeholder="Enter Tracker Name"
              value={trackerName}
              onChange={handleNameChange}
              aria-invalid={error ? "true" : "false"}
              aria-describedby="name-error"
            />
            {error && (
              <p id="name-error" className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#6E56CF] hover:bg-[#644fc0]"
            onClick={() => {}}
            disabled={isLoading || !!error}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
