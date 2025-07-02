"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDatabaseLocationcomplete } from "@/hooks/useLocationAutocomplete"
import { useLocationService } from "@/services/locationService"

interface Location {
  id: string
  description: string
}

interface AutocompleteInputProps {
  type: "SavedLocations" | "LocationId" | "GeoCoordinate"
  defaultOpen?: boolean
  placeholder: string
  onSelect: (location: any) => void
  isOpen?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  multiple?: boolean
  value?: Location[] | Location | null
  setApplyHandlerCalled?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AutocompleteInput({
  type,
  defaultOpen,
  placeholder,
  onSelect,
  isOpen,
  setIsOpen,
  multiple = false,
  value,
  setApplyHandlerCalled,
}: AutocompleteInputProps) {
  const { getCoordinates } = useLocationService()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const databaseLocationResult = useDatabaseLocationcomplete(type == "LocationId" ? searchTerm : "")
  const nominatimResult = useDatabaseLocationcomplete(type == "GeoCoordinate" ? searchTerm : "", "VENUE")
  const { predictions, isLoading, isError } = type === "LocationId" ? databaseLocationResult : nominatimResult

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setSearchTerm(inputValue)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue])

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen)
    }
  }, [isOpen])

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setSelectedLocations(value)
      } else if (typeof value === "object" && value !== null) {
        setSelectedLocations([value])
      }
    } else {
      setSelectedLocations([])
    }
  }, [value])

  // Reset highlighted index when predictions change
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [predictions])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = useCallback(
    async (prediction: any) => {
      const newLocation = {
        id: prediction.id,
        description: prediction.displayName,
      }

      if (multiple) {
        if (selectedLocations.some((location) => location.id === newLocation.id)) {
          return
        }
        const updatedLocations = [...selectedLocations, newLocation]
        setSelectedLocations(updatedLocations)
        setInputValue("")
        onSelect(updatedLocations)
      } else {
        setSelectedLocations([newLocation])
        setInputValue("")
        setOpen(false)
        onSelect([newLocation])
      }

      if (type === "GeoCoordinate") {
        onSelect({
          description: prediction.displayName,
          lat: prediction.latitude,
          lng: prediction.longitude,
          radius: 5,
        })
      }

      setApplyHandlerCalled?.(true)
      setHighlightedIndex(-1)

      // Refocus input for multiple selection
      if (multiple) {
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    },
    [multiple, type, getCoordinates, onSelect, selectedLocations, setApplyHandlerCalled],
  )

  const handleRemove = useCallback(
    (locationToRemove: Location) => {
      const updatedLocations = selectedLocations.filter((location) => location.id !== locationToRemove.id)
      setSelectedLocations(updatedLocations)
      onSelect(updatedLocations)
      setTimeout(() => inputRef.current?.focus(), 0)
    },
    [selectedLocations, onSelect],
  )

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
    setOpen(value.length > 0)
    setHighlightedIndex(-1)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open && e.key !== "ArrowDown" && e.key !== "Enter") return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          if (!open) {
            setOpen(true)
          } else {
            setHighlightedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : prev))
          }
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (highlightedIndex >= 0 && predictions[highlightedIndex]) {
            handleSelect(predictions[highlightedIndex])
          }
          break
        case "Escape":
          e.preventDefault()
          setOpen(false)
          setHighlightedIndex(-1)
          inputRef.current?.blur()
          break
        case "Tab":
          setOpen(false)
          setHighlightedIndex(-1)
          break
        case "Backspace":
          if (inputValue === "" && selectedLocations.length > 0 && multiple) {
            e.preventDefault()
            const lastLocation = selectedLocations[selectedLocations.length - 1]
            handleRemove(lastLocation)
          }
          break
      }
    },
    [open, highlightedIndex, predictions, handleSelect, inputValue, selectedLocations, multiple, handleRemove],
  )

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        })
      }
    }
  }, [highlightedIndex])

  const handleFocus = () => {
    if (inputValue.length > 0) {
      setOpen(true)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center flex-wrap bg-background rounded-md shadow-sm border">
        <Search className="ml-2 h-4 w-4 text-gray-400 flex-shrink-0" />
        {selectedLocations.map((location, index) => (
          <div
            key={location.id}
            className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 m-1 text-xs"
          >
            <span className="text-xs font-medium dark:text-gray-100 truncate max-w-[100px] sm:max-w-[200px]">
              {location.description}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleRemove(location)
              }}
              className="ml-2 focus:outline-none hover:bg-gray-300 rounded-full p-0.5"
              tabIndex={-1}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <div className="flex-grow flex items-center min-w-[120px]">
          <Input
            ref={inputRef}
            type="text"
            placeholder={selectedLocations.length ? "" : placeholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="pl-2 py-0 pr-4 w-full border-none focus:ring-0 shadow-none text-sm h-9"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-activedescendant={highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined}
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Searching...</span>
            </div>
          ) : isError ? (
            <div className="p-4 py-8 text-sm text-center">Error fetching locations.</div>
          ) : predictions.length === 0 ? (
            <div className="p-4 py-8 text-sm text-gray-600 text-center">
              {inputValue.trim() === "" ? "Type to search locations..." : "No locations found."}
            </div>
          ) : (
            <ul ref={listRef} role="listbox" className="py-1">
              {predictions.map((prediction: any, index: number) => {
                const city = prediction.name
                const placeId = prediction.id
                const state = prediction.state?.name
                const country = prediction.country?.name
                const isHighlighted = index === highlightedIndex

                return (
                  <li
                    key={placeId}
                    id={`option-${index}`}
                    role="option"
                    aria-selected={isHighlighted}
                    className={`px-2 py-1.5 cursor-pointer flex flex-col items-start transition-colors ${
                      isHighlighted ? "bg-accent" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(prediction)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span className="font-medium text-sm">{city}</span>
                    <span className="text-sm text-gray-500">
                      {state && `${state}, `}
                      {country}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
