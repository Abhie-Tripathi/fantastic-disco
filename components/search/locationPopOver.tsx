import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import AutocompleteInput from "./AutocompleteInput";
import { Input } from "@/components/ui/input";
export interface GeoLocation {
    lat: number;
    lng: number;
    radius: number;
    description: string;
  }
  
  export interface LocationItem {
    id: string;
    description: string | undefined;
  }
  
  export type Location = GeoLocation | LocationItem[];
export interface LocationProps {
    type?:string;
    source: string;
    selectedLocation?: Location | null;
    setSelectedLocation?: React.Dispatch<
      React.SetStateAction<GeoLocation | LocationItem[] | null>
    >
    applyHandler:any;
    activeTab:string;
    setActiveTab:any;
    radiusUnit:string;
    setRadiusUnit:any;
  }
export default function LocationPopOver ({
    type,
    source,
    selectedLocation,
    setSelectedLocation,
    applyHandler,
    activeTab,
    setActiveTab,
    radiusUnit,
    setRadiusUnit
  }: LocationProps){
    const productType = process.env.NEXT_PUBLIC_PRODUCT_TYPE;
    return(
    <div className="w-[512px] border rounded-md shadow-sm p-0">
    <div className="flex justify-between items-center p-4 py-2 border-b">
      <span className="font-medium">Location</span>
      {/* <Button
        variant="link"
        className="text-primary pr-0"
        onClick={applyHandler}
      >
        Apply
      </Button> */}
    </div>
    {productType==="eventeli" &&
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    {(type!=="T_LOCATION" && type!=="T_VENUE") && 
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="city">City, State, Country</TabsTrigger>
        <TabsTrigger value="center">Center Point & Radius</TabsTrigger>
      </TabsList>
    }
      <TabsContent value="city" className="p-4">
        <AutocompleteInput
          multiple
          type="LocationId"
          placeholder="E.g. Bangalore, Karnataka"
          onSelect={setSelectedLocation}
          value={
            selectedLocation && Array.isArray(selectedLocation)
              ? selectedLocation.map((loc) => ({
                  id: loc.id,
                  description: loc.description || "",
                }))
              : null
          }
        />
      </TabsContent>
      <TabsContent value="center" className="p-4 space-y-4">
        <AutocompleteInput
          type="GeoCoordinate"
          placeholder="E.g. Novotel, Hyderabad"
          onSelect={setSelectedLocation}
          value={
            selectedLocation && !Array.isArray(selectedLocation)
              ? {
                  id: Math.random().toString(),
                  description: (selectedLocation as GeoLocation)
                    .description,
                }
              : null
          }
        />
        <div className="grid grid-cols-10 gap-2">
          <div className="col-span-2">
            <label htmlFor="radius" className="text-sm font-medium">
              Radius
            </label>
            <Input
              id="radius"
              type="number"
              className="mt-1"
              value={(selectedLocation as GeoLocation)?.radius}
              onChange={(e) =>
                setSelectedLocation?.((prev) =>
                  prev
                    ? {
                        ...prev,
                        radius: Number(e.target.value),
                      }
                    : null
                )
              }
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="unit" className="text-sm font-medium">
              Unit
            </label>
            <Select
              defaultValue="km"
              onValueChange={(value) => setRadiusUnit(value)}
              value={radiusUnit}
            >
              <SelectTrigger id="unit" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Km</SelectItem>
                <SelectItem value="mi">Mi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3">
            <label htmlFor="latitude" className="text-sm font-medium">
              Latitude
            </label>
            <Input
              id="latitude"
              type="number"
              className="mt-1"
              value={(selectedLocation as GeoLocation)?.lat}
              onChange={(e) =>
                setSelectedLocation?.((prev) =>
                  prev
                    ? {
                        ...prev,
                        lat: Number(e.target.value),
                      }
                    : null
                )
              }
            />
          </div>
          <div className="col-span-3">
            <label htmlFor="longitude" className="text-sm font-medium">
              Longitude
            </label>
            <Input
              id="longitude"
              type="number"
              className="mt-1"
              value={(selectedLocation as GeoLocation)?.lng}
              onChange={(e) =>
                setSelectedLocation?.((prev) =>
                  prev
                    ? {
                        ...prev,
                        lng: Number(e.target.value),
                      }
                    : null
                )
              }
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
    }
    {productType!=="eventeli" &&
    <AutocompleteInput
      multiple
      type="LocationId"
      placeholder="E.g. Bangalore, Karnataka"
      onSelect={setSelectedLocation}
      value={
        selectedLocation && Array.isArray(selectedLocation)
          ? selectedLocation.map((loc) => ({
              id: loc.id,
              description: loc.description || "",
            }))
          : null
      }
    />
    }
  </div>
    )
}