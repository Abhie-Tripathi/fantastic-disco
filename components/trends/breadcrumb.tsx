import { ChevronRight, X } from "lucide-react";
import { HierarchyLevel } from "@/utils/chart-options";
import { Badge } from "../ui/badge";

interface BreadcrumbProps {
  levels: HierarchyLevel[];
  currentLevel: number;
  onLevelClick: (level: number) => void;
  path: Array<{ name: string; value: string }>;
}

export function Breadcrumb({
  levels,
  currentLevel,
  onLevelClick,
  path,
}: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      {path.map((item, index) => (
        <div key={index} className="flex items-center">
          <Badge
            variant="secondary"
            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
          >
            {levels[index]?.label}: {item.name}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => onLevelClick(index)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
          {index < path.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}
