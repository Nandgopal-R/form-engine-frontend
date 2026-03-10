import { BarChart2 } from 'lucide-react'

interface RatingItem {
  label: string
  count: number
  total: number
}

interface ResponseVisualizationsProps {
  ratings?: RatingItem[]
}

export function ResponseCharts({ ratings }: ResponseVisualizationsProps) {
  // Use mock data if none provided
  const displayRatings = ratings || [
    { label: 'Excellent', count: 45, total: 100 },
    { label: 'Good', count: 32, total: 100 },
    { label: 'Fair', count: 15, total: 100 },
    { label: 'Poor', count: 8, total: 100 },
  ]

  const maxCount = Math.max(...displayRatings.map(r => r.count))

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold flex items-center gap-1.5">
        <BarChart2 className="h-4 w-4 text-primary" />
        Response Visualizations
      </h4>
      <div className="space-y-6 p-6 rounded-xl border bg-white shadow-sm">
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rating Distribution</h5>
          <p className="text-[10px] text-muted-foreground">Frequency of user satisfaction scores</p>
        </div>
        
        <div className="space-y-4">
          {displayRatings.map((item) => {
            const percentage = (item.count / maxCount) * 100
            return (
              <div key={item.label} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                  <span className="text-muted-foreground font-medium">{item.count} responses</span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
