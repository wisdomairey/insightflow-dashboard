'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChartData } from '@/types'
import { formatNumber } from '@/lib/utils'

interface LineChartWidgetProps {
  title: string
  data: LineChartData[]
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
    const value = payload[0].value as number
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
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full mr-2 shadow-sm" 
                style={{ backgroundColor: payload[0].color }} />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatValue(value)}</span>
        </p>
      </div>
    )
  }
  return null
}

export function LineChartWidget({ 
  title, 
  data, 
  color = '#3b82f6', 
  showGrid = true, 
  className 
}: LineChartWidgetProps) {
  return (
    <Card className={`bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />}
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                className="dark:fill-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                className="dark:fill-gray-400"
                tickFormatter={(value) => formatNumber(value, { notation: 'compact' })}
              />
              <Tooltip content={<CustomTooltip format="currency" />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
