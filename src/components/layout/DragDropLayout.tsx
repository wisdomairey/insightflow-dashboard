'use client'

import React, { useState } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GripVertical, Settings, X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ResponsiveGridLayout = WidthProvider(Responsive)

export interface DraggableWidget {
  id: string
  type: 'metric' | 'line-chart' | 'bar-chart' | 'pie-chart' | 'table'
  title: string
  data?: {
    value?: number
    change?: number
    format?: string
    length?: number
  } | Array<{ name: string; value: number; color?: string }> | null
  config?: {
    color?: string
    showGrid?: boolean
    showLegend?: boolean
  }
}

interface DragDropLayoutProps {
  widgets: DraggableWidget[]
  onLayoutChange?: (layout: Layout[]) => void
  onWidgetRemove?: (widgetId: string) => void
  onWidgetAdd?: (widget: DraggableWidget) => void
  editable?: boolean
  className?: string
}

// Default layout configuration
const getDefaultLayout = (widgets: DraggableWidget[]): Layout[] => {
  return widgets.map((widget, index) => {
    const baseLayout = {
      i: widget.id,
      x: (index % 3) * 4, // 3 columns
      y: Math.floor(index / 3) * 4, // Stack rows
      w: 4, // Width
      h: 4, // Height
      minW: 2,
      minH: 2,
    }

    // Customize layout based on widget type
    switch (widget.type) {
      case 'metric':
        return { ...baseLayout, w: 3, h: 2 }
      case 'line-chart':
      case 'bar-chart':
        return { ...baseLayout, w: 6, h: 4 }
      case 'pie-chart':
        return { ...baseLayout, w: 4, h: 4 }
      case 'table':
        return { ...baseLayout, w: 12, h: 6 }
      default:
        return baseLayout
    }
  })
}

export function DragDropLayout({ 
  widgets, 
  onLayoutChange, 
  onWidgetRemove, 
  onWidgetAdd,
  editable = false,
  className 
}: DragDropLayoutProps) {
  // Initialize layouts with default layout for all breakpoints
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>(() => {
    const defaultLayout = getDefaultLayout(widgets)
    return {
      lg: defaultLayout,
      md: defaultLayout,
      sm: defaultLayout,
      xs: defaultLayout,
      xxs: defaultLayout
    }
  })
  const [editMode, setEditMode] = useState(false)

  // Update layouts when widgets change (but preserve custom layouts)
  React.useEffect(() => {
    const newDefaultLayout = getDefaultLayout(widgets)
    setLayouts(prevLayouts => {
      // Only update if we have new widgets that aren't in the current layout
      const currentIds = new Set(prevLayouts.lg?.map(item => item.i) || [])
      const newWidgetIds = widgets.map(w => w.id)
      const hasNewWidgets = newWidgetIds.some(id => !currentIds.has(id))
      
      if (hasNewWidgets) {
        return {
          lg: newDefaultLayout,
          md: newDefaultLayout,
          sm: newDefaultLayout,
          xs: newDefaultLayout,
          xxs: newDefaultLayout
        }
      }
      
      // Remove layouts for widgets that no longer exist
      const filteredLayouts = {
        lg: prevLayouts.lg?.filter(item => newWidgetIds.includes(item.i)) || [],
        md: prevLayouts.md?.filter(item => newWidgetIds.includes(item.i)) || [],
        sm: prevLayouts.sm?.filter(item => newWidgetIds.includes(item.i)) || [],
        xs: prevLayouts.xs?.filter(item => newWidgetIds.includes(item.i)) || [],
        xxs: prevLayouts.xxs?.filter(item => newWidgetIds.includes(item.i)) || []
      }
      
      return filteredLayouts
    })
  }, [widgets])

  const [availableWidgets] = useState<Omit<DraggableWidget, 'id' | 'data'>[]>([
    { type: 'metric', title: 'Revenue Metric', config: { color: '#3b82f6' } },
    { type: 'line-chart', title: 'Line Chart', config: { color: '#10b981', showGrid: true } },
    { type: 'bar-chart', title: 'Bar Chart', config: { color: '#f59e0b', showGrid: true } },
    { type: 'pie-chart', title: 'Pie Chart', config: { showLegend: true } },
  ])

  const handleLayoutChange = (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts(allLayouts)
    onLayoutChange?.(layout)
  }

  const handleAddWidget = (widgetType: Omit<DraggableWidget, 'id' | 'data'>) => {
    const newWidget: DraggableWidget = {
      ...widgetType,
      id: `widget-${Date.now()}`,
      data: generateSampleData(widgetType.type)
    }
    onWidgetAdd?.(newWidget)
    
    // Add a new layout item for the new widget
    const newLayoutItem: Layout = {
      i: newWidget.id,
      x: 0, // Place at the beginning
      y: 0,
      w: widgetType.type === 'metric' ? 3 : widgetType.type === 'line-chart' || widgetType.type === 'bar-chart' ? 6 : 4,
      h: widgetType.type === 'metric' ? 2 : 4,
      minW: 2,
      minH: 2
    }
    
    setLayouts(prevLayouts => ({
      lg: [newLayoutItem, ...prevLayouts.lg || []],
      md: [newLayoutItem, ...prevLayouts.md || []],
      sm: [newLayoutItem, ...prevLayouts.sm || []],
      xs: [newLayoutItem, ...prevLayouts.xs || []],
      xxs: [newLayoutItem, ...prevLayouts.xxs || []]
    }))
  }

  const generateSampleData = (type: string) => {
    switch (type) {
      case 'metric':
        return {
          value: Math.floor(Math.random() * 100000),
          change: (Math.random() - 0.5) * 0.2,
          format: 'currency'
        }
      case 'line-chart':
      case 'bar-chart':
        return Array.from({ length: 7 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: Math.floor(Math.random() * 1000)
        }))
      case 'pie-chart':
        return [
          { name: 'Desktop', value: 45, color: '#3b82f6' },
          { name: 'Mobile', value: 35, color: '#10b981' },
          { name: 'Tablet', value: 20, color: '#f59e0b' }
        ]
      default:
        return null
    }
  }

  const renderWidget = (widget: DraggableWidget) => {
    const isEditing = editMode && editable

    return (
      <Card 
        key={widget.id}
        className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 ${
          isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            {isEditing && (
              <GripVertical className="h-4 w-4 text-gray-400 mr-2 cursor-move" />
            )}
            {widget.title}
          </CardTitle>
          {isEditing && (
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                onClick={() => onWidgetRemove?.(widget.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <WidgetContent widget={widget} />
        </CardContent>
      </Card>
    )
  }

  const WidgetContent = ({ widget }: { widget: DraggableWidget }) => {
    switch (widget.type) {
      case 'metric':
        const metricData = widget.data as { value?: number; change?: number; format?: string } | null
        return (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {metricData?.format === 'currency' 
                ? `$${metricData.value?.toLocaleString() || 0}` 
                : metricData?.value?.toLocaleString() || 0}
            </div>
            <div className={`text-sm ${
              (metricData?.change || 0) > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {(metricData?.change || 0) > 0 ? '↗' : '↘'} 
              {Math.abs((metricData?.change || 0) * 100).toFixed(1)}%
            </div>
          </div>
        )
      case 'line-chart':
      case 'bar-chart':
        const chartData = widget.data as Array<{ name: string; value: number }> | null
        return (
          <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <div className="text-lg font-medium">Chart Visualization</div>
              <div className="text-sm">
                {chartData?.length || 0} data points
              </div>
            </div>
          </div>
        )
      case 'pie-chart':
        const pieData = widget.data as Array<{ name: string; value: number; color?: string }> | null
        return (
          <div className="h-32 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <div className="text-lg font-medium">Pie Chart</div>
              <div className="text-sm">
                {pieData?.length || 0} segments
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
            Widget Content
          </div>
        )
    }
  }

  return (
    <div className={`relative ${className || ''}`}>
      {/* Edit Mode Controls */}
      {editable && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "default" : "outline"}
              className={editMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {editMode ? 'Exit Edit Mode' : 'Edit Layout'}
            </Button>
            {editMode && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Drag widgets to rearrange • Resize by dragging corners
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Widget Panel */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
          >
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Widgets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableWidgets.map((widget, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddWidget(widget)}
                  className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  + {widget.title}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable Grid Layout */}
      <div className="w-full">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={80}
          isDraggable={editMode}
          isResizable={editMode}
          margin={[16, 16]}
          containerPadding={[16, 16]}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
          autoSize={true}
          width={1200}
        >
          {widgets.map(renderWidget)}
        </ResponsiveGridLayout>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .react-grid-layout {
          position: relative;
          width: 100% !important;
        }
        
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
          box-sizing: border-box;
        }
        
        .react-grid-item.cssTransforms {
          transition-property: transform;
        }
        
        .react-grid-item.resizing {
          opacity: 0.6;
          z-index: 3;
        }
        
        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
        }
        
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          cursor: se-resize;
          z-index: 10;
          background: transparent;
        }
        
        .react-grid-item > .react-resizable-handle::after {
          content: '';
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-right: 2px solid rgba(59, 130, 246, 0.6);
          border-bottom: 2px solid rgba(59, 130, 246, 0.6);
        }
        
        .react-grid-item:not(.react-grid-placeholder) {
          background: transparent;
          border: none;
        }
        
        .react-grid-item.react-grid-placeholder {
          background: rgba(59, 130, 246, 0.1);
          border: 2px dashed rgba(59, 130, 246, 0.4);
          border-radius: 12px;
          opacity: 0.8;
          transition-duration: 100ms;
          z-index: 2;
          user-select: none;
        }
        
        /* Ensure grid items don't overflow */
        .layout {
          min-height: 400px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .react-grid-item {
            touch-action: manipulation;
          }
        }
      `}</style>
    </div>
  )
}
