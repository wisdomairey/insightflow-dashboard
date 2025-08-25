'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Save, Edit3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface DataEntry {
  id: string
  date: string
  revenue: number
  users: number
  conversions: number
}

interface ManualDataEntryProps {
  onDataUpdate: (data: DataEntry[]) => void
  initialData?: DataEntry[]
  className?: string
}

export function ManualDataEntry({ onDataUpdate, initialData = [], className }: ManualDataEntryProps) {
  const [entries, setEntries] = useState<DataEntry[]>(initialData.length > 0 ? initialData : [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      revenue: 0,
      users: 0,
      conversions: 0
    }
  ])

  const addNewEntry = () => {
    const newEntry: DataEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      revenue: 0,
      users: 0,
      conversions: 0
    }
    setEntries([...entries, newEntry])
  }

  const updateEntry = (id: string, field: keyof DataEntry, value: string | number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const deleteEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id))
    }
  }

  const saveData = () => {
    onDataUpdate(entries)
  }

  return (
    <Card className={`bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/30 border-green-200/50 dark:border-green-800/50 shadow-lg ${className || ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Edit3 className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
              Manual Data Entry
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Add data entries manually for quick testing
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={addNewEntry} size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Entry
            </Button>
            <Button onClick={saveData} size="sm" variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300">
            <div>Date</div>
            <div>Revenue ($)</div>
            <div>Users</div>
            <div>Conversions</div>
            <div>Actions</div>
          </div>

          {/* Data Entries */}
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-5 gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={entry.revenue}
                    onChange={(e) => updateEntry(entry.id, 'revenue', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={entry.users}
                    onChange={(e) => updateEntry(entry.id, 'users', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1200"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={entry.conversions}
                    onChange={(e) => updateEntry(entry.id, 'conversions', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="54"
                  />
                </div>
                <div className="flex justify-center">
                  {entries.length > 1 && (
                    <Button
                      onClick={() => deleteEntry(entry.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Summary */}
          {entries.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
                <Edit3 className="h-4 w-4 mr-2" />
                Summary Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="text-green-700 dark:text-green-300 block text-xs font-medium">Total Revenue</span>
                  <div className="font-semibold text-green-900 dark:text-green-100 text-lg">
                    ${entries.reduce((sum, entry) => sum + entry.revenue, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="text-green-700 dark:text-green-300 block text-xs font-medium">Total Users</span>
                  <div className="font-semibold text-green-900 dark:text-green-100 text-lg">
                    {entries.reduce((sum, entry) => sum + entry.users, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="text-green-700 dark:text-green-300 block text-xs font-medium">Avg Conversion Rate</span>
                  <div className="font-semibold text-green-900 dark:text-green-100 text-lg">
                    {((entries.reduce((sum, entry) => sum + entry.conversions, 0) / 
                       entries.reduce((sum, entry) => sum + entry.users, 0)) * 100 || 0).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}