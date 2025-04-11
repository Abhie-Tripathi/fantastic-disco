import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, ChevronRight } from "lucide-react";
import { TemplateType } from "./templates-modal";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateHistoryProps {
  history: TemplateType[];
  onSelect: (template: TemplateType) => void;
  activeTemplateId?: string;
}

export function TemplateHistory({
  history,
  onSelect,
  activeTemplateId,
}: TemplateHistoryProps) {
  if (history.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-muted-foreground">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Recently Used Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {history.map((template, index) => (
            <DropdownMenuItem
              key={`${template.id}-${index}`}
              className="flex items-center justify-between cursor-pointer"
              disabled={template.id === activeTemplateId}
              onClick={() => onSelect(template)}
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-muted">
                  {template.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{template.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {template.category}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 