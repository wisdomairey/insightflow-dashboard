import { 
  DashboardMetric, 
  ChartDataPoint, 
  Widget, 
  Dashboard,
  LineChartData,
  BarChartData,
  PieChartData,
  TableRow
} from '@/types'

// Key Performance Indicators
export const kpiMetrics: DashboardMetric[] = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 2847392,
    previousValue: 2541230,
    change: 0.12,
    changeType: 'increase',
    format: 'currency',
    icon: 'TrendingUp'
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 12849,
    previousValue: 11923,
    change: 0.078,
    changeType: 'increase',
    format: 'number',
    icon: 'Users'
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: 0.047,
    previousValue: 0.051,
    change: -0.078,
    changeType: 'decrease',
    format: 'percentage',
    icon: 'Target'
  },
  {
    id: 'satisfaction',
    title: 'Customer Satisfaction',
    value: 0.942,
    previousValue: 0.938,
    change: 0.004,
    changeType: 'increase',
    format: 'percentage',
    icon: 'Heart'
  },
  {
    id: 'orders',
    title: 'Orders',
    value: 1847,
    previousValue: 1692,
    change: 0.092,
    changeType: 'increase',
    format: 'number',
    icon: 'ShoppingCart'
  },
  {
    id: 'bounce-rate',
    title: 'Bounce Rate',
    value: 0.234,
    previousValue: 0.267,
    change: -0.124,
    changeType: 'decrease',
    format: 'percentage',
    icon: 'ArrowRightLeft'
  }
]

// Revenue trend data for the last 12 months
export const revenueData: LineChartData[] = [
  { name: 'Jan', value: 1847392, line1: 1847392, date: '2024-01' },
  { name: 'Feb', value: 1923845, line1: 1923845, date: '2024-02' },
  { name: 'Mar', value: 2147293, line1: 2147293, date: '2024-03' },
  { name: 'Apr', value: 2034729, line1: 2034729, date: '2024-04' },
  { name: 'May', value: 2293847, line1: 2293847, date: '2024-05' },
  { name: 'Jun', value: 2458392, line1: 2458392, date: '2024-06' },
  { name: 'Jul', value: 2647584, line1: 2647584, date: '2024-07' },
  { name: 'Aug', value: 2738492, line1: 2738492, date: '2024-08' },
  { name: 'Sep', value: 2584729, line1: 2584729, date: '2024-09' },
  { name: 'Oct', value: 2793847, line1: 2793847, date: '2024-10' },
  { name: 'Nov', value: 2847392, line1: 2847392, date: '2024-11' },
  { name: 'Dec', value: 2947583, line1: 2947583, date: '2024-12' }
]

// User acquisition channels
export const userChannelsData: BarChartData[] = [
  { name: 'Organic Search', value: 4392, bar1: 4392, category: 'acquisition' },
  { name: 'Social Media', value: 3274, bar1: 3274, category: 'acquisition' },
  { name: 'Direct', value: 2847, bar1: 2847, category: 'acquisition' },
  { name: 'Email', value: 1583, bar1: 1583, category: 'acquisition' },
  { name: 'Paid Ads', value: 753, bar1: 753, category: 'acquisition' }
]

// Device usage distribution
export const deviceData: PieChartData[] = [
  { name: 'Desktop', value: 6847, color: '#3b82f6' },
  { name: 'Mobile', value: 4523, color: '#06b6d4' },
  { name: 'Tablet', value: 1479, color: '#8b5cf6' }
]

// Sales by product category
export const salesCategoryData: BarChartData[] = [
  { name: 'Electronics', value: 847392, bar1: 847392, category: 'sales' },
  { name: 'Clothing', value: 623847, bar1: 623847, category: 'sales' },
  { name: 'Home & Garden', value: 484729, bar1: 484729, category: 'sales' },
  { name: 'Sports', value: 372945, bar1: 372945, category: 'sales' },
  { name: 'Books', value: 184729, bar1: 184729, category: 'sales' },
  { name: 'Beauty', value: 334750, bar1: 334750, category: 'sales' }
]

// Geographic sales data
export const geographicData: ChartDataPoint[] = [
  { name: 'United States', value: 1284739, category: 'geographic' },
  { name: 'Canada', value: 384729, category: 'geographic' },
  { name: 'United Kingdom', value: 293847, category: 'geographic' },
  { name: 'Germany', value: 247583, category: 'geographic' },
  { name: 'France', value: 184729, category: 'geographic' },
  { name: 'Australia', value: 147392, category: 'geographic' },
  { name: 'Japan', value: 304858, category: 'geographic' }
]

// Recent transactions table data
export const transactionsData: TableRow[] = [
  {
    id: 'txn-001',
    orderNumber: 'ORD-2024-001847',
    customer: 'Sarah Johnson',
    amount: 2847.99,
    status: 'Completed',
    date: '2024-12-05T10:30:00Z',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'txn-002',
    orderNumber: 'ORD-2024-001846',
    customer: 'Michael Chen',
    amount: 1593.50,
    status: 'Processing',
    date: '2024-12-05T09:15:00Z',
    paymentMethod: 'PayPal'
  },
  {
    id: 'txn-003',
    orderNumber: 'ORD-2024-001845',
    customer: 'Emily Rodriguez',
    amount: 749.25,
    status: 'Shipped',
    date: '2024-12-05T08:45:00Z',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'txn-004',
    orderNumber: 'ORD-2024-001844',
    customer: 'David Wilson',
    amount: 3294.75,
    status: 'Completed',
    date: '2024-12-04T16:20:00Z',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'txn-005',
    orderNumber: 'ORD-2024-001843',
    customer: 'Lisa Thompson',
    amount: 892.40,
    status: 'Refunded',
    date: '2024-12-04T14:10:00Z',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'txn-006',
    orderNumber: 'ORD-2024-001842',
    customer: 'Robert Brown',
    amount: 1847.30,
    status: 'Completed',
    date: '2024-12-04T11:55:00Z',
    paymentMethod: 'Digital Wallet'
  },
  {
    id: 'txn-007',
    orderNumber: 'ORD-2024-001841',
    customer: 'Jennifer Davis',
    amount: 624.99,
    status: 'Processing',
    date: '2024-12-04T10:30:00Z',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'txn-008',
    orderNumber: 'ORD-2024-001840',
    customer: 'Mark Anderson',
    amount: 2150.75,
    status: 'Shipped',
    date: '2024-12-03T15:45:00Z',
    paymentMethod: 'PayPal'
  }
]

// Top products performance
export const topProductsData: TableRow[] = [
  {
    id: 'prod-001',
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    sales: 847,
    revenue: 254100,
    growth: 0.23,
    stock: 156
  },
  {
    id: 'prod-002',
    name: 'Smart Fitness Watch',
    category: 'Electronics',
    sales: 623,
    revenue: 186900,
    growth: 0.18,
    stock: 89
  },
  {
    id: 'prod-003',
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    sales: 1294,
    revenue: 38820,
    growth: 0.42,
    stock: 347
  },
  {
    id: 'prod-004',
    name: 'Ergonomic Office Chair',
    category: 'Home & Garden',
    sales: 187,
    revenue: 74800,
    growth: 0.15,
    stock: 23
  },
  {
    id: 'prod-005',
    name: 'Yoga Mat Premium',
    category: 'Sports',
    sales: 456,
    revenue: 27360,
    growth: 0.31,
    stock: 78
  }
]

// Default dashboard layout
export const defaultWidgets: Widget[] = [
  {
    id: 'widget-revenue',
    type: 'metric',
    title: 'Revenue Overview',
    size: 'medium',
    position: { x: 0, y: 0, w: 6, h: 2 },
    data: kpiMetrics.slice(0, 3),
    config: { animated: true }
  },
  {
    id: 'widget-users',
    type: 'metric',
    title: 'User Metrics',
    size: 'medium',
    position: { x: 6, y: 0, w: 6, h: 2 },
    data: kpiMetrics.slice(3, 6),
    config: { animated: true }
  },
  {
    id: 'widget-revenue-chart',
    type: 'chart',
    title: 'Revenue Trend',
    size: 'large',
    position: { x: 0, y: 2, w: 8, h: 4 },
    data: revenueData,
    config: { 
      chartType: 'line', 
      colors: ['#3b82f6'], 
      showGrid: true, 
      animated: true 
    }
  },
  {
    id: 'widget-channels',
    type: 'chart',
    title: 'User Acquisition',
    size: 'medium',
    position: { x: 8, y: 2, w: 4, h: 4 },
    data: userChannelsData,
    config: { 
      chartType: 'bar', 
      colors: ['#06b6d4'], 
      showLegend: false,
      animated: true 
    }
  },
  {
    id: 'widget-devices',
    type: 'chart',
    title: 'Device Usage',
    size: 'medium',
    position: { x: 0, y: 6, w: 4, h: 3 },
    data: deviceData,
    config: { 
      chartType: 'pie', 
      showLegend: true,
      animated: true 
    }
  },
  {
    id: 'widget-categories',
    type: 'chart',
    title: 'Sales by Category',
    size: 'large',
    position: { x: 4, y: 6, w: 8, h: 3 },
    data: salesCategoryData,
    config: { 
      chartType: 'bar', 
      colors: ['#8b5cf6'], 
      showGrid: true,
      animated: true 
    }
  },
  {
    id: 'widget-transactions',
    type: 'table',
    title: 'Recent Transactions',
    size: 'large',
    position: { x: 0, y: 9, w: 12, h: 4 },
    data: transactionsData
  }
]

// Sample dashboard
export const sampleDashboard: Dashboard = {
  id: 'dashboard-main',
  name: 'Executive Dashboard',
  widgets: defaultWidgets,
  layout: defaultWidgets.map(widget => ({
    i: widget.id,
    ...widget.position,
    minW: 2,
    minH: 2
  })),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  isPublic: false
}

// Export all data for easy access
export const mockData = {
  metrics: kpiMetrics,
  revenue: revenueData,
  userChannels: userChannelsData,
  devices: deviceData,
  salesCategories: salesCategoryData,
  geographic: geographicData,
  transactions: transactionsData,
  topProducts: topProductsData,
  dashboard: sampleDashboard
}
