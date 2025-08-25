'use client'

import { useState, useMemo } from 'react'
import { Download, Filter, BarChart3, Table, Database, Layout, Grid3X3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { ExportModal } from '@/components/modals/ExportModal'
import { PWAManager } from '@/components/pwa/PWAManager'
import { LineChartWidget } from '@/components/charts/LineChart'
import { BarChartWidget } from '@/components/charts/BarChart'
import { PieChartWidget } from '@/components/charts/PieChart'
import { DataUpload } from '@/components/data/DataUpload'
import { ManualDataEntry } from '@/components/data/ManualDataEntry'
import { DragDropLayout, DraggableWidget } from '@/components/layout/DragDropLayout'
import { mockData } from '@/data/mockData'
import { motion } from 'framer-motion'
import { TransformedData } from '@/types/import'
import { ExportData } from '@/lib/export'

export function DashboardView() {
  const [selectedDateRange, setSelectedDateRange] = useState('7d')
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'reports' | 'data'>('overview')
  const { toasts, addToast, removeToast } = useToast()
  const [customData, setCustomData] = useState<TransformedData | null>(null)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'drag'>('grid')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Process filtered data - use selectedDateRange for filtering
  const filteredData = useMemo(() => {
    const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90
    
    if (customData) {
      return {
        metrics: customData.metrics || [],
        revenueData: customData.chartData ? customData.chartData.slice(-days) : [],
        userChannels: [],
        salesData: []
      }
    } else {
      return {
        metrics: mockData.metrics || [],
        revenueData: mockData.revenue ? mockData.revenue.slice(-days) : [],
        userChannels: mockData.userChannels || [],
        salesData: mockData.salesCategories || []
      }
    }
  }, [customData, selectedDateRange])
  
  // Initialize dashboard widgets with actual data - make this stateful
  const [dashboardWidgets, setDashboardWidgets] = useState<DraggableWidget[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Initialize widgets only once, then update data without resetting widgets
  useMemo(() => {
    if (!isInitialized) {
      const initialWidgets: DraggableWidget[] = [
        { 
          id: 'metrics-1', 
          type: 'metric', 
          title: 'Total Revenue', 
          data: {
            value: filteredData.metrics[0]?.value || 0,
            change: filteredData.metrics[0]?.change || 0,
            format: 'currency'
          }
        },
        { 
          id: 'metrics-2', 
          type: 'metric', 
          title: 'Active Users', 
          data: {
            value: filteredData.metrics[1]?.value || 0,
            change: filteredData.metrics[1]?.change || 0,
            format: 'number'
          }
        },
        { 
          id: 'revenue-chart', 
          type: 'line-chart', 
          title: 'Revenue Trend', 
          data: filteredData.revenueData
        },
        { 
          id: 'users-chart', 
          type: 'bar-chart', 
          title: 'User Acquisition', 
          data: filteredData.userChannels
        },
        { 
          id: 'sales-chart', 
          type: 'pie-chart', 
          title: 'Sales by Channel', 
          data: filteredData.salesData
        },
      ]
      setDashboardWidgets(initialWidgets)
      setIsInitialized(true)
    } else {
      // Update data for existing widgets only
      setDashboardWidgets(prev => prev.map(widget => {
        switch (widget.id) {
          case 'metrics-1':
            return {
              ...widget,
              data: {
                value: filteredData.metrics[0]?.value || 0,
                change: filteredData.metrics[0]?.change || 0,
                format: 'currency'
              }
            }
          case 'metrics-2':
            return {
              ...widget,
              data: {
                value: filteredData.metrics[1]?.value || 0,
                change: filteredData.metrics[1]?.change || 0,
                format: 'number'
              }
            }
          case 'revenue-chart':
            return { ...widget, data: filteredData.revenueData }
          case 'users-chart':
            return { ...widget, data: filteredData.userChannels }
          case 'sales-chart':
            return { ...widget, data: filteredData.salesData }
          default:
            return widget
        }
      }))
    }
  }, [filteredData, isInitialized])

  // Animation variants for consistent page transitions
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const handleDataImport = (data: TransformedData) => {
    setCustomData(data)
    addToast({
      type: 'success',
      title: 'Data imported successfully!',
      description: `Imported ${data.metrics.length} metrics and ${data.chartData.length} data points`
    })
  }

  // Function to render widgets dynamically
  const renderWidget = (widget: DraggableWidget) => {
    switch (widget.type) {
      case 'metric':
        const metricData = widget.data as { value?: number; change?: number; format?: string }
        return (
          <div key={widget.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{widget.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metricData?.format === 'currency' ? 
                    `$${(metricData?.value || 0).toLocaleString()}` : 
                    (metricData?.value || 0).toLocaleString()
                  }
                </p>
                <p className={`text-sm ${(metricData?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(metricData?.change || 0) >= 0 ? '↗' : '↘'} {Math.abs(metricData?.change || 0)}%
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )
      case 'line-chart':
        return (
          <LineChartWidget 
            key={widget.id}
            title={widget.title} 
            data={Array.isArray(widget.data) ? widget.data : []}
          />
        )
      case 'bar-chart':
        return (
          <BarChartWidget 
            key={widget.id}
            title={widget.title} 
            data={Array.isArray(widget.data) ? widget.data : []}
          />
        )
      case 'pie-chart':
        return (
          <PieChartWidget 
            key={widget.id}
            title={widget.title} 
            data={Array.isArray(widget.data) ? widget.data : []}
          />
        )
      default:
        return null
    }
  }

  const handleManualDataUpdate = (entries: Array<{ date: string; revenue: number; users: number; conversions: number }>) => {
    // Transform manual entries to dashboard format
    const transformedData: TransformedData = {
      metrics: [
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: entries.reduce((sum, entry) => sum + entry.revenue, 0),
          previousValue: entries.reduce((sum, entry) => sum + entry.revenue, 0) * 0.9,
          change: 0.1,
          changeType: 'increase',
          format: 'currency',
          icon: 'TrendingUp'
        },
        {
          id: 'users',
          title: 'Total Users',
          value: entries.reduce((sum, entry) => sum + entry.users, 0),
          previousValue: entries.reduce((sum, entry) => sum + entry.users, 0) * 0.95,
          change: 0.05,
          changeType: 'increase',
          format: 'number',
          icon: 'Users'
        }
      ],
      chartData: entries.map(entry => ({
        name: entry.date,
        value: entry.revenue
      })),
      rawData: entries
    }
    
    setCustomData(transformedData)
    addToast({
      type: 'success',
      title: 'Manual data updated!',
      description: `Updated ${entries.length} data entries`
    })
  }

  const handleExport = () => {
    setIsExportModalOpen(true)
  }

  const handleExportStart = () => {
    addToast({
      type: 'info',
      title: 'Export Started',
      description: 'Preparing your dashboard data for export...'
    })
  }

  const handleExportComplete = (success: boolean, message: string) => {
    addToast({
      type: success ? 'success' : 'error',
      title: success ? 'Export Complete' : 'Export Failed',
      description: message
    })
  }

  // Prepare export data
  const exportData: ExportData = {
    metrics: filteredData.metrics,
    chartData: {
      revenue: filteredData.revenueData,
      users: filteredData.userChannels,
      sales: filteredData.salesData
    },
    dateRange: selectedDateRange,
    generatedAt: new Date().toISOString()
  }

  const handleFilter = () => {
    addToast({
      type: 'info',
      title: 'Filters applied'
    })
  }

  const renderOverviewContent = () => (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Layout Toggle */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Dashboard Overview
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setLayoutMode('grid')}
            variant={layoutMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            className={`flex items-center transition-all duration-200 ${
              layoutMode === 'grid' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            onClick={() => setLayoutMode('drag')}
            variant={layoutMode === 'drag' ? 'default' : 'outline'}
            size="sm"
            className={`flex items-center transition-all duration-200 ${
              layoutMode === 'drag' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <Layout className="h-4 w-4 mr-1" />
            Drag & Drop
          </Button>
        </div>
      </motion.div>

      {/* Render based on layout mode */}
      {layoutMode === 'grid' ? (
        // Dynamic Grid Layout based on current widgets
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Render metric widgets */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardWidgets
              .filter(widget => widget.type === 'metric')
              .map(widget => (
                <motion.div key={widget.id} variants={staggerItem}>
                  {renderWidget(widget)}
                </motion.div>
              ))
            }
          </motion.div>
          
          {/* Render chart widgets */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dashboardWidgets
              .filter(widget => widget.type !== 'metric')
              .map(widget => (
                <motion.div key={widget.id} variants={staggerItem}>
                  {renderWidget(widget)}
                </motion.div>
              ))
            }
          </motion.div>
        </motion.div>
      ) : (
        // Drag & Drop Layout
        <motion.div variants={staggerItem}>
          <DragDropLayout
            widgets={dashboardWidgets}
            onLayoutChange={(layout) => {
              console.log('Layout changed:', layout)
            }}
            onWidgetRemove={(widgetId) => {
              setDashboardWidgets(prev => prev.filter(w => w.id !== widgetId))
              addToast({
                type: 'info',
                title: 'Widget removed'
              })
            }}
            onWidgetAdd={(widget) => {
              setDashboardWidgets(prev => [...prev, widget])
              addToast({
                type: 'success',
                title: 'Widget added!'
              })
            }}
            editable={true}
            className="min-h-[600px]"
          />
        </motion.div>
      )}
    </motion.div>
  )

  const renderAnalyticsContent = () => (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={staggerItem}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Sessions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">45,231</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Bounce Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">23.5%</div>
              <p className="text-xs text-green-600 dark:text-green-400">
                -5.2% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Avg. Session Duration
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">4m 32s</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Conversion Rate
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">3.42%</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                +8.1% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={staggerItem}>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Traffic Sources</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Top channels driving traffic to your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">Organic Search</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">45.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">Direct</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">28.1%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">Social Media</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">16.7%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">Email</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">10.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Top Pages</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Most visited pages on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">/dashboard</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">12,543</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">/products</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">8,721</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">/pricing</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">6,432</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100">/about</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">4,321</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )

  const renderReportsContent = () => (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={staggerItem}>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Monthly Report</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Comprehensive monthly analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Sales Report</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Detailed sales performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">User Report</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                User engagement and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Report History</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Previously generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Q3 2024 Financial Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generated on Oct 15, 2024</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">User Analytics September</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generated on Oct 1, 2024</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Sales Performance Q3</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generated on Sep 30, 2024</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderDataContent = () => (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={staggerItem} className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Data Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Import your data from CSV/JSON files or enter data manually to create personalized dashboards and insights.
        </p>
      </motion.div>

      {/* Data Input Section */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <motion.div variants={staggerItem}>
          <DataUpload onDataImport={handleDataImport} />
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <ManualDataEntry onDataUpdate={handleManualDataUpdate} />
        </motion.div>
      </motion.div>

      {/* Data Preview */}
      {customData && (
        <motion.div variants={staggerItem}>
          <Card className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/30 border-indigo-200/50 dark:border-indigo-800/50 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-gray-900 dark:text-gray-100 text-xl">
                <Database className="mr-3 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Imported Data Preview
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your imported data is now being used across all dashboard widgets and visualizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Metrics</h4>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                    {customData.metrics.length}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Generated metrics</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Data Points</h4>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                    {customData.chartData.length}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Chart data points</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-5 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Raw Records</h4>
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Database className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                    {customData.rawData.length}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Original records</p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setCustomData(null)}
                  variant="outline"
                  className="flex items-center border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Reset to Demo Data
                </Button>
                <Button 
                  onClick={() => setActiveView('overview')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* PWA Settings */}
      <motion.div variants={staggerItem}>
        <Card className="bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100 text-xl">
              <Download className="mr-3 h-6 w-6 text-gray-600 dark:text-gray-400" />
              App Settings
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Install the app and manage notifications for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PWAManager onNotificationToggle={(enabled) => {
              console.log('Notifications:', enabled)
            }} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={exportData}
        onExportStart={handleExportStart}
        onExportComplete={handleExportComplete}
      />
      
      {/* Header */}
      <header className="border-b border-white/20 dark:border-gray-800/20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InsightFlow
              </h1>
            </div>
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeView === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 flex items-center ${
                  activeView === 'analytics'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveView('reports')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 flex items-center ${
                  activeView === 'reports'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <Table className="mr-2 h-4 w-4" />
                Reports
              </button>
              <button
                onClick={() => setActiveView('data')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 flex items-center ${
                  activeView === 'data'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <Database className="mr-2 h-4 w-4" />
                Data
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <DateRangePicker 
              selectedRange={selectedDateRange}
              onRangeChange={setSelectedDateRange}
            />
            <button 
              onClick={handleFilter}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 shadow-sm"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto" id="dashboard-export">
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
          >
            {activeView === 'overview' && renderOverviewContent()}
            {activeView === 'analytics' && renderAnalyticsContent()}
            {activeView === 'reports' && renderReportsContent()}
            {activeView === 'data' && renderDataContent()}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
