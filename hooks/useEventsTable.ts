"use client"

import { useState, useEffect } from "react"
import { eventService } from "@/services/eventService"
import type { EventTableType } from "@/types/ListViewTable"
import { useFilterState } from "@/hooks/useFilterState"

export const useEventTable = (queryString: string, eventType: string) => {
  const [events, setEvents] = useState<EventTableType[]>([])
  const [totalEvents, setTotalEvents] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getFilterValue, setFilter } = useFilterState()

  const itemsPerPage = Number.parseInt(getFilterValue("take") || "20")
  const skip = Number.parseInt(getFilterValue("skip") || "0")
  const currentPage = Math.floor(skip / itemsPerPage) + 1

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const data = await eventService.getEvents(queryString, itemsPerPage, currentPage)
        setEvents(data.events)
        setTotalEvents(data.stats.totalEvents)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [queryString, itemsPerPage, currentPage])

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString())
  }

  const handleItemsPerPageChange = (value: string) => {
    setFilter("take", value)
    setFilter("skip", "0")
  }

  return {
    events,
    totalEvents,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  }
}

