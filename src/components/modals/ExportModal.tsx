'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, FileText, Image, Database, Calendar, Mail } from 'lucide-react'
import { exportDashboard, scheduleExport, ExportData } from '@/lib/export'
import { motion } from 'framer-motion'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: ExportData
  onExportStart: () => void
  onExportComplete: (success: boolean, message: string) => void
}

export function ExportModal({
  isOpen,
  onClose,
  data,
  onExportStart,
  onExportComplete
}: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'png'>('pdf')
  const [filename, setFilename] = useState('')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [isScheduled, setIsScheduled] = useState(false)
  const [schedule, setSchedule] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [email, setEmail] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    onExportStart()

    try {
      if (isScheduled) {
        // Handle scheduled export
        await scheduleExport({
          format: exportFormat,
          filename,
          includeCharts,
          schedule,
          email: email || undefined
        })
        onExportComplete(true, `Export scheduled for ${schedule} delivery`)
      } else {
        // Handle immediate export
        await exportDashboard({
          format: exportFormat,
          filename: filename || undefined,
          includeCharts,
          data,
          elementId: 'dashboard-export'
        })
        onExportComplete(true, `Dashboard exported as ${exportFormat.toUpperCase()} successfully!`)
      }
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      onExportComplete(false, error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Complete dashboard with charts and metrics' },
    { value: 'csv', label: 'CSV Data', icon: Database, description: 'Raw data for analysis in Excel/Sheets' },
    { value: 'png', label: 'PNG Image', icon: Image, description: 'High-quality dashboard screenshot' }
  ]

  const scheduleOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <Download className="mr-2 h-5 w-5" />
            Export Dashboard
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Choose your export format and options. Exports include data from the selected date range.
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Export Format</Label>
            <div className="grid grid-cols-1 gap-3">
              {formatOptions.map((option) => {
                const Icon = option.icon
                return (
                  <div
                    key={option.value}
                    className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      exportFormat === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setExportFormat(option.value as 'pdf' | 'csv' | 'png')}
                  >
                    <Icon className={`h-5 w-5 ${
                      exportFormat === option.value 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          exportFormat === option.value 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {option.label}
                        </span>
                        {exportFormat === option.value && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        exportFormat === option.value 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filename Input */}
          <div className="space-y-2">
            <Label htmlFor="filename" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Filename (optional)
            </Label>
            <Input
              id="filename"
              placeholder={`dashboard-export-${new Date().toISOString().split('T')[0]}`}
              value={filename}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilename(e.target.value)}
              className="border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Include Charts Option */}
          {exportFormat === 'pdf' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={includeCharts}
                onCheckedChange={setIncludeCharts}
              />
              <Label htmlFor="includeCharts" className="text-sm text-gray-900 dark:text-gray-100">
                Include charts and visualizations
              </Label>
            </div>
          )}

          {/* Schedule Export Option */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="scheduleExport"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label htmlFor="scheduleExport" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Schedule recurring exports
              </Label>
            </div>

            {isScheduled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 ml-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-900 dark:text-gray-100">Frequency</Label>
                    <Select value={schedule} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSchedule(value)}>
                      <SelectTrigger className="border-gray-300 dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-900 dark:text-gray-100">Email (optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <DialogFooter className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isExporting}
            className="border-gray-300 dark:border-gray-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isScheduled ? 'Scheduling...' : 'Exporting...'}
              </>
            ) : (
              <>
                {isScheduled ? <Calendar className="mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
                {isScheduled ? 'Schedule Export' : 'Export Now'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
