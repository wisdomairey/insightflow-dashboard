'use client'

import { useState, useMemo } from 'react'
import { Download, Filter, BarChart3, LineChart, PieChart, Table } from 'lucide-react'
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
      deviceData: mockData.devices,
      salesByCategory: mockData.salesCategories,
    }
  }, [selectedDateRange])

  const handleExport = () => {
    // Simulate export process
    addToast({
      type: 'info',
      title: 'Export Started',
      description: 'Preparing your dashboard data for export...'
    })

    // Simulate processing time
    setTimeout(() => {
      addToast({
        type: 'success',
        title: 'Export Complete',
        description: 'Your dashboard data has been exported successfully!'
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  InsightFlow
                </h1>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'overview'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('analytics')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'analytics'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveView('reports')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'reports'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Reports
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Date Range Picker */}
              <DateRangePicker 
                selectedRange={selectedDateRange}
                onRangeChange={setSelectedDateRange}
              />

              {/* Action Buttons */}
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={handleExport} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Overview View */}
          {activeView === 'overview' && (
            <>
              {/* KPI Metrics */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Key Performance Indicators
                </h2>
                <MetricGrid metrics={filteredData.metrics} />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>
                  Daily revenue over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <LineChartWidget 
                    title=""
                    data={filteredData.revenueData}
                    color="#3b82f6"
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Acquisition Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  User Acquisition
                </CardTitle>
                <CardDescription>
                  Traffic sources and channel performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <PieChartWidget 
                    title=""
                    data={filteredData.userChannels}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Sales by Category
                </CardTitle>
                <CardDescription>
                  Product category performance comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <BarChartWidget 
                    title=""
                    data={filteredData.salesByCategory}
                    color="#8b5cf6"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                  Device Usage
                </CardTitle>
                <CardDescription>
                  User device preferences and distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <PieChartWidget 
                    title=""
                    data={filteredData.deviceData}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest customer transactions and order details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.transactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-mono text-xs">
                          {transaction.id}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {String(transaction.customer || '')}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                          ${Number(transaction.amount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {String(transaction.status || '')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {transaction.date 
                            ? new Date(transaction.date as string | number | Date).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
            </>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Advanced Analytics
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Deep dive into your business metrics with advanced analytical tools and insights.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Revenue Analytics</CardTitle>
                    <CardDescription>Detailed revenue breakdown and forecasting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Advanced revenue analytics coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">User Behavior</CardTitle>
                    <CardDescription>Customer journey and engagement analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <LineChart className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        User behavior analytics coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Predictive Models</CardTitle>
                    <CardDescription>AI-powered forecasting and predictions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <PieChart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Predictive analytics coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Reports View */}
          {activeView === 'reports' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Reports & Exports
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Generate detailed reports and export your data in various formats.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Financial Reports</CardTitle>
                    <CardDescription>Revenue, expenses, and profit analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Monthly Financial Report (PDF)
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Quarterly Summary (Excel)
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Customer Reports</CardTitle>
                    <CardDescription>Customer insights and behavior reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Customer Analytics (PDF)
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Transaction Data (CSV)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
