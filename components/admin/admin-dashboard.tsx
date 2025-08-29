'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BookPlus, Library, Users, ShoppingBag, Settings, BarChart2 } from 'lucide-react'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const supabase = createClientComponentClient()

  const stats = [
    { id: 1, name: 'Total Books', value: '324', icon: Library },
    { id: 2, name: 'Active Users', value: '156', icon: Users },
    { id: 3, name: 'Total Orders', value: '89', icon: ShoppingBag },
    { id: 4, name: 'Revenue', value: '$12,345', icon: BarChart2 },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                onClick={() => window.location.href = '/admin/books/add'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                <BookPlus className="h-5 w-5 mr-2" />
                Add New Book
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/admin/orders'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                View Orders
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/admin/settings'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

