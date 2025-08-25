import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { DashboardMetric, LineChartData, BarChartData, PieChartData, ExportOptions } from '@/types'

export interface ExportData {
  metrics: DashboardMetric[]
  chartData: {
    revenue: LineChartData[]
    users: BarChartData[]
    sales: PieChartData[]
  }
  dateRange: string
  generatedAt: string
}

// Export to CSV
export const exportToCSV = (data: ExportData, filename?: string) => {
  const csvData = [
    // Headers
    ['Metric', 'Value', 'Change (%)', 'Format'],
    // Metrics data
    ...data.metrics.map(metric => [
      metric.title,
      metric.value.toString(),
      metric.change?.toString() || '0',
      metric.format || 'number'
    ]),
    [], // Empty row
    ['Chart Data - Revenue'],
    ['Date', 'Revenue'],
    ...data.chartData.revenue.map(item => [
      item.name || item.date || '',
      item.value?.toString() || '0'
    ]),
    [], // Empty row
    ['Chart Data - User Channels'],
    ['Channel', 'Users'],
    ...data.chartData.users.map(item => [
      item.name || '',
      item.value?.toString() || '0'
    ]),
    [], // Empty row
    ['Chart Data - Sales by Category'],
    ['Category', 'Sales'],
    ...data.chartData.sales.map(item => [
      item.name,
      item.value.toString()
    ]),
    [], // Empty row
    ['Export Information'],
    ['Date Range', data.dateRange],
    ['Generated At', data.generatedAt]
  ]

  const csv = Papa.unparse(csvData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const fileName = filename || `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`
  saveAs(blob, fileName)
}

// Export to PDF
export const exportToPDF = async (elementId: string, data: ExportData, filename?: string) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    // Create canvas from the dashboard element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('l', 'mm', 'a4') // Landscape orientation
    
    // Calculate dimensions to fit the page
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 30 // Leave space for header

    // Add header
    pdf.setFontSize(20)
    pdf.setTextColor(0, 0, 0)
    pdf.text('InsightFlow Dashboard Report', 20, 20)
    
    // Add metadata
    pdf.setFontSize(12)
    pdf.text(`Date Range: ${data.dateRange}`, 20, 25)
    pdf.text(`Generated: ${data.generatedAt}`, pdfWidth - 70, 25)

    // Add dashboard image
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

    // Add metrics summary on second page
    pdf.addPage()
    pdf.setFontSize(16)
    pdf.text('Key Metrics Summary', 20, 20)
    
    let yPosition = 35
    data.metrics.forEach((metric) => {
      pdf.setFontSize(12)
      pdf.text(`${metric.title}: ${formatMetricValue(metric.value, metric.format)}`, 20, yPosition)
      pdf.text(`Change: ${metric.change ? (metric.change > 0 ? '+' : '') + metric.change + '%' : 'N/A'}`, 120, yPosition)
      yPosition += 10
      
      if (yPosition > 270) { // Start new page if needed
        pdf.addPage()
        yPosition = 20
      }
    })

    const fileName = filename || `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

// Export dashboard screenshot as PNG
export const exportToPNG = async (elementId: string, filename?: string) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = filename || `dashboard-${new Date().toISOString().split('T')[0]}.png`
        saveAs(blob, fileName)
      }
    })
  } catch (error) {
    console.error('PNG export failed:', error)
    throw new Error('Failed to generate PNG. Please try again.')
  }
}

// Format metric values for display
const formatMetricValue = (value: number, format?: string): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    case 'percentage':
      return `${value}%`
    default:
      return value.toLocaleString()
  }
}

// Comprehensive export function
export const exportDashboard = async (
  options: ExportOptions & { data: ExportData; elementId?: string }
) => {
  const { format, data, filename, elementId = 'dashboard-export' } = options

  switch (format) {
    case 'csv':
      return exportToCSV(data, filename)
    case 'pdf':
      return await exportToPDF(elementId, data, filename)
    case 'png':
      return await exportToPNG(elementId, filename)
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

// Schedule export (placeholder for future implementation)
export const scheduleExport = (
  options: ExportOptions & { 
    schedule: 'daily' | 'weekly' | 'monthly'
    email?: string
  }
) => {
  // This would integrate with a backend service for scheduled exports
  console.log('Scheduled export configured:', options)
  // For now, just return a promise that resolves
  return Promise.resolve({
    success: true,
    message: `Export scheduled for ${options.schedule} delivery`
  })
}
