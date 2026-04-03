import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" && "px-8 py-4 bg-gradient-to-r from-terracotta/90 to-terracotta/70 text-white hover:from-terracotta hover:to-terracotta/80 shadow-[0_0_20px_rgba(205,92,69,0.3)] hover:shadow-[0_0_30px_rgba(205,92,69,0.5)]",
          variant === "glass" && "px-8 py-4 glass-card text-foreground/90 hover:bg-white/5",
          variant === "ghost" && "px-4 py-2 hover:bg-white/5 text-foreground/80",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
