"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown, X } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import Image from "next/image";
import { useMiscService } from "@/services/miscService";
import { Country } from "@/types/events/events";
import { useFilterContext } from "@/context/filterContext";
interface AudienceSpreadProps {
  source: string;
  selectedCountries?: string[];
  setSelectedCountries?: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const { localFilters, setMultipleLocalFilters, getLocalFilterValue } = useFilterContext();
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
        console.log(countriesResponse);

        setCountries(countriesResponse?.formattedLocations || []);

        const regionsResponse = await getRegions();
        setRegions(regionsResponse?.regions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRegions = regions.filter((region) =>
    region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCountry = (code: string) => {
    const newCountries = selectedCountries.includes(code)
      ? selectedCountries.filter(c => c !== code)
      : [...selectedCountries, code];
    
    setMultipleLocalFilters({
      audienceSpread: newCountries.join(',')
    });
  };

  const toggleRegion = (region: string) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    
    setMultipleLocalFilters({
      audienceSpreadRegions: newRegions.join(',')
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

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">Audience Spread</span>
            {(selectedCountries.length > 0 || selectedRegions.length > 0) && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedCountries.length + selectedRegions.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 z-[120]" side="bottom">
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
          {selectedRegions.map((region) => (
            <div
              key={region}
              className="flex items-center bg-[#E6E6F9] text-primary border border-primary text-sm rounded-full px-3 py-1"
            >
              {region}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => removeFilter(region)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        {/* <Tabs defaultValue="country" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="country" className="w-1/2">
              Country
            </TabsTrigger>
            <TabsTrigger value="region" className="w-1/2">
              Region
            </TabsTrigger>
          </TabsList>
          <TabsContent value="country" className="p-4 pt-2">
            <div className="space-y-4">
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
                  ) : (
                    filteredCountries.map((country) => {
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
          </TabsContent>
          <TabsContent value="region" className="p-4 pt-2">
            <div className="space-y-4">
              <Input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {isLoading ? (
                    <div>Loading regions...</div>
                  ) : error ? (
                    <div>Error loading regions</div>
                  ) : (
                    filteredRegions.map((region) => (
                      <div
                        key={region}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => toggleRegion(region)}
                      >
                        <div className="w-5 h-5 border rounded flex items-center justify-center">
                          {selectedRegions.includes(region) && (
                            <Check className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <span>{region}</span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs> */}

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
      </PopoverContent>
    </Popover>
  );
}
