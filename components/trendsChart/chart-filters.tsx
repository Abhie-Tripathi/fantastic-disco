"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ChartFiltersProps {
  type: string
}

export function ChartFilters({ type }: ChartFiltersProps) {
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = () => {
    setIsApplying(true)
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false)
    }, 1000)
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="time">
        <AccordionTrigger>Time Period</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select defaultValue="month">
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="location">
        <AccordionTrigger>Location</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="country">By Country</SelectItem>
                  <SelectItem value="city">By City</SelectItem>
                  <SelectItem value="region">By Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="event">
        <AccordionTrigger>Event Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="non-business">Non-Business</SelectItem>
                  <SelectItem value="not-planned">Not Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tradeshow">Tradeshows</SelectItem>
                  <SelectItem value="conference">Conferences</SelectItem>
                  <SelectItem value="meetup">Meetups</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="additional">
        <AccordionTrigger>Additional Filters</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maturity">Show Event Maturity</Label>
              <Switch id="maturity" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="size">Include Event Size</Label>
              <Switch id="size" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audience">Show Audience Zone</Label>
              <Switch id="audience" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="economic">Include Economic Impact</Label>
              <Switch id="economic" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <Separator className="my-4" />

      <Button onClick={handleApply} disabled={isApplying}>
        {isApplying ? "Applying..." : "Apply Filters"}
      </Button>
    </Accordion>
  )
}

