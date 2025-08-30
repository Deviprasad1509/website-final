'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalBooks: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      // Get total users count
      const { count: usersCount } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total orders count
      const { count: ordersCount } = await supabaseClient
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // Get total books count
      const { count: booksCount } = await supabaseClient
        .from('books')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        totalBooks: booksCount || 0,
      })
    }

    fetchStats()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalBooks}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a href="/admin/users" className="block p-3 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90">
              Manage Users
            </a>
            <a href="/admin/books" className="block p-3 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90">
              Manage Books
            </a>
            <a href="/admin/orders" className="block p-3 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90">
              Manage Orders
            </a>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

