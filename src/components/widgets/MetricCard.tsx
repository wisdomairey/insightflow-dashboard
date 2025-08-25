'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardMetric } from '@/types'
import { formatNumber, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Users, Target, Heart, ShoppingCart, ArrowRightLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface MetricCardProps {
  metric: DashboardMetric
  animated?: boolean
}

const iconMap = {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Heart,
  ShoppingCart,
  ArrowRightLeft
} as const

export function MetricCard({ metric, animated = true }: MetricCardProps) {
  const { title, value, previousValue, change, changeType, format, icon } = metric
  
  const IconComponent = icon && iconMap[icon as keyof typeof iconMap]
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatNumber(val, { style: 'currency', notation: 'compact' })
      case 'percentage':
        return formatPercentage(val)
      case 'number':
      default:
        return formatNumber(val, { notation: 'compact' })
    }
  }

  const changeIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : Minus
  const ChangeIcon = changeIcon

  const changeColor = changeType === 'increase' 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : changeType === 'decrease' 
    ? 'text-red-500 dark:text-red-400' 
    : 'text-gray-600 dark:text-gray-400'

  // Enhanced color schemes based on metric type
  const getCardColors = () => {
    if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('sales')) {
      return {
        bg: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        titleColor: 'text-emerald-700 dark:text-emerald-300',
        valueColor: 'text-emerald-900 dark:text-emerald-100'
      }
    }
    if (title.toLowerCase().includes('user') || title.toLowerCase().includes('customer')) {
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20',
        border: 'border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
        titleColor: 'text-blue-700 dark:text-blue-300',
        valueColor: 'text-blue-900 dark:text-blue-100'
      }
    }
    if (title.toLowerCase().includes('conversion') || title.toLowerCase().includes('rate')) {
      return {
        bg: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20',
        border: 'border-purple-200 dark:border-purple-800',
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        iconColor: 'text-purple-600 dark:text-purple-400',
        titleColor: 'text-purple-700 dark:text-purple-300',
        valueColor: 'text-purple-900 dark:text-purple-100'
      }
    }
    if (title.toLowerCase().includes('order') || title.toLowerCase().includes('transaction')) {
      return {
        bg: 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20',
        border: 'border-orange-200 dark:border-orange-800',
        iconBg: 'bg-orange-100 dark:bg-orange-900/50',
        iconColor: 'text-orange-600 dark:text-orange-400',
        titleColor: 'text-orange-700 dark:text-orange-300',
        valueColor: 'text-orange-900 dark:text-orange-100'
      }
    }
    // Default theme
    return {
      bg: 'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/20 dark:to-gray-800/20',
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-slate-100 dark:bg-slate-900/50',
      iconColor: 'text-slate-600 dark:text-slate-400',
      titleColor: 'text-slate-700 dark:text-slate-300',
      valueColor: 'text-slate-900 dark:text-slate-100'
    }
  }

  const colors = getCardColors()

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const valueVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2, type: "spring" as const, stiffness: 200 }
    }
  }

  return (
    <motion.div
      variants={animated ? cardVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={`hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${colors.bg} ${colors.border} shadow-lg`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${colors.titleColor}`}>
            {title}
          </CardTitle>
          {IconComponent && (
            <div className={`p-2 rounded-lg ${colors.iconBg}`}>
              <IconComponent className={`h-4 w-4 ${colors.iconColor}`} />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <motion.div
            variants={animated ? valueVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            className={`text-2xl font-bold mb-1 ${colors.valueColor}`}
          >
            {formatValue(value)}
          </motion.div>
          {change !== undefined && previousValue !== undefined && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`flex items-center text-xs ${changeColor}`}
            >
              <ChangeIcon className="h-3 w-3 mr-1" />
              <span>
                {change > 0 ? '+' : ''}{formatPercentage(Math.abs(change))} from last period
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MetricGridProps {
  metrics: DashboardMetric[]
  animated?: boolean
  className?: string
}

export function MetricGrid({ metrics, animated = true, className }: MetricGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} animated={animated} />
      ))}
    </motion.div>
  )
}
