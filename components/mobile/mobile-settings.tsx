"use client"

import { useState } from "react"
import { User, Bell, Moon, Sun, Smartphone, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function MobileSettings() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [biometricAuth, setBiometricAuth] = useState(true)

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">Account</h2>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Dr. Sarah Connor</div>
                <div className="text-sm text-muted-foreground">Care Professional</div>
              </div>
            </div>

            <Separator />

            <Button variant="ghost" className="w-full justify-between p-4 h-auto rounded-none">
              <span>Profile Settings</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Separator />

            <Button variant="ghost" className="w-full justify-between p-4 h-auto rounded-none">
              <span>Change Password</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">Preferences</h2>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  {darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                </div>
                <span>Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <span>Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <span>Biometric Authentication</span>
              </div>
              <Switch checked={biometricAuth} onCheckedChange={setBiometricAuth} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">Support</h2>

        <Card>
          <CardContent className="p-0">
            <Button variant="ghost" className="w-full justify-between p-4 h-auto rounded-none">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <span>Help & Support</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Separator />

            <Button variant="ghost" className="w-full justify-between p-4 h-auto rounded-none">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>Privacy & Security</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button variant="destructive" className="w-full mt-6">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
