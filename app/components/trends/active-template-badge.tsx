import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, AlertCircle } from "lucide-react";
import { TemplateType } from "./templates-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActiveTemplateBadgeProps {
  template: TemplateType;
  onRemove: () => void;
  onReapply: () => void;
  hasModifiedFilters?: boolean;
}

export function ActiveTemplateBadge({
  template,
  onRemove,
  onReapply,
  hasModifiedFilters = false,
}: ActiveTemplateBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-primary/10">
          {template.icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{template.title}</span>
          <div className="flex items-center gap-1.5">
            <Badge 
              variant="secondary" 
              className="text-[10px] px-1 py-0 h-4"
            >
              {template.visualization}
            </Badge>
            {hasModifiedFilters && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-1 py-0 h-4 text-yellow-600 border-yellow-200 bg-yellow-50"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Modified
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Template filters have been modified</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {hasModifiedFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs hover:bg-primary/10"
            onClick={onReapply}
          >
            <Clock className="w-3 h-3 mr-1" />
            Reapply
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-primary/10"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 