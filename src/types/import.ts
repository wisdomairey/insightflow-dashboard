import { DashboardMetric, LineChartData, BarChartData, PieChartData } from './index'

// Data import types
export interface ImportedDataRow {
  [key: string]: string | number | Date
}

export interface TransformedData {
  metrics: DashboardMetric[]
  chartData: LineChartData[] | BarChartData[] | PieChartData[]
  rawData: ImportedDataRow[]
}

export interface DataImportConfig {
  dateColumn?: string
  valueColumns: string[]
  metricMappings: Record<string, {
    title: string
    format: 'currency' | 'number' | 'percentage'
    icon?: string
  }>
}

export interface ImportStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  message?: string
  fileName?: string
  recordCount?: number
}
