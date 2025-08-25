// Core data types for the dashboard

export interface DashboardMetric {
  id: string
  title: string
  value: number
  previousValue?: number
  change?: number
  changeType: 'increase' | 'decrease' | 'neutral'
  format: 'number' | 'currency' | 'percentage'
  icon?: string
}

export interface ChartDataPoint {
  name: string
  value: number
  date?: string
  category?: string
  [key: string]: string | number | boolean | undefined
}

export interface Widget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'custom'
  title: string
  size: 'small' | 'medium' | 'large'
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  data: DashboardMetric[] | ChartDataPoint[] | TableRow[] | PieChartData[] | Record<string, unknown>
  config?: WidgetConfig
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'area' | 'pie' | 'donut'
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  animated?: boolean
  [key: string]: string | number | boolean | string[] | undefined
}

export interface Dashboard {
  id: string
  name: string
  widgets: Widget[]
  layout: Array<{
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
  }>
  createdAt: string
  updatedAt: string
  isPublic: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
}

export interface FilterOption {
  id: string
  label: string
  value: string | number
  type: 'select' | 'date' | 'range' | 'search'
}

export interface DateRange {
  from: Date
  to: Date
}

export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    destructive: string
    warning: string
    success: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel' | 'png'
  filename?: string
  includeCharts?: boolean
  dateRange?: DateRange
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Chart specific types
export interface LineChartData extends ChartDataPoint {
  line1?: number
  line2?: number
  line3?: number
}

export interface BarChartData extends ChartDataPoint {
  bar1?: number
  bar2?: number
  bar3?: number
}

export interface PieChartData {
  name: string
  value: number
  color?: string
  [key: string]: string | number | boolean | undefined
}

export interface TableColumn {
  id: string
  header: string
  accessorKey: string
  cell?: (value: string | number | boolean) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
}

export interface TableRow {
  id: string
  [key: string]: string | number | boolean | Date | null | undefined
}
