"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody } from "@/components/ui/table"
import { EventTableHeader } from "./event-table-headers"
import { EventTableRow } from "./event-table-row"
import { PaginationComponent } from "@/components/pagination"
import { useEvents } from "@/hooks/useEvents"
import { useFilterState } from "@/hooks/useFilterState"
import { showToast } from "@/utils/showToast"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

interface EventTableProps {
  queryString: string
  eventType: string
  showInsights: {
    eventKeywords: boolean
    eventSize: boolean
    estExhibit: boolean
    eventRank: boolean
    reptSent: boolean
    eventRating: boolean
    repeatSent: boolean
    eventFrequency: boolean
    forecasted: boolean
  }
}

export default function EventTable({ queryString, eventType, showInsights }: EventTableProps) {
  const { getFilterValue, setFilter } = useFilterState()
  const itemsPerPage = Number.parseInt(getFilterValue("take") || "20")
  const skip = Number.parseInt(getFilterValue("skip") || "0")
  const currentPage = Math.floor(skip / itemsPerPage) + 1

  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState("")

  const { events, totalEvents, isLoading, error, saveEvent, deleteEvent } = useEvents(
    queryString,
    itemsPerPage,
    currentPage,
    filters,
    sort,
  )

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString())
  }

  const handleItemsPerPageChange = (value: string) => {
    setFilter("take", value)
    setFilter("skip", "0")
  }

  const handleSaveEvent = async (eventId: string) => {
    try {
      await saveEvent(eventId)
      showToast("success", "Event saved successfully")
    } catch (error) {
      showToast("error", "Failed to save event")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      showToast("success", "Event removed from saved events")
    } catch (error) {
      showToast("error", "Failed to remove event")
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <Input placeholder="Filter by name" name="name" onChange={handleFilterChange} />
        <Select onValueChange={handleSortChange}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="eventSize">Event Size</option>
        </Select>
      </div>
      <Table>
        <EventTableHeader showInsights={showInsights} />
        <TableBody>
          {events.map((event) => (
            <EventTableRow
              key={event.id}
              event={event}
              showInsights={showInsights}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ))}
        </TableBody>
      </Table>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={Math.ceil(totalEvents / itemsPerPage)}
        itemsPerPage={itemsPerPage}
        count={totalEvents}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  )
}

