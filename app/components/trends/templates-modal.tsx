import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Building,
  Globe,
  LineChart,
  MapPin,
  Table,
  Users,
  TrendingUp,
  DollarSign,
  ArrowLeftRight,
  LayoutGrid,
} from "lucide-react";

export type TemplateType = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  visualization: string[];
  hierarchy?: { id: string; label: string; value: string }[];
  visibleFilters: {
    location?: boolean;
    eventTypes?: boolean;
    dateRange?: boolean;
    categories?: boolean;
    metrics?: boolean;
  };
  category: "traffic" | "share" | "impact" | "participation";
  version?: string;
};

const templates: TemplateType[] = [
  // Share Analysis Templates
  {
    id: "category-share",
    title: "Event Category Share",
    description: "Analyze event distribution across categories in a geography",
    icon: <LayoutGrid className="w-6 h-6" />,
    visualization: ["treemap"],
    hierarchy: [
      { id: "category", label: "Category", value: "category" },
      { id: "location", label: "Location", value: "location" },
    ],
    visibleFilters: {
      location: true,
      categories: true,
      dateRange: true,
      eventTypes: true,
      metrics: false,
    },
    category: "share",
  },
  {
    id: "country-share",
    title: "Event Country Share",
    description: "Compare event distribution across countries",
    icon: <Globe className="w-6 h-6" />,
    visualization: ["treemap"],
    hierarchy: [
      { id: "location", label: "Location", value: "location" },
      { id: "category", label: "Category", value: "category" },
    ],
    visibleFilters: {
      location: true,
      dateRange: true,
      categories: true,
      eventTypes: true,
      metrics: false,
    },
    category: "share",
  },

  // Mindshare Templates
  {
    id: "category-mindshare",
    title: "Category Mindshare",
    description: "Analyze event mindshare by category",
    icon: <TrendingUp className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      categories: true,
      location: true,
      dateRange: true,
      eventTypes: true,
      metrics: false,
    },
    category: "share",
    version: "coming soon",
  },
  {
    id: "country-mindshare",
    title: "Country Mindshare",
    description: "Compare event mindshare across countries",
    icon: <Globe className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      location: true,
      dateRange: true,
      categories: true,
      eventTypes: true,
      metrics: false,
    },
    category: "share",
    version: "coming soon",
  },

  // Traffic Analysis Templates
  {
    id: "inbound-traffic",
    title: "Inbound Traffic Analysis",
    description: "Track where people come from to a specific geography",
    icon: <ArrowLeftRight className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      location: true,
      eventTypes: true,
      dateRange: true,
      categories: true,
      metrics: false,
    },
    category: "traffic",
    version: "coming soon",
  },
  {
    id: "outbound-traffic",
    title: "Outbound Traffic Analysis",
    description: "Track where people go from a specific geography",
    icon: <ArrowLeftRight className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      location: true,
      eventTypes: true,
      dateRange: true,
      categories: true,
      metrics: false,
    },
    category: "traffic",
    version: "coming soon",
  },

  // Participation Templates
  {
    id: "category-participation",
    title: "Category Participation",
    description: "Analyze exhibitor participation by category",
    icon: <Users className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      categories: true,
      location: true,
      dateRange: true,
      eventTypes: true,
      metrics: false,
    },
    category: "participation",
    version: "coming soon",
  },
  {
    id: "country-participation",
    title: "Country Participation",
    description: "Compare exhibitor participation across countries",
    icon: <Building className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      location: true,
      dateRange: true,
      categories: true,
      eventTypes: true,
      metrics: false,
    },
    category: "participation",
    version: "coming soon",
  },

  // Economic Impact Templates
  {
    id: "geography-impact",
    title: "Geographic Economic Impact",
    description: "Analyze economic impact across geographies",
    icon: <DollarSign className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      location: true,
      dateRange: true,
      categories: true,
      eventTypes: true,
      metrics: false,
    },
    category: "impact",
    version: "coming soon",
  },
  {
    id: "category-impact",
    title: "Category Economic Impact",
    description: "Compare economic impact across event categories",
    icon: <BarChart3 className="w-6 h-6" />,
    visualization: ["treemap"],
    visibleFilters: {
      categories: true,
      location: true,
      dateRange: true,
      eventTypes: true,
      metrics: true,
    },
    category: "impact",
    version: "coming soon",
  },
];

type TemplatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: TemplateType) => void;
  activeTemplate?: TemplateType | null;
};

const TemplatesModal = ({
  open,
  onOpenChange,
  onSelectTemplate,
  activeTemplate,
}: TemplatesModalProps) => {
  const categories = [
    {
      id: "share",
      name: "Market Share Analysis",
      description: "Compare event distribution and mindshare",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: "traffic",
      name: "Traffic Analysis",
      description: "Analyze event attendance flows",
      icon: <ArrowLeftRight className="w-4 h-4" />,
    },
    {
      id: "participation",
      name: "Participation",
      description: "Track exhibitor participation",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "impact",
      name: "Economic Impact",
      description: "Measure event economic impact",
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="tracking-normal">
            {activeTemplate ? "Change Template" : "Trend Analysis Templates"}
          </DialogTitle>
          <DialogDescription>
            {activeTemplate
              ? "Select a new template to replace the current one"
              : "Choose a template to quickly analyze specific event trends"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] px-6 pb-6">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-2 bg-background">
                  {category.icon}
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {templates
                    .filter((template) => template.category === category.id)
                    .map((template) => (
                      <Card
                        key={template.id}
                        className={`p-4 transition-all ${
                          template.version
                            ? "opacity-70 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-md hover:border-primary/50"
                        } ${
                          activeTemplate?.id === template.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() =>
                          !template.version && onSelectTemplate(template)
                        }
                      >
                        <div className="flex flex-col h-full justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-lg ${
                                activeTemplate?.id === template.id
                                  ? "bg-primary text-white"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {template.icon}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {template.title}
                                </h4>
                                {activeTemplate?.id === template.id && (
                                  <Badge variant="default" className="text-xs">
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                              {template.visualization && (
                                <div className="flex gap-1 flex-wrap">
                                  {template.visualization.map(
                                    (visualization) => (
                                      <Badge
                                        key={visualization}
                                        variant="secondary"
                                        className="text-xs capitalize"
                                      >
                                        {visualization}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end items-center">
                            {template.version ? (
                              <Badge
                                variant="outline"
                                className="text-xs capitalize text-nowrap"
                              >
                                {template.version}
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectTemplate(template);
                                }}
                              >
                                Select Template
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesModal;
