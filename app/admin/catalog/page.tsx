"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, FolderOpen, Plus } from "lucide-react"
import Link from "next/link"

export default function AdminCatalogPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalog Management</h1>
            <p className="text-gray-600 mt-2">Manage books, authors, and categories</p>
          </div>
        </div>

        <Tabs defaultValue="books" className="space-y-6">
          <TabsList>
            <TabsTrigger value="books" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Books</span>
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Authors</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Books</CardTitle>
                <Link href="/admin/products">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Manage Books</span>
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage your book catalog including titles, descriptions, pricing, and file uploads.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authors" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Authors</CardTitle>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Author</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage author information and biographies.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize books into categories and genres.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

