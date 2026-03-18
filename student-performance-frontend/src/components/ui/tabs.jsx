import * as React from "react"
import { cn } from "../../lib/utils"

// A simplified Tabs implementation holding its own state via Context
const TabsContext = React.createContext(null)

const Tabs = ({ value, onValueChange, className, children, ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ className, children, ...props }) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const TabsTrigger = ({ className, value, children, ...props }) => {
  const context = React.useContext(TabsContext)
  const isSelected = context.value === value

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected && "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ className, value, children, ...props }) => {
  const context = React.useContext(TabsContext)
  if (context.value !== value) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
