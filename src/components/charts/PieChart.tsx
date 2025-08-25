'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChartData } from '@/types'
import { formatNumber } from '@/lib/utils'

interface PieChartWidgetProps {
  title: string
  data: PieChartData[]
  colors?: string[]
  showLegend?: boolean
  className?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    payload: PieChartData
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: data.payload.color }} />
          {formatNumber(data.value, { notation: 'compact' })}
        </p>
      </div>
    )
  }
  return null
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#06b6d4', // cyan-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
]

export function PieChartWidget({ 
  title, 
  data, 
  colors = DEFAULT_COLORS,
  showLegend = true, 
  className 
}: PieChartWidgetProps) {
  // Assign colors to data items
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length]
  }))

  const renderCustomizedLabel = (props: Record<string, unknown>) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
    if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent) return null
    if ((percent as number) < 0.05) return null // Don't show label for slices less than 5%
    
    const RADIAN = Math.PI / 180
    const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5
    const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN)
    const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > (cx as number) ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${((percent as number) * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className={`bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30 border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-3"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ fontSize: '12px', color: 'var(--foreground)' }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
