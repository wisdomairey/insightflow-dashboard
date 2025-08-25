'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { TransformedData, ImportedDataRow, ImportStatus } from '@/types/import'
import { DashboardMetric } from '@/types'

interface DataUploadProps {
  onDataImport: (data: TransformedData) => void
  className?: string
}

export function DataUpload({ onDataImport, className }: DataUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<ImportStatus>({ status: 'idle' })
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadStatus({ status: 'uploading', fileName: file.name })

    try {
      const text = await file.text()
      let data: ImportedDataRow[]

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        data = parseCSV(text)
      } else if (file.name.endsWith('.json')) {
        // Parse JSON
        data = JSON.parse(text) as ImportedDataRow[]
      } else {
        throw new Error('Unsupported file format. Please upload CSV or JSON files.')
      }

      // Validate and transform data
      const transformedData = validateAndTransformData(data)
      
      onDataImport(transformedData)
      setUploadStatus({ 
        status: 'success', 
        message: `Successfully imported ${file.name}`,
        fileName: file.name,
        recordCount: data.length
      })
    } catch (error) {
      setUploadStatus({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to import data',
        fileName: file.name 
      })
    }
  }, [onDataImport])

  const parseCSV = (csvText: string): ImportedDataRow[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: Record<string, string | number> = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(Number(value)) ? value : Number(value)
      })
      
      return row
    })
  }

  const validateAndTransformData = (rawData: ImportedDataRow[]): TransformedData => {
    // Transform raw data into dashboard format
    // This is a simplified example - you'd customize based on your data structure
    
    const metrics: DashboardMetric[] = []
    const chartData = []
    
    // Example transformation logic
    if (rawData.length > 0) {
      const sample = rawData[0]
      
      // Look for revenue data
      if ('revenue' in sample || 'sales' in sample) {
        const revenueKey = 'revenue' in sample ? 'revenue' : 'sales'
        const totalRevenue = rawData.reduce((sum, row) => sum + (Number(row[revenueKey]) || 0), 0)
        
        metrics.push({
          id: 'revenue',
          title: 'Total Revenue',
          value: totalRevenue,
          previousValue: totalRevenue * 0.9, // Mock previous value
          change: 0.1,
          changeType: 'increase',
          format: 'currency',
          icon: 'TrendingUp'
        })
      }
      
      // Transform for charts
      chartData.push(...rawData.map((row, index) => ({
        name: String(row.date || row.period || `Period ${index + 1}`),
        value: Number(row.revenue || row.sales || row.value || 0)
      })))
    }
    
    return {
      metrics,
      chartData,
      rawData
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const downloadSampleData = () => {
    const sampleCSV = `date,revenue,users,conversion_rate
2024-01-01,25000,1200,0.045
2024-01-02,28000,1350,0.048
2024-01-03,32000,1400,0.052
2024-01-04,29000,1320,0.047
2024-01-05,35000,1500,0.055`

    const blob = new Blob([sampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={`bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 border-blue-200/50 dark:border-blue-800/50 shadow-lg ${className || ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
          <Upload className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          Import Your Data
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Upload CSV or JSON files to visualize your data
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105 shadow-lg' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploadStatus.status === 'uploading' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Processing {uploadStatus.fileName}...</p>
            </motion.div>
          ) : (
            <>
              <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Drop your data file here
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Supports CSV and JSON formats
              </p>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </label>
            </>
          )}
        </div>

        {/* Status Messages */}
        {uploadStatus.status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-green-800 dark:text-green-200">{uploadStatus.message}</span>
          </motion.div>
        )}

        {uploadStatus.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
            <span className="text-red-800 dark:text-red-200">{uploadStatus.message}</span>
          </motion.div>
        )}

        {/* Sample Data */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Need sample data?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download a sample CSV file to see the expected format
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={downloadSampleData}
              className="flex items-center border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Sample CSV
            </Button>
          </div>
        </div>

        {/* Data Format Guide */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Supported Data Formats:</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>CSV:</strong> date, revenue, users, conversion_rate</p>
            <p><strong>JSON:</strong> Array of objects with numeric values</p>
            <p><strong>Required fields:</strong> At least one numeric column for metrics</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
