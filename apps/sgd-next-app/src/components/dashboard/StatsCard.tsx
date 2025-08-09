"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  description?: string
  trend?: "up" | "down" | "neutral"
  loading?: boolean
}

/**
 * Stats card component based on shadcn/ui dashboard-01 pattern
 * Displays key metrics with optional change indicators
 */
export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description,
  trend,
  loading = false 
}: StatsCardProps) {
  
  // Auto-detect trend from change value if not provided
  const detectedTrend = trend || (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : "neutral")
  
  const getTrendColor = (trendType: "up" | "down" | "neutral") => {
    switch (trendType) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "neutral":
      default:
        return "text-muted-foreground"
    }
  }

  const formatChange = (changeValue: number) => {
    const sign = changeValue > 0 ? "+" : ""
    return `${sign}${changeValue}%`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(change !== undefined || description) && (
          <p className="text-xs text-muted-foreground mt-1">
            {change !== undefined && (
              <span className={getTrendColor(detectedTrend)}>
                {formatChange(change)}
              </span>
            )}
            {change !== undefined && description && " "}
            {description || (change !== undefined && "desde el mes pasado")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Stats cards container with responsive grid
 */
export function StatsCardsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  )
}