//@ts-nocheck

"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import type { ChartType } from "../types"

interface DataVisualizationProps {
  chartType: ChartType
  dateRange: [Date | undefined, Date | undefined]
}

export function DataVisualization({ chartType, dateRange }: DataVisualizationProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const options = getChartOptions(chartType)
    chartInstance.current.setOption(options)

    return () => {
      chartInstance.current?.dispose()
    }
  }, [chartType])

  return <div ref={chartRef} className="w-full h-[400px]" />
}

function getChartOptions(chartType: ChartType): echarts.EChartsOption {
  const baseOptions: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["01 Feb", "03 Feb", "05 Feb", "07 Feb", "09 Feb", "11 Feb", "13 Feb"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [24, 20, 30, 28, 18, 30, 42],
        type: chartType === "area" ? "line" : chartType,
        areaStyle: chartType === "area" ? {} : undefined,
        smooth: true,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
      },
    ],
  }

  return baseOptions
}

