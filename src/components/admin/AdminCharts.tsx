"use client"

import { cn } from "@/utils/cn"
import type { NamedCount } from "@/lib/admin/analytics"

export function DistBars({
  items,
  accent = "primary",
}: {
  items: NamedCount[]
  accent?: "primary" | "gold" | "emerald"
}) {
  const max = Math.max(1, ...items.map((i) => i.count))
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">Pas encore de données.</p>
  }
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const pct = Math.round((item.count / max) * 100)
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between gap-2 text-xs">
              <span className="truncate text-muted-foreground font-medium">{item.name}</span>
              <span className="font-semibold shrink-0">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  accent === "primary" && "bg-primary",
                  accent === "gold" && "bg-[#C4A35A]",
                  accent === "emerald" && "bg-emerald-600"
                )}
                style={{ width: `${Math.max(pct, item.count > 0 ? 4 : 0)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function SparkColumns({ items }: { items: NamedCount[] }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div className="flex items-end gap-1 h-28">
      {items.map((item) => {
        const h = Math.round((item.count / max) * 100)
        return (
          <div key={item.name} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div
              className="w-full rounded-t-md bg-primary/85 min-h-[2px]"
              style={{ height: `${Math.max(h, item.count > 0 ? 8 : 2)}%` }}
              title={`${item.name}: ${item.count}`}
            />
            <span className="text-[9px] text-muted-foreground truncate w-full text-center">
              {item.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
