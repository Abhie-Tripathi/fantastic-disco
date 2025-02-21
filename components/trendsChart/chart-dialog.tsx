"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChartFilters } from "./chart-filters"
import type { ChartType } from "../types"
import { getChartOptions } from "../utils/chart-options"

interface ChartDialogProps {
  type: ChartType | null
  open: boolean
  onClose: () => void
}

export function ChartDialog({ type, open, onClose }: ChartDialogProps) {
  const [activeTab, setActiveTab] = useState("configure")
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  useEffect(() => {
    if (!chartRef.current || !open || activeTab !== "preview") return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const options = getChartOptions(type)
    chartInstance.current.setOption(options)

    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (activeTab !== "preview") {
        chartInstance.current?.dispose()
        chartInstance.current = undefined
      }
    }
  }, [type, open, activeTab])

  if (!type) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Configure Visualization</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="configure">
            <ChartFilters type={type} />
          </TabsContent>

          <TabsContent value="preview" className="min-h-[500px]">
            <div ref={chartRef} className="w-full h-[500px]" />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">Apply & Generate</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

