"use client";

import React, { useState, useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useFilterContext } from "@/context/filterContext";

const designationsData = [
  {
    id: "6cf777d1-4a39-58d3-9a7d-2a4d9fd94f59",
    name: "Agriculture & Forestry",
    slug: "agriculture-forestry",
    isEnabled: true,
  },
  {
    id: "f6e9db7c-ae7a-5dab-b4ef-0f44ed9f5ac5",
    name: "Animals & Pets",
    slug: "animals-pets",
    isEnabled: true,
  },
  {
    id: "78a6c448-4ea5-55aa-94bf-7f4d52c1207a",
    name: "Apparel & Clothing",
    slug: "apparel-fashion",
    isEnabled: true,
  },
  {
    id: "ec0f4cc4-a5ca-5d75-809a-c4e34b344647",
    name: "Arts & Crafts",
    slug: "arts-crafts",
    isEnabled: true,
  },
  {
    id: "1c4d2f34-e5c5-58bc-a751-333c6010744d",
    name: "Auto & Automotive",
    slug: "automotive",
    isEnabled: true,
  },
  {
    id: "b75fb787-9d26-5454-95af-9ee79e7aac65",
    name: "Baby, Kids & Maternity",
    slug: "baby-kids",
    isEnabled: true,
  },
  {
    id: "ddb2bdad-a8c4-51aa-b99e-ef52374b7f73",
    name: "Banking & Finance",
    slug: "finance",
    isEnabled: true,
  },
  {
    id: "bc9570ef-7418-56b6-9664-6fc68f86fbf1",
    name: "Building & Construction",
    slug: "building-construction",
    isEnabled: true,
  },
  {
    id: "9778e936-2ccf-5c2b-a5ed-6cdefcd2deb2",
    name: "Business Services",
    slug: "business-consultancy",
    isEnabled: true,
  },
  {
    id: "8003cefd-9faa-5df4-b596-ae371029b710",
    name: "Education & Training",
    slug: "education-training",
    isEnabled: true,
  },
  {
    id: "350fda6c-6778-500e-ae97-aade11bba0e8",
    name: "Electric & Electronics",
    slug: "electronics-electricals",
    isEnabled: true,
  },
  {
    id: "abbcbea6-dae3-5ad7-bcd5-7532176f1e4f",
    name: "Entertainment & Media",
    slug: "entertainment",
    isEnabled: true,
  },
  {
    id: "7cedb4fe-1034-5d7b-b78b-ce626910428c",
    name: "Environment & Waste",
    slug: "waste-management",
    isEnabled: false,
  },
  {
    id: "fb687197-0b29-53ad-8056-e1a5d092c3fe",
    name: "Fashion & Beauty",
    slug: "fashion-accessories",
    isEnabled: true,
  },
  {
    id: "9d8d303c-8e46-53bf-8280-c954ca497c36",
    name: "Food & Beverages",
    slug: "food-beverage",
    isEnabled: true,
  },
  {
    id: "7a23ef89-72c7-52d4-ab63-263ce971ac0c",
    name: "Home & Office",
    slug: "home-office",
    isEnabled: true,
  },
  {
    id: "8ce0fae8-ae48-528f-bae1-668151f1109a",
    name: "Hospitality",
    slug: "hospitality",
    isEnabled: true,
  },
  {
    id: "4df15939-8144-5507-ae87-cf491580699e",
    name: "Industrial Engineering",
    slug: "engineering",
    isEnabled: false,
  },
  {
    id: "53b63b61-dc54-5bea-85fd-93b5ac8da525",
    name: "IT & Technology",
    slug: "technology",
    isEnabled: true,
  },
  {
    id: "482c81be-c5b1-5ed8-8306-0ec51cfda560",
    name: "Logistics & Transportation",
    slug: "logistics-transportation",
    isEnabled: true,
  },
  {
    id: "b97d648f-b1c6-513b-b4cf-8d4c749e7fb7",
    name: "Medical & Pharma",
    slug: "medical-pharma",
    isEnabled: true,
  },
  {
    id: "6194eb56-96c7-5914-acd4-5256353ea082",
    name: "Miscellaneous",
    slug: "trade-promotion",
    isEnabled: true,
  },
  {
    id: "2a1aabd1-1923-514c-86bc-7556550e14b8",
    name: "Packing & Packaging",
    slug: "packaging",
    isEnabled: true,
  },
  {
    id: "387d34b6-9b8a-58ab-b841-981a9534c2e6",
    name: "Power & Energy",
    slug: "power-energy",
    isEnabled: true,
  },
  {
    id: "13bfc587-7c7a-583c-a74f-b447c44edca8",
    name: "Science & Research",
    slug: "research",
    isEnabled: false,
  },
  {
    id: "3dc4b0f9-bc00-5862-8227-2f19a8569fd4",
    name: "Security & Defense",
    slug: "security",
    isEnabled: true,
  },
  {
    id: "891d0abb-d06b-5208-b95b-839b7e3f0696",
    name: "Telecommunication",
    slug: "telecommunication",
    isEnabled: true,
  },
  {
    id: "56482620-c2c7-5df4-bf68-bb91e7a9b6ab",
    name: "Travel & Tourism",
    slug: "travel-tourism",
    isEnabled: true,
  },
  {
    id: "770269a5-ff95-5e95-95a7-048e882e7302",
    name: "Wellness, Health & Fitness",
    slug: "wellness-healthcare",
    isEnabled: true,
  },
];

interface Props {
  filterName: "companyCategoryIds" | "eventCategoryIds";
}

export default function Industry({filterName}: Props) {
  const [search, setSearch] = useState("");
  const { localFilters, setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const categories = morphedData.categories.options;

  const selectedLabels = useMemo(() => {
    const filterDesignations =
      getLocalFilterValue(filterName)?.split(",").filter(Boolean) || [];
    return categories.filter((d: any) =>
      filterDesignations.includes(d.id)
    );
  }, [localFilters[filterName], categories]);

  const handleSelect = (label: any) => {
    const currentDesignations =
      localFilters[filterName]?.split(",").filter(Boolean) || [];
    const isSelected = currentDesignations.includes(label.id);

    const newDesignations = isSelected
      ? currentDesignations.filter((id) => id !== label.id)
      : [...currentDesignations, label.id];

    setLocalFilter(filterName, newDesignations.join(","));
  };

  const handleRemoveLabel = (labelId: string) => {
    const currentDesignations = localFilters[filterName]
      ?.split(",")
      .filter((id) => id !== labelId);
    if (currentDesignations)
      setLocalFilter(filterName, currentDesignations.join(","));
  };

  return (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search Industry"
          onValueChange={(search) => setSearch(search)}
        />
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup>
          <CommandList className="max-h-48">
            {categories?.map((label: any) => (
              <CommandItem key={label.id} onSelect={() => handleSelect(label)} disabled={!label.isEnabled}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLabels.some((l: any) => l.id === label.id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {label.name}
              </CommandItem>
            ))}
          </CommandList>
        </CommandGroup>
      </Command>
      {selectedLabels.length > 0 && (
        <div className="p-2 border-t max-h-[60px] overflow-auto">
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label: any) => (
              <Badge key={label.id} variant="secondary" className="mr-1 mb-1">
                {label.name}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => handleRemoveLabel(label.id)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
