'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Wifi, WifiOff, Bell, BellOff } from 'lucide-react'
import { 
  registerServiceWorker, 
  requestNotificationPermission,
  subscribeToPushNotifications,
  isAppInstalled,
  handleInstallPrompt,
  useOnlineStatus,
  sendNotification
} from '@/lib/pwa'
import { motion, AnimatePresence } from 'framer-motion'

// Types for PWA
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAManagerProps {
  onNotificationToggle?: (enabled: boolean) => void
}

export function PWAManager({ onNotificationToggle }: PWAManagerProps) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false)
  const isOnline = useOnlineStatus()

  useEffect(() => {
    // Check if app is already installed
    setIsInstalled(isAppInstalled())

    // Register service worker
    registerServiceWorker().then((registered) => {
      setServiceWorkerRegistered(registered)
      if (registered) {
        console.log('Service Worker registered successfully')
      }
    })

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallApp = () => {
    if (deferredPrompt) {
      handleInstallPrompt(deferredPrompt)
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleNotificationPermission = async () => {
    const permission = await requestNotificationPermission()
    setNotificationPermission(permission)
    onNotificationToggle?.(permission === 'granted')

    if (permission === 'granted') {
      // Subscribe to push notifications
      if (serviceWorkerRegistered) {
        const registration = await navigator.serviceWorker.ready
        const subscription = await subscribeToPushNotifications(registration)
        if (subscription) {
          sendNotification('Notifications Enabled!', {
            body: 'You will now receive dashboard updates and alerts.',
            icon: '/icon-192x192.png'
          })
        }
      }
    }
  }

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      sendNotification('Test Notification', {
        body: 'Your dashboard notifications are working perfectly!',
        icon: '/icon-192x192.png'
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Online/Offline Status */}
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Wifi className="h-4 w-4 mr-1" />
            <span className="text-sm">Online</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <WifiOff className="h-4 w-4 mr-1" />
            <span className="text-sm">Offline</span>
          </div>
        )}
      </div>

      {/* Install App Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Install InsightFlow</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Add to your home screen for quick access and offline use
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInstallPrompt(false)}
                    className="border-blue-300 dark:border-blue-600"
                  >
                    Later
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleInstallApp}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Install
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get notified about dashboard updates and alerts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {notificationPermission === 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={testNotification}
                className="mr-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Test
              </Button>
            )}
            <Button
              variant={notificationPermission === 'granted' ? 'default' : 'outline'}
              size="sm"
              onClick={handleNotificationPermission}
              disabled={notificationPermission === 'denied'}
              className={`transition-all duration-200 ${
                notificationPermission === 'granted' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg border-0' 
                  : notificationPermission === 'denied'
                  ? 'border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 cursor-not-allowed'
                  : 'border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              {notificationPermission === 'granted' ? (
                <>
                  <Bell className="h-4 w-4 mr-1" />
                  Enabled
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 mr-1" />
                  {notificationPermission === 'denied' ? 'Blocked' : 'Enable'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* PWA Status */}
      {serviceWorkerRegistered && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Service Worker: Active
          {isInstalled && (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-4 mr-2"></div>
              App: Installed
            </>
          )}
        </div>
      )}
    </div>
  )
}
