'use client'

import { useState, useMemo } from 'react'
import { Download, Filter, BarChart3, Table, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { MetricGrid } from '@/components/widgets/MetricCard'
import { LineChartWidget } from '@/components/charts/LineChart'
import { BarChartWidget } from '@/components/charts/BarChart'
import { PieChartWidget } from '@/components/charts/PieChart'
import { mockData } from '@/data/mockData'

export function DashboardView() {
  const [selectedDateRange, setSelectedDateRange] = useState('7d')
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'reports'>('overview')
  const { toasts, addToast, removeToast } = useToast()

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return {
      metrics: mockData.metrics,
      revenueData: mockData.revenue.slice(-days),
      userChannels: mockData.userChannels,
      salesData: mockData.salesCategories
    }
  }, [selectedDateRange])

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Data exported successfully!'
    })
  }

  const handleFilter = () => {
    addToast({
      type: 'info',
      title: 'Filters applied'
    })
  }

  const renderOverviewContent = () => (
    <div className="space-y-6">
      <MetricGrid metrics={filteredData.metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartWidget 
          title="Revenue Trend" 
          data={filteredData.revenueData}
        />
        <BarChartWidget 
          title="User Acquisition" 
          data={filteredData.userChannels}
        />
      </div>
      <PieChartWidget 
        title="Sales by Channel" 
        data={filteredData.salesData}
      />
    </div>
  )

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  )

  const renderReportsContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Monthly Report</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Comprehensive monthly analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Sales Report</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Detailed sales performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">User Report</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              User engagement and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
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
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">User Analytics September</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generated on Oct 1, 2024</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Sales Performance Q3</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generated on Sep 30, 2024</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              InsightFlow Dashboard
            </h1>
            <nav className="flex space-x-1">
              <Button
                variant={activeView === 'overview' ? 'default' : 'ghost'}
                onClick={() => setActiveView('overview')}
                className="text-sm"
              >
                Overview
              </Button>
              <Button
                variant={activeView === 'analytics' ? 'default' : 'ghost'}
                onClick={() => setActiveView('analytics')}
                className="text-sm"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant={activeView === 'reports' ? 'default' : 'ghost'}
                onClick={() => setActiveView('reports')}
                className="text-sm"
              >
                <Table className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <DateRangePicker 
              selectedRange={selectedDateRange}
              onRangeChange={setSelectedDateRange}
            />
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {activeView === 'overview' && renderOverviewContent()}
          {activeView === 'analytics' && renderAnalyticsContent()}
          {activeView === 'reports' && renderReportsContent()}
        </div>
      </main>
    </div>
  )
}
