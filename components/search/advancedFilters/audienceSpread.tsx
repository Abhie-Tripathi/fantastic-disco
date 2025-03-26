"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { useMiscService } from "@/services/miscService";
import { Country } from "@/types/events/events";
import { useFilterContext } from "@/context/filterContext";
import { LockClosedSmall } from "geist-icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface AudienceSpreadSelectorProps {
  variant?: "accordion" | "popover";
}

export default function AudienceSpreadSelector({ variant = "popover" }: AudienceSpreadSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const { localFilters, setMultipleLocalFilters, getLocalFilterValue, morphedData } = useFilterContext();
  const enabled = morphedData.audienceSpread?.isEnabled;
  const { getCountries, getRegions, isLoading, error } = useMiscService();

  const selectedCountries = useMemo(() => 
    getLocalFilterValue("audienceSpread")?.split(',').filter(Boolean) || []
  , [localFilters.audienceSpread]);

  const selectedRegions = useMemo(() => 
    localFilters.audienceSpreadRegions?.split(',').filter(Boolean) || []
  , [localFilters.audienceSpreadRegions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countriesResponse = await getCountries();
        setCountries((countriesResponse as any)?.formattedLocations || []);
        const regionsResponse = await getRegions();
        setRegions((regionsResponse as any)?.regions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCountry = (code: string) => {
    const newCountries = selectedCountries.includes(code)
      ? selectedCountries.filter(c => c !== code)
      : [...selectedCountries, code];
    
    setMultipleLocalFilters({
      audienceSpread: newCountries.join(',')
    });
  };

  const removeFilter = (code: string) => {
    if (selectedCountries.includes(code)) {
      setMultipleLocalFilters({
        audienceSpread: selectedCountries.filter(c => c !== code).join(',')
      });
    }
    if (selectedRegions.includes(code)) {
      setMultipleLocalFilters({
        audienceSpreadRegions: selectedRegions.filter(r => r !== code).join(',')
      });
    }
  };

  const triggerContent = (
    <div className="flex items-center">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="mr-2">Audience Spread</span>
      {(selectedCountries.length > 0 || selectedRegions.length > 0) && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedCountries.length + selectedRegions.length}
        </span>
      )}
    </div>
  );

  const content = (
    <>
      <div className="p-2 flex flex-wrap gap-2 max-h-[60px] overflow-auto">
        {selectedCountries.map((code) => {
          const country = countries.find((c) => c.id === code);
          if (!country) return null;
          if (country.iso == "UK") country.iso = "GB";
          const Flag = Flags[country.iso as keyof typeof Flags];
          return (
            <div
              key={code}
              className="flex items-center bg-[#E6E6F9] text-primary border border-primary text-sm rounded-full px-3 py-1"
            >
              <Flag className="w-4 h-4 mr-2" />
              {country.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => removeFilter(code)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="space-y-4 p-4 pt-0">
        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollArea className="h-44 pr-4">
          <div className="space-y-2">
            {isLoading ? (
              <div>Loading countries...</div>
            ) : error ? (
              <div>Error loading countries</div>
            ) : filteredCountries.length === 0 ? (
              <div className="text-gray-500">No countries found</div>
            ) : (
              filteredCountries.map((country) => {
                if (country.iso == "UK") country.iso = "GB";
                const Flag = Flags[country.iso as keyof typeof Flags];
                return (
                  <div
                    key={country.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => toggleCountry(country.id)}
                  >
                    <div className="w-5 h-5 border rounded flex items-center justify-center">
                      {selectedCountries.includes(country.id) && (
                        <Check className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    {Flag && <Flag className="w-6 h-4 mr-2" />}
                    <span>{country.displayName}</span>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
            disabled={!enabled}
          >
            <div className="flex items-center justify-between w-full">
              {triggerContent}
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="audienceSpread" className="border rounded-md">
        <AccordionTrigger 
          className={cn(buttonVariants({variant: "outline"}), "no-underline border-none justify-between px-3 py-5 text-base font-normal")} 
          disabled={!enabled}
        >
          <div className="flex items-center justify-between w-full">
            {triggerContent}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}