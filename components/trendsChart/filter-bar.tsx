"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function FilterBar() {
  return (
    <div className="flex flex-wrap gap-3">
      <Select defaultValue="event">
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            <span>Event Type</span>
            <Badge variant="secondary">3</Badge>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="event">All Events</SelectItem>
          <SelectItem value="conference">Conference</SelectItem>
          <SelectItem value="workshop">Workshop</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="location">
        <SelectTrigger className="w-[200px]">
          <span>Location</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="location">New York, United States</SelectItem>
          <SelectItem value="remote">Remote</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="dates">
        <SelectTrigger className="w-[200px]">
          <span>Dates</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dates">1 - 28 Feb, 2025</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="metric">
        <SelectTrigger className="w-[200px]">
          <span>Metric</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="metric">Number of events</SelectItem>
          <SelectItem value="attendance">Attendance</SelectItem>
        </SelectContent>
      </Select>

      <Button className="bg-purple-600 hover:bg-purple-700">Apply</Button>
    </div>
  )
}

