"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/dashboard/sidebar"
import {
  User,
  Wallet,
  Shield,
  Bell,
  Settings,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Copy,
  Camera,
  Upload,
  RefreshCw,
} from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { getSBTCBalance } from "@/lib/stacks-api"

export default function ProfilePage() {
  const { address, isConnected } = useWallet()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg")
  const [sbtcBalance, setSbtcBalance] = useState<string>("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState({
    displayName: "Anonymous",
    email: "john@example.com",
    bio: "Real estate investor focused on Bitcoin-backed properties",
    location: "Miami, FL",
    investmentPreference: "moderate",
    notifications: {
      email: true,
      push: true,
      rental: true,
      investment: true,
    },
  })

  const displayAddress = address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "Unknown"

  // Fetch sBTC balance when component mounts or address changes
  const fetchBalance = async () => {
    if (address) {
      setIsLoadingBalance(true)
      try {
        const response = await getSBTCBalance(address)
        console.log("sBTC balance response:", response)
        
        // Parse the Clarity value from the response
        // The response.result contains a hex-encoded Clarity value
        // For a uint, it starts with 0x01 followed by 16 bytes (128 bits)
        if (response?.result) {
          // Remove the 0x01 prefix (first 2 chars after 0x) and parse the remaining hex as a big integer
          const hexValue = response.result.replace('0x01', '')
          const balance = parseInt(hexValue, 16)
          setSbtcBalance(balance.toString())
          console.log("Parsed sBTC balance:", balance)
        } else {
          setSbtcBalance("0")
        }
      } catch (error) {
        console.error("Failed to fetch sBTC balance:", error)
        setSbtcBalance("0")
      } finally {
        setIsLoadingBalance(false)
      }
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [address])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSave = () => {
    setIsEditing(false)
    // In real app, save to backend
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "conservative":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-400">Conservative</Badge>
      case "moderate":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400">Moderate</Badge>
      case "aggressive":
        return <Badge className="bg-red-500/20 text-red-400 border-red-400">Aggressive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="text-center py-8">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-4">Please connect your wallet to access your profile</p>
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
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-balance">Profile Settings</h1>
                  <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
              </div>
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-card">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Update your personal details and profile information</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">
                          {profile.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{profile.displayName}</h3>
                      <p className="text-sm text-muted-foreground">{displayAddress}</p>
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile.displayName}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        disabled={!isEditing}
                        className="glass-card"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                        className="glass-card"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                      className="glass-card"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 glass-card rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Connected Wallet</CardTitle>
                  <p className="text-sm text-muted-foreground">Manage your connected Stacks wallet</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Primary Wallet</div>
                        <div className="text-sm text-muted-foreground font-mono">{displayAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(address || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Wallet Balances</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={fetchBalance}
                        disabled={isLoadingBalance}
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">sBTC Balance</div>
                        <div className="text-2xl font-bold text-primary">
                          {isLoadingBalance ? (
                            <span className="text-muted-foreground">Loading...</span>
                          ) : (
                            `₿ ${(parseInt(sbtcBalance) / 100000000).toFixed(8)}`
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Bitcoin-backed token</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">STX Balance</div>
                        <div className="text-2xl font-bold text-secondary">--</div>
                        <div className="text-xs text-muted-foreground mt-1">Stacks native token</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Investment Statistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-xl font-bold text-primary">₿ 12.5</div>
                        <div className="text-sm text-muted-foreground">Total Invested</div>
                      </div>
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-xl font-bold text-green-400">₿ 1.2</div>
                        <div className="text-sm text-muted-foreground">Earned</div>
                      </div>
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-xl font-bold text-blue-400">127</div>
                        <div className="text-sm text-muted-foreground">Transactions</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure your investment settings and risk tolerance</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Risk Tolerance</Label>
                      <p className="text-sm text-muted-foreground">Your preferred investment risk level</p>
                    </div>
                    {getRiskBadge(profile.investmentPreference)}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notification Preferences
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={profile.notifications.email}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, email: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Browser push notifications</p>
                        </div>
                        <Switch
                          checked={profile.notifications.push}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, push: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Rental Income Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify when rental income is available</p>
                        </div>
                        <Switch
                          checked={profile.notifications.rental}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, rental: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Investment Opportunities</Label>
                          <p className="text-sm text-muted-foreground">New property investment alerts</p>
                        </div>
                        <Switch
                          checked={profile.notifications.investment}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, investment: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Manage your account security and authentication</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-success-green/10 border border-success-green/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-success-green" />
                    <div>
                      <div className="font-medium text-white">Wallet Authentication</div>
                      <div className="text-sm text-muted-foreground">Your wallet is securely connected</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Security Features</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <div>
                          <div className="font-medium text-white">Two-Factor Authentication</div>
                          <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                        </div>
                        <Button variant="outline" className="border-gray-700 bg-transparent">
                          Enable 2FA
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <div>
                          <div className="font-medium text-white">Session Management</div>
                          <div className="text-sm text-muted-foreground">Manage active sessions</div>
                        </div>
                        <Button variant="outline" className="border-gray-700 bg-transparent">
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-warning-amber/10 border border-warning-amber/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-warning-amber mt-0.5" />
                    <div>
                      <div className="font-medium text-white">Security Notice</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Never share your wallet private keys or seed phrase. StacksEstate will never ask for this
                        information.
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
