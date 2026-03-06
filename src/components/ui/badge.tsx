import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" | "success" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
      {
        "border-transparent bg-indigo-600 text-slate-50 hover:bg-indigo-600/80": variant === "default",
        "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80": variant === "secondary",
        "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80": variant === "destructive",
        "border-transparent bg-emerald-500 text-slate-50 hover:bg-emerald-500/80": variant === "success",
        "text-slate-950": variant === "outline",
      },
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }
