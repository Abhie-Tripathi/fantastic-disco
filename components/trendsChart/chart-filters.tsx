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
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select defaultValue="month">
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="event">
        <AccordionTrigger>Event Type</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Type</Label>
              <Select defaultValue="business">
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="non-business">Non-Business</SelectItem>
                  <SelectItem value="not-planned">Not Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="tradeshow">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tradeshow">Tradeshows</SelectItem>
                  <SelectItem value="conference">Conferences</SelectItem>
                  <SelectItem value="meetup">Meetups</SelectItem>
                  <SelectItem value="concert">Concerts</SelectItem>
                  <SelectItem value="festival">Festivals</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="audience">
        <AccordionTrigger>Audience Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Designation</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select job function" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Designations</SelectItem>
                  <SelectItem value="executive">Executives</SelectItem>
                  <SelectItem value="manager">Managers</SelectItem>
                  <SelectItem value="professional">Professionals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Size</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select event size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small (500)</SelectItem>
                  <SelectItem value="medium">Medium (500-2000)</SelectItem>
                  <SelectItem value="large">Large (2000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="metrics">
        <AccordionTrigger>Additional Metrics</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maturity">Show Event Maturity</Label>
              <Switch id="maturity" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="economic">Include Economic Impact</Label>
              <Switch id="economic" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inbound">Show Country Inbound</Label>
              <Switch id="inbound" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="outbound">Show Country Outbound</Label>
              <Switch id="outbound" />
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

