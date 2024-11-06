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

const exhibitorRanges = [
  { id: "0-100", label: "0-100", min: 0, max: 100 },
  { id: "100-500", label: "100-500", min: 100, max: 500 },
  { id: "500-1000", label: "500-1000", min: 500, max: 1000 },
  { id: "1000+", label: "1000+", min: 1000, max: Infinity },
]

interface EstimatedExhibitorProps {
  source: string;
  selectedRanges?: string[];
  setSelectedRanges?: React.Dispatch<React.SetStateAction<string[]>>; 
}

export default function EstimatedExhibitorsSelector({
  source,
  selectedRanges: parentSelectedRanges = [],
  setSelectedRanges: parentSetSelectedRanges,
}: EstimatedExhibitorProps) {

  const [isOpen, setIsOpen] = useState(false)
  const { setFilter, getFilterValue } = useFilterState()
  const [selectedRangesLocal, setSelectedRangesLocal] = useState<string[]>([])

  const selectedRanges = source === "tracker" ? parentSelectedRanges : selectedRangesLocal;
  const setSelectedRanges = source === "tracker" ? parentSetSelectedRanges : setSelectedRangesLocal;

  useEffect(() => {
    if(source!=="tracker"){
    const estimatedExhibitors = getFilterValue("estimatedExhibitors")
    if (estimatedExhibitors) {
      const ranges = estimatedExhibitors.split(",")
      const selected = exhibitorRanges.filter((range) =>
        ranges.some((r) => {
          const [min, max] = r.split("-").map(Number)
          return range.min === min && (range.max === max || (max === undefined && range.max === Infinity))
        })
      )
      setSelectedRanges?.(selected.map((range) => range.id))  // Guard against undefined setter
    } else {
      setSelectedRanges?.([])  // Guard against undefined setter
    }
}
  }, [getFilterValue, setSelectedRanges])

  const handleRangeToggle = (rangeId: string) => {
    setSelectedRanges?.((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    )
  }

  const handleApply = () => {
    if(source!=="tracker"){
    if (selectedRanges.length > 0) {
      const selectedRangesData = exhibitorRanges.filter((range) =>
        selectedRanges.includes(range.id)
      )
      const rangeStrings = selectedRangesData.map((range) =>
        range.max === Infinity ? `${range.min}` : `${range.min}-${range.max}`
      )

      setFilter("estimatedExhibitors", rangeStrings.join(","))
    } else {
      setFilter("estimatedExhibitors", "")
    }
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
            Estimated Exhibitors
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
          {exhibitorRanges.map((range) => (
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
