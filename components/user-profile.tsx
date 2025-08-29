"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { useAuth } from "../lib/auth-context"
import { User, Settings, BookOpen, Download, ShoppingBag } from "lucide-react"

export function UserProfile() {
  const { state, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: state.user?.name || "",
    email: state.user?.email || ""
  })

  if (!state.user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        email: editForm.email
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: state.user?.name || "",
      email: state.user?.email || ""
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={state.user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">
            {state.user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {state.user.name}
          </h1>
          <p className="text-gray-600">{state.user.email}</p>
          <Badge variant={state.user.role === 'admin' ? 'default' : 'secondary'}>
            {state.user.role}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>My Library</span>
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Downloads</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Name</Label>
                    <p className="text-gray-900">{state.user.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-gray-900">{state.user.email}</p>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-gray-900">
                      {new Date(state.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View your complete order history and track your purchases.
              </p>
              <Link href="/orders">
                <Button className="mt-4">View All Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access all the books you've purchased and added to your library.
              </p>
              <Link href="/library">
                <Button className="mt-4">Go to Library</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track your book downloads and manage your offline reading.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Account Type</Label>
                <p className="text-gray-900 capitalize">{state.user.role}</p>
              </div>
              <div>
                <Label>Email Notifications</Label>
                <p className="text-gray-600">Manage your email preferences</p>
              </div>
              <div>
                <Label>Privacy Settings</Label>
                <p className="text-gray-600">Control your privacy and data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
