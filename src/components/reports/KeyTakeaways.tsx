import { Lightbulb } from 'lucide-react'

interface KeyTakeawaysProps {
  takeaways: Array<string>
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (takeaways.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold flex items-center gap-1.5 capitalize">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        Key Takeaways
      </h4>
      <div className="grid gap-3">
        {takeaways.map((takeaway, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-xl border bg-amber-50/20 text-sm shadow-sm">
            <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <p className="text-foreground leading-relaxed font-medium">{takeaway}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
