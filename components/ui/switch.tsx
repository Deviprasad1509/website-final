'use client'

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50",
            className
          )}
        />
      </label>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
