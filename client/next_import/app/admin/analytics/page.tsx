"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from "lucide-react"

export default function AdminAnalyticsPage() {
  // Mock analytics data - in real app this would come from Supabase
  const analyticsData = {
    revenue: {
      current: 15420.50,
      previous: 12850.75,
      change: 19.9,
      trend: "up"
    },
    orders: {
      current: 1247,
      previous: 1089,
      change: 14.5,
      trend: "up"
    },
    users: {
      current: 892,
      previous: 756,
      change: 18.0,
      trend: "up"
    },
    books: {
      current: 156,
      previous: 142,
      change: 9.9,
      trend: "up"
    },
    topCategories: [
      { name: "Fiction", sales: 45, revenue: 2340.50 },
      { name: "Non-Fiction", sales: 38, revenue: 1890.25 },
      { name: "Self-Help", sales: 32, revenue: 1560.75 },
      { name: "Science Fiction", sales: 28, revenue: 1420.00 },
      { name: "Romance", sales: 25, revenue: 1280.50 }
    ],
    monthlyRevenue: [
      { month: "Jan", revenue: 12450.75 },
      { month: "Feb", revenue: 11890.50 },
      { month: "Mar", revenue: 13240.25 },
      { month: "Apr", revenue: 12850.75 },
      { month: "May", revenue: 14120.00 },
      { month: "Jun", revenue: 15420.50 }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Business insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.current)}</div>
              <div className={`flex items-center text-xs ${getTrendColor(analyticsData.revenue.trend)}`}>
                {getTrendIcon(analyticsData.revenue.trend)}
                <span className="ml-1">+{analyticsData.revenue.change}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.orders.current}</div>
              <div className={`flex items-center text-xs ${getTrendColor(analyticsData.orders.trend)}`}>
                {getTrendIcon(analyticsData.orders.trend)}
                <span className="ml-1">+{analyticsData.orders.change}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.users.current}</div>
              <div className={`flex items-center text-xs ${getTrendColor(analyticsData.users.trend)}`}>
                {getTrendIcon(analyticsData.users.trend)}
                <span className="ml-1">+{analyticsData.users.change}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.books.current}</div>
              <div className={`flex items-center text-xs ${getTrendColor(analyticsData.books.trend)}`}>
                {getTrendIcon(analyticsData.books.trend)}
                <span className="ml-1">+{analyticsData.books.change}% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Top Categories by Sales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{category.sales} sales</div>
                    <div className="text-sm text-gray-500">{formatCurrency(category.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.monthlyRevenue.map((month, index) => {
                const maxRevenue = Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue))
                const height = (month.revenue / maxRevenue) * 100
                
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                    <div className="text-xs font-medium">{formatCurrency(month.revenue)}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Revenue Growth</p>
                  <p className="text-sm text-gray-600">
                    Revenue increased by 19.9% compared to last month, driven by strong sales in Fiction and Non-Fiction categories.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">User Acquisition</p>
                  <p className="text-sm text-gray-600">
                    New user registrations are up 18% with improved onboarding and marketing campaigns.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Category Performance</p>
                  <p className="text-sm text-gray-600">
                    Self-Help and Science Fiction categories showing strong growth potential for expansion.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
