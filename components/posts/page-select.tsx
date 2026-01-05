"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { ManagedPage } from "@/types/facebook"

interface PageSelectProps {
  pages: ManagedPage[]
  selectedPage: ManagedPage | null
  onSelectPage: (page: ManagedPage | null) => void
  disabled?: boolean
  placeholder?: string
  emptyText?: string
}

export function PageSelect({
  pages,
  selectedPage,
  onSelectPage,
  disabled = false,
  placeholder = "Chọn Facebook Page...",
  emptyText = "Không tìm thấy page nào",
}: PageSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedPage ? selectedPage.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm page..." />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {pages.map((page) => (
                <CommandItem
                  key={page.id}
                  value={page.name}
                  onSelect={() => {
                    onSelectPage(selectedPage?.id === page.id ? null : page)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPage?.id === page.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{page.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ID: {page.id}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Import React
import * as React from "react"
