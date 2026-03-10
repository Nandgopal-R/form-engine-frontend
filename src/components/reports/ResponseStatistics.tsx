import { CheckCircle2, Star, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResponseStatisticsProps {
  totalResponses: number
  averageRating?: number
  completionRate?: number
}

export function ResponseStatistics({ 
  totalResponses, 
  averageRating = 4.2, 
  completionRate = 91 
}: ResponseStatisticsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Response Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Collected submissions</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating} / 5</div>
            <p className="text-[10px] text-muted-foreground mt-1">Across all rated fields</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-[10px] text-muted-foreground mt-1">Finished vs started</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
