'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChartData } from '@/types'
import { formatNumber } from '@/lib/utils'

interface BarChartWidgetProps {
  title: string
  data: BarChartData[]
  color?: string
  showGrid?: boolean
  className?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    color: string
  }>
  label?: string
  format?: 'currency' | 'number' | 'percentage'
}

function CustomTooltip({ active, payload, label, format = 'number' }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return formatNumber(val, { style: 'currency', notation: 'compact' })
        case 'percentage':
          return `${(val * 100).toFixed(1)}%`
        case 'number':
        default:
          return formatNumber(val, { notation: 'compact' })
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: payload[0].color }} />
          {formatValue(value)}
        </p>
      </div>
    )
  }
  return null
}

export function BarChartWidget({ 
  title, 
  data, 
  color = '#06b6d4', 
  showGrid = true, 
  className 
}: BarChartWidgetProps) {
  return (
    <Card className={`bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-900 dark:to-cyan-950/30 border-cyan-200/50 dark:border-cyan-800/50 shadow-lg hover:shadow-xl transition-all duration-300 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mr-3"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />}
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                className="dark:fill-gray-400"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                className="dark:fill-gray-400"
                tickFormatter={(value) => formatNumber(value, { notation: 'compact' })}
              />
              <Tooltip content={<CustomTooltip format="number" />} />
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
