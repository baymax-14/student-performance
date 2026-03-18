import * as React from "react"
import { cn } from "../../lib/utils"

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, src, ...props }, ref) => {
  return src ? (
    <img
      ref={ref}
      src={src}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  ) : null
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center font-bold",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
