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
import FetchedTracker from "./FetchedTracker";

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
      metrics: true,
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
      metrics: true,
    },
    category: "share",
  },
];

type TemplatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: TemplateType) => void;
};

const TemplatesModal = ({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplatesModalProps) => {
//   const categories = [
//     {
//       id: "share",
//       name: "Market Share Analysis",
//       description: "Compare event distribution and mindshare",
//       icon: <LayoutGrid className="w-4 h-4" />,
//     }
//   ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[50%] h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="tracking-normal">
            Brand Brief Builder
          </DialogTitle>
          <div className="flex gap-2 w-[29rem] bg-[var(--background-secondary-color)] p-2">
                          <div className="border-[var(--border-color)] rounded-[var(--border-radius-sm)] border flex p-1 w-full hover:border-[#D2D2F3] focus-within:border-[#D2D2F3] transition-all duration-200 bg-[var(--accent-foreground)]">
                          <input type="text" placeholder="Enter Web URL" className="border-none outline-none bg-transparent w-full"/>
                          <Button className="w-[100%] sm:w-[25%] bg-[var(--dashboard-brandkit-subtext)] text-white rounded-[var(--border-radius-sm)] flex items-center justify-center gap-2"
                          onClick={() => {
                            console.log("Setting showFetchedData to true");
                            setShowFetchedData(true);
                          }}
                          >Fetch</Button>
                          </div>
                          </div>
          {/* <DialogDescription>
            Choose a template to quickly analyze specific event trends
          </DialogDescription> */}
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] px-6 pb-6">
          <div className="space-y-4">
            <FetchedTracker/>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesModal;
