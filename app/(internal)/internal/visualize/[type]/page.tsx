"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as echarts from "echarts";
import { Button } from "@/components/ui/button";
import { ChartFilters } from "@/components/trendsChart/chart-filters";
import { getChartOptions } from "@/utils/chart-options";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function VisualizePage() {
  const params = useParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("isLoading", isLoading);

  useEffect(() => {
    if (!chartRef.current) return;
    setIsLoading(true);
    console.log("hiii");
    const chart = echarts.init(chartRef.current);
    const options = getChartOptions(params.type as string);

    try {
      chart.setOption(options);
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing chart:", error);
      setIsLoading(false);
    }

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [params.type, chartRef.current]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>

          {/* <h1 className="text-3xl font-bold text-gray-900">Configure Visualization</h1> */}
        </div>

        <div className="grid lg:grid-cols-[350px,1fr] gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <ChartFilters type={params.type as string} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {/* <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Visualization Preview</h2>
            </div> */}

            {isLoading ? (
              <div className="h-[600px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            ) : (
              <div ref={chartRef} className="w-full h-[600px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
