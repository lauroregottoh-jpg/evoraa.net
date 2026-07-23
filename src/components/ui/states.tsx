import * as React from "react"
import { cn } from "@/utils/cn"
import { AlertCircle, CheckCircle2, Loader2, Inbox } from "lucide-react"

interface StateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function LoadingState({ title = "Chargement...", description, className, ...props }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4", className)} {...props}>
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
      <div className="space-y-1">
        <h3 className="font-serif text-xl font-medium text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export function EmptyState({ title, description, icon, className, ...props }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center space-y-4 rounded-xl border border-dashed border-border bg-white/50", className)} {...props}>
      <div className="p-4 rounded-full bg-secondary/50 text-accent">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="font-serif text-xl font-medium text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export function ErrorState({ title = "Une erreur est survenue", description, icon, className, ...props }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-xl bg-destructive/5 border border-destructive/10", className)} {...props}>
      <div className="text-destructive">
        {icon || <AlertCircle className="w-10 h-10" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="font-serif text-xl font-medium text-destructive">{title}</h3>
        {description && <p className="text-sm text-destructive/80">{description}</p>}
      </div>
    </div>
  )
}

export function SuccessState({ title, description, icon, className, ...props }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-xl bg-green-50/50 border border-green-100", className)} {...props}>
      <div className="text-green-600">
        {icon || <CheckCircle2 className="w-10 h-10" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="font-serif text-xl font-medium text-green-800">{title}</h3>
        {description && <p className="text-sm text-green-600/80">{description}</p>}
      </div>
    </div>
  )
}
