//@ts-nocheck
"use client"

import type { ChartType } from "../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartSelectorProps {
  selectedType: ChartType
  onSelectType: (type: ChartType) => void
}

export function ChartSelector({ selectedType, onSelectType }: ChartSelectorProps) {
  return (
    <Select value={selectedType} onValueChange={(value) => onSelectType(value as ChartType)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select chart type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="line">Line Graph</SelectItem>
        <SelectItem value="heatmap">Heatmap</SelectItem>
        <SelectItem value="bar">Bar Chart</SelectItem>
        <SelectItem value="area">Area Chart</SelectItem>
        <SelectItem value="scatter">Scatter Plot</SelectItem>
      </SelectContent>
    </Select>
  )
}

