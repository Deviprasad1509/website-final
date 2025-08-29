'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({
  className,
  src,
  alt = "Avatar",
  size = "md",
  ...props
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm font-medium">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
