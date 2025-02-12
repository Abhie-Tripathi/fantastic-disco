import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowUpDown, ChevronDown, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useFilterState } from "@/hooks/useFilterState";

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: "title", label: "Title" },
  { value: "start", label: "Start Date" },
  { value: "end", label: "End Date" },
  { value: "added", label: "Date Added" },
  { value: "updated", label: "Last Updated" },
  { value: "visitors", label: "Visitors" },
  { value: "exhibitors", label: "Exhibitors" },
  { value: "duration", label: "Duration" },
  { value: "inboundScore", label: "Inbound Score" },
  { value: "impactScore", label: "Impact Score" },
  { value: "internationalScore", label: "International Score" },
  { value: "inboundEstimate", label: "Inbound Estimate" },
  { value: "internationalEstimate", label: "International Estimate" },
  { value: "distance", label: "Distance" },
  { value: "status", label: "Status" },
  { value: "score", label: "Score" },
];

const SortDropdown = () => {
  const { getFilterValue, setFilter } = useFilterState();
  const [open, setOpen] = useState(false);

  // Get initial sort value from URL
  const sortParam = getFilterValue("sortBy") || "start";
  const [sortField, setSortField] = useState(sortParam.replace("-", ""));
  const [sortOrder, setSortOrder] = useState(
    sortParam.startsWith("-") ? "desc" : "asc"
  );

  // Update button text based on current sort
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortField);
    return option?.label || "Sort by";
  };

  const handleApply = () => {
    const sortValue = sortOrder === "desc" ? `-${sortField}` : sortField;
    setFilter("sortBy", sortValue);
    setOpen(false);
  };

  // Update local state when URL changes
  useEffect(() => {
    const newSortParam = getFilterValue("sortBy") || "start";
    setSortField(newSortParam.replace("-", ""));
    setSortOrder(newSortParam.startsWith("-") ? "desc" : "asc");
  }, [getFilterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4" />
            {getCurrentSortLabel()}
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by</span>
            <Info className="h-4 w-4 text-muted-foreground hover:cursor-help" />
          </div>

          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleApply} className="place-self-end">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortDropdown;
