import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-terracotta transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-2xl border border-glass-border bg-glass-bg/40 px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-terracotta/50 focus-visible:ring-2 focus-visible:ring-terracotta/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
            icon && "pl-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Subtle bottom glow effect purely for aesthetics */}
        <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-terracotta/50 to-transparent group-focus-within:w-1/2 transition-all duration-500 pointer-events-none" />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
