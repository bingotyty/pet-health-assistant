import * as React from "react"

const Progress = React.forwardRef(({ className = "", value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-3 w-full overflow-hidden rounded-full bg-pink-100/50 ${className}`}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 ease-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }