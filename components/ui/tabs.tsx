'use client'

import { cn } from "@/lib/utils"
import { useState } from "react"

interface TabsProps {
  defaultValue?: string
  items: { value: string; label: string }[]
  onChange?: (value: string) => void
  children?: React.ReactNode
}

export function Tabs({ defaultValue, items, onChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value)

  const handleTabClick = (value: string) => {
    setActiveTab(value)
    onChange?.(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-1 border-b">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => handleTabClick(item.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === item.value
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

interface TabsPanelProps {
  value: string
  children: React.ReactNode
}
