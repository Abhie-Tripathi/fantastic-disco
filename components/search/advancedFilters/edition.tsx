"use client";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterState } from "@/hooks/useFilterState";

const maturityLevels = [
  { id: "new", label: "New" },
  { id: "growing", label: "Growing" },
  { id: "established", label: "Established" },
  { id: "flagship", label: "Flagship" },
];

interface EditionProps {
  source: string;
  selectedStatus?: string;
  setSelectedStatus?: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditionSelector({
  source,
  selectedStatus: parentSelectedFormats = "",
  setSelectedStatus: parentSetSelectedFormats,
}: EditionProps) {
  const { setFilter, getFilterValue, searchParams } = useFilterState();
  const [selectedFormatsLocal, setSelectedFormatsLocal] =
    React.useState<string>("");

  const selectedStatus =
    source === "tracker" ? parentSelectedFormats : selectedFormatsLocal;
  const setSelectedStatus =
    source === "tracker" ? parentSetSelectedFormats : setSelectedFormatsLocal;

  useEffect(() => {
    if (source !== "tracker") setSelectedStatus?.(getFilterValue("maturity"));
  }, [searchParams]);

  const handleStatusChange = (value: string) => {
    if (value === selectedStatus) {
      setSelectedStatus?.("");
      if (source !== "tracker") setFilter("maturity", "");
    } else {
      setSelectedStatus?.(value);
      if (source !== "tracker") setFilter("maturity", value);
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="edition" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Maturity
              {selectedStatus && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  1
                </span>
              )}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4">
            <RadioGroup
              value={selectedStatus}
              onValueChange={handleStatusChange}
              className="space-y-2"
            >
              {maturityLevels.map((maturityLevel) => (
                <div
                  key={maturityLevel.id}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={maturityLevel.id}
                    id={maturityLevel.id}
                    onClick={(e) => {
                      if (selectedStatus === maturityLevel.id) {
                        e.preventDefault();
                        handleStatusChange(maturityLevel.id);
                      }
                    }}
                  />
                  <Label htmlFor={maturityLevel.id}>
                    {maturityLevel.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
