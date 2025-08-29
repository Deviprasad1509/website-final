'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface OrderItem {
  id: string
  book_id: string
  quantity: number
  price: number
  book: {
    title: string
    author: string
    cover_image: string
  }
}

interface OrderDetails {
  id: string
  created_at: string
  total: number
  status: string
  items: OrderItem[]
}

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items (
              *,
              book:books (
                title,
                author,
                cover_image
              )
            )
          `)
          .eq('id', orderId)
          .single()

        if (error) throw error

        if (orderData) {
          setOrder(orderData as OrderDetails)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm font-medium capitalize">{order.status}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  {item.book.cover_image && (
                    <img
                      src={item.book.cover_image}
                      alt={item.book.title}
                      className="w-16 h-24 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.book.title}</h4>
                    <p className="text-sm text-gray-500">{item.book.author}</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

