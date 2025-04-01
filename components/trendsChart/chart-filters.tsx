"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import LocationSelector from "../search/location"
import CategorySelector from "../search/categorySelector"
import DateRangeSelector from "../search/dateRange"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useFilterContext } from "@/context/filterContext"

type HierarchyLevel = {
  id: string;
  label: string;
  value: string;
};

const HIERARCHY_OPTIONS = [
  { id: "location", label: "Location" },
  { id: "category", label: "Category" },
  { id: "maturity", label: "Maturity Level" },
  { id: "time", label: "Time Period" },
  // Add more hierarchy options as needed
] as const;

interface ChartFiltersProps {
  type: string;
  onFiltersChange?: (filters: any) => void;
}

interface SortableItemProps {
  level: HierarchyLevel;
  index: number;
  onValueChange: (newValue: string) => void;
  onRemove: () => void;
  disabled: boolean;
}

function SortableItem({ level, index, onValueChange, onRemove, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: level.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 bg-white rounded-md p-1 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-muted rounded p-1"
      >
        <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <Select
        value={level.value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {HIERARCHY_OPTIONS.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id}
              disabled={disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={onRemove}
        className="shrink-0"
      >
        ×
      </Button>
    </div>
  );
}

export function ChartFilters({ type, onFiltersChange }: ChartFiltersProps) {
  const { applyFilters } = useFilterContext();
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([
    { id: "location", label: "Location", value: "location" },
    { id: "category", label: "Category", value: "category" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setHierarchyLevels((levels) => {
        const oldIndex = levels.findIndex((level) => level.id === active.id);
        const newIndex = levels.findIndex((level) => level.id === over.id);
        return arrayMove(levels, oldIndex, newIndex);
      });
    }
  };

  // Function to add new hierarchy level
  const addHierarchyLevel = (option: typeof HIERARCHY_OPTIONS[number]) => {
    setHierarchyLevels([...hierarchyLevels, {
      id: option.id,
      label: option.label,
      value: option.id
    }]);
  };

  // Function to remove hierarchy level
  const removeHierarchyLevel = (index: number) => {
    setHierarchyLevels(hierarchyLevels.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onFiltersChange?.({ hierarchyLevels });
    applyFilters();
  };

  return (
    <div className="space-y-4">
      <LocationSelector />
      <DateRangeSelector />

      {type === "visitor-flow" && (
        <div className="space-y-4">
          <Label>Hierarchy Levels</Label>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={hierarchyLevels.map(level => level.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {hierarchyLevels.map((level, index) => (
                  <SortableItem
                    key={level.id}
                    level={level}
                    index={index}
                    onValueChange={(newValue) => {
                      const newLevels = [...hierarchyLevels];
                      newLevels[index].value = newValue;
                      setHierarchyLevels(newLevels);
                    }}
                    onRemove={() => removeHierarchyLevel(index)}
                    disabled={hierarchyLevels.some(
                      (l, i) => i !== index && l.value === level.value
                    )}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add New Level Button */}
          {hierarchyLevels.length < HIERARCHY_OPTIONS.length && (
            <Select
              onValueChange={(value) => {
                const option = HIERARCHY_OPTIONS.find(opt => opt.id === value);
                if (option) addHierarchyLevel(option);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add hierarchy level" />
              </SelectTrigger>
              <SelectContent>
                {HIERARCHY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    disabled={hierarchyLevels.some(level => level.value === option.id)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <Button onClick={handleApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}
