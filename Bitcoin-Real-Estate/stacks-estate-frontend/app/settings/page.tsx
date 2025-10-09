"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Settings, Bell, Shield, Palette, Globe, Database, Save, AlertTriangle } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

export default function SettingsPage() {
  const { isConnected } = useWallet()
  const [settings, setSettings] = useState({
    general: {
      language: "en",
      timezone: "UTC-5",
      currency: "USD",
      theme: "dark",
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      security: true,
      transactions: true,
    },
    privacy: {
      profileVisibility: "public",
      showInvestments: false,
      dataSharing: false,
      analytics: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      loginAlerts: true,
    },
  })

  const handleSave = () => {
    // In real app, save to backend
    console.log("Settings saved:", settings)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-4">Please connect your wallet to access settings</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-balance">Settings</h1>
                  <p className="text-muted-foreground">Manage your application preferences and account settings</p>
                </div>
              </div>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-card">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure your basic application preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.general.language}
                        onValueChange={(value) =>
                          setSettings({ ...settings, general: { ...settings.general, language: value } })
                        }
                      >
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.general.timezone}
                        onValueChange={(value) =>
                          setSettings({ ...settings, general: { ...settings.general, timezone: value } })
                        }
                      >
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select
                        value={settings.general.currency}
                        onValueChange={(value) =>
                          setSettings({ ...settings, general: { ...settings.general, currency: value } })
                        }
                      >
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="BTC">BTC (₿)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <Select
                        value={settings.security.sessionTimeout}
                        onValueChange={(value) =>
                          setSettings({ ...settings, security: { ...settings.security, sessionTimeout: value } })
                        }
                      >
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose how you want to be notified about important events
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, email: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, push: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, sms: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify about investment transactions</p>
                      </div>
                      <Switch
                        checked={settings.notifications.transactions}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, transactions: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important security notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.security}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, security: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                      </div>
                      <Switch
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, marketing: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Control your data privacy and visibility preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Who can see your profile information</p>
                      </div>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) =>
                          setSettings({ ...settings, privacy: { ...settings.privacy, profileVisibility: value } })
                        }
                      >
                        <SelectTrigger className="w-32 glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Investment Portfolio</Label>
                        <p className="text-sm text-muted-foreground">Display your investments publicly</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showInvestments}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showInvestments: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share anonymized data for platform improvement</p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, dataSharing: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">Help improve the platform with usage analytics</p>
                      </div>
                      <Switch
                        checked={settings.privacy.analytics}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, analytics: checked },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Database className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="font-medium">Data Export</div>
                      <div className="text-sm text-muted-foreground mt-1 mb-3">
                        You can request a copy of all your data at any time.
                      </div>
                      <Button variant="outline" size="sm">
                        Request Data Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Customize the look and feel of your dashboard</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={settings.general.theme === "light" ? "default" : "outline"}
                          onClick={() => setSettings({ ...settings, general: { ...settings.general, theme: "light" } })}
                          className="h-20 flex-col gap-2"
                        >
                          <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                          Light
                        </Button>
                        <Button
                          variant={settings.general.theme === "dark" ? "default" : "outline"}
                          onClick={() => setSettings({ ...settings, general: { ...settings.general, theme: "dark" } })}
                          className="h-20 flex-col gap-2"
                        >
                          <div className="w-6 h-6 bg-gray-900 border-2 border-gray-600 rounded"></div>
                          Dark
                        </Button>
                        <Button
                          variant={settings.general.theme === "system" ? "default" : "outline"}
                          onClick={() =>
                            setSettings({ ...settings, general: { ...settings.general, theme: "system" } })
                          }
                          className="h-20 flex-col gap-2"
                        >
                          <div className="w-6 h-6 bg-gradient-to-r from-white to-gray-900 border-2 border-gray-400 rounded"></div>
                          System
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Dashboard Layout</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred dashboard layout</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent">
                          <div className="w-8 h-2 bg-primary rounded"></div>
                          <div className="flex gap-1">
                            <div className="w-3 h-2 bg-muted rounded"></div>
                            <div className="w-3 h-2 bg-muted rounded"></div>
                          </div>
                          Compact
                        </Button>
                        <Button variant="default" className="h-16 flex-col gap-1">
                          <div className="w-8 h-3 bg-primary-foreground rounded"></div>
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-primary-foreground/70 rounded"></div>
                            <div className="w-3 h-3 bg-primary-foreground/70 rounded"></div>
                          </div>
                          Comfortable
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="font-medium">Theme Changes</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Theme changes will be applied immediately and saved to your browser preferences.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
