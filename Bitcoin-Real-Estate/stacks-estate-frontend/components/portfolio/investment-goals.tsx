"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp, Calendar, Settings } from "lucide-react"

// Mock goals data
const investmentGoals = [
  {
    id: 1,
    title: "Reach 20 sBTC Portfolio",
    description: "Build a diversified real estate portfolio worth 20 sBTC",
    current: 12.5,
    target: 20,
    progress: 62.5,
    timeframe: "December 2024",
    onTrack: true,
  },
  {
    id: 2,
    title: "Monthly Income Target",
    description: "Generate 0.15 sBTC in monthly passive income",
    current: 0.085,
    target: 0.15,
    progress: 56.7,
    timeframe: "June 2024",
    onTrack: true,
  },
  {
    id: 3,
    title: "Geographic Diversification",
    description: "Invest in properties across 5 different markets",
    current: 4,
    target: 5,
    progress: 80,
    timeframe: "March 2024",
    onTrack: true,
  },
]

export function InvestmentGoals() {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Investment Goals
        </CardTitle>
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <Settings className="h-4 w-4 mr-2" />
          Manage Goals
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {investmentGoals.map((goal) => (
          <div key={goal.id} className="glass-card p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{goal.title}</h3>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {goal.onTrack ? (
                  <TrendingUp className="h-4 w-4 text-accent" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-warning" />
                )}
                <span className={`text-sm font-medium ${goal.onTrack ? "text-accent" : "text-warning"}`}>
                  {goal.onTrack ? "On Track" : "Behind"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{goal.progress.toFixed(1)}%</span>
              </div>
              <Progress value={goal.progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Current: {goal.current} {goal.id === 2 ? "sBTC/month" : goal.id === 3 ? "markets" : "sBTC"}
                </span>
                <span>
                  Target: {goal.target} {goal.id === 2 ? "sBTC/month" : goal.id === 3 ? "markets" : "sBTC"}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Target date: {goal.timeframe}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
