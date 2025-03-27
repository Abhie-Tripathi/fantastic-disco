"use client";
import {
  PieChart,
  BarChart3,
  LineChart,
  Map,
  CalendarIcon,
  TreesIcon as TreeSquare,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getPlaceholderStyle = (id: string) => {
  switch (id) {
    case "geographic-events":
      return "bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20";
    case "economic-impact":
      return "bg-gradient-to-br from-primary/30 to-primary/10";
    case "visitor-flow":
      return "bg-gradient-to-tr from-primary/20 via-primary/30 to-primary/10";
    case "event-calendar":
      return "bg-gradient-to-bl from-primary/25 to-primary/5";
    case "audience-demographics":
      return "bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10";
    case "trend-analysis":
      return "bg-gradient-to-tr from-primary/20 to-primary/5";
    default:
      return "bg-primary/10";
  }
};

const chartTemplates = [
  {
    id: "geographic-events",
    icon: <Map className="w-6 h-6" />,
    image: "https://d3-graph-gallery.com/img/graph/choropleth_basic.png",
    title: "Geographic Event Distribution",
    description:
      "Analyze event distribution across regions with interactive heatmaps and bubble overlays",
    tags: ["Geography", "Heatmap", "Distribution"],
    useCase: "Number of events happening in a geography across duration",
  },
  {
    id: "economic-impact",
    icon: <BarChart3 className="w-6 h-6" />,
    image:
      "https://d3-graph-gallery.com/img/graph/barplot_stacked_basicWide.png",
    title: "Economic Impact Analysis",
    description:
      "Track and compare economic impact across regions with stacked bar charts",
    tags: ["Economics", "Comparison", "Trends"],
    useCase: "Economic impact in a geography across duration",
  },
  {
    id: "visitor-flow",
    icon: <TreeSquare className="w-6 h-6" />,
    image: "https://d3-graph-gallery.com/img/graph/treemap_basic.png",
    title: "Visitor Flow Treemap",
    description:
      "Visualize visitor distribution and flow patterns using interactive treemaps",
    tags: ["Visitors", "Flow", "Distribution"],
    useCase: "Top countries coming to visit a geography",
  },
  {
    id: "event-calendar",
    icon: <CalendarIcon className="w-6 h-6" />,
    image: "https://d3-graph-gallery.com/img/graph/heatmap_basic.png",
    title: "Event Calendar View",
    description: "Track event frequency and distribution across time periods",
    tags: ["Calendar", "Timeline", "Frequency"],
    useCase: "Event patterns and distribution over time",
  },
  {
    id: "audience-demographics",
    icon: <PieChart className="w-6 h-6" />,
    image: "https://d3-graph-gallery.com/img/graph/pie_basic.png",
    title: "Audience Demographics",
    description:
      "Break down audience composition with interactive pie and donut charts",
    tags: ["Demographics", "Composition", "Analysis"],
    useCase: "Audience zone distribution analysis",
  },
  {
    id: "trend-analysis",
    icon: <LineChart className="w-6 h-6" />,
    image: "https://d3-graph-gallery.com/img/graph/line_basic.png",
    title: "Trend Analysis",
    description:
      "Track key metrics over time with multi-line charts and annotations",
    tags: ["Trends", "Time Series", "Metrics"],
    useCase: "Footfall and attendance trends",
  },
].map((template) => ({
  ...template,
  image: template.image || "/images/charts/placeholder-chart.png",
}));

export default function ChartTemplatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background/10 to-background">
      <div className="mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr place-items-center">
          {chartTemplates.map((template) => (
            <Link
              key={template.id}
              href={`visualize/${template.id}`}
              className="transform hover:scale-105 transition-all duration-200 max-w-sm"
            >
              <Card className="group hover:shadow-xl transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/50 flex flex-col h-full ">
                <CardHeader className="flex-none pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200 line-clamp-1">
                        {template.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div
                    className={`relative aspect-[2/1] w-full overflow-hidden rounded-lg ${getPlaceholderStyle(
                      template.id
                    )} flex items-center justify-center`}
                  >
                    {template.image ? (
                      <img
                        src={template.image}
                        alt={template.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      template.icon && (
                        <div className="w-10 h-10 opacity-50">
                          {template.icon}
                        </div>
                      )
                    )}
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {template.description}
                  </CardDescription>
                  <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {template.tags.map((tag) => (
                        <Badge
                          key={tag}
                          // variant="secondary"
                          // className="bg-primary/10 text-primary hover:bg-primary/20 text-xs px-2.5 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      <strong className="font-medium">Use Case:</strong>{" "}
                      {template.useCase}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}