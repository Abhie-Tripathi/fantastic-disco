"use client"

import React, { useState, useEffect } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"
import { useFilterState } from "@/hooks/useFilterState"

const visitorRanges = [
  { id: "0-100", label: "0-100", min: 0, max: 100 },
  { id: "100-500", label: "100-500", min: 100, max: 500 },
  { id: "500-1k", label: "500 - 1k", min: 500, max: 1000 },
  { id: "1k-5k", label: "1k - 5k", min: 1000, max: 5000 },
  { id: "5k-20k", label: "5k - 20k", min: 5000, max: 20000 },
  { id: "20k-50k", label: "20k - 50k", min: 20000, max: 50000 },
  { id: "50k-200k", label: "50k - 200k", min: 50000, max: 200000 },
  { id: "200k+", label: "200k+", min: 200000, max: Infinity },
]
interface VisitorsProps{
  source: string,
  selectedRanges?: string[],
  setSelectedRanges?: React.Dispatch<React.SetStateAction<string[]>>,
}
export default function EstimatedVisitorsSelector({
  source,
  selectedRanges: parentSelectedRanges=[],
  setSelectedRanges: parentSetSelectedRanges,
}:VisitorsProps) {
  const { setFilter, getFilterValue, searchParams } = useFilterState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRangesLocal, setSelectedRangesLocal] = React.useState<string[]>(
    []
  );

  const selectedRanges =
    source === "tracker" ? parentSelectedRanges : selectedRangesLocal;
  const setSelectedRanges =
    source === "tracker" ? parentSetSelectedRanges : setSelectedRangesLocal;

  useEffect(() => {
    if(source!=="tracker"){
    const estimatedVisitors = getFilterValue("estimatedVisitors")
    if (estimatedVisitors) {
      const ranges = estimatedVisitors.split(",")
      const selected = visitorRanges.filter((range) =>
        ranges.some((r) => {
          const [min, max] = r.split("-").map(Number)
          return range.min === min && (range.max === max || (max === undefined && range.max === Infinity))
        })
      )
      setSelectedRanges?.(selected.map((range) => range.id))
    } else {
      setSelectedRanges?.([])
    }
  }
  }, [getFilterValue])

  const handleRangeToggle = (rangeId: string) => {
    console.log(rangeId);
    
    setSelectedRanges?.((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    )
  }

  const handleApply = () => {
    if (selectedRanges.length > 0) {
      const selectedRangesData = visitorRanges.filter((range) =>
        selectedRanges.includes(range.id)
      )
      if(source!=="tracker"){
      const rangeStrings = selectedRangesData.map((range) =>
        range.max === Infinity ? `${range.min}` : `${range.min}-${range.max}`
      )
      setFilter("estimatedVisitors", rangeStrings.join(","))
    }
    } else {
      if(source!=="tracker")
      setFilter("estimatedVisitors", "")
    }
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      if (!open) handleApply()
      setIsOpen(open)
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          <span className="flex items-center gap-2">
            Estimated Visitors
            {selectedRanges.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedRanges.length}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="p-4 space-y-4">
          {visitorRanges.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <Checkbox
                id={range.id}
                checked={selectedRanges.includes(range.id)}
                onCheckedChange={() => handleRangeToggle(range.id)}
              />
              <Label htmlFor={range.id}>{range.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}