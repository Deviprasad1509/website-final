"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Download, Calendar, DollarSign, Package, User } from "lucide-react"

interface OrderItem {
  id: string
  book_id: string
  qty: number
  unit_price: number
  books: {
    title: string
    cover_url?: string
    description?: string
  }
}

interface Order {
  id: string
  user_id: string
  status: "pending" | "completed" | "cancelled"
  subtotal: number
  total: number
  currency: string
  created_at: string
  items: OrderItem[]
}

interface OrderDetailProps {
  order: Order | null
}

export function OrderDetail({ order }: OrderDetailProps) {
  if (!order) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Select an order to view details</p>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600 mt-2">Order {order.id}</p>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">{formatCurrency(order.total)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-medium">{order.items.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={getStatusVariant(order.status) as any}>
                  {order.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                    {item.books.cover_url ? (
                      <img
                        src={item.books.cover_url}
                        alt={item.books.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Cover</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{item.books.title}</h3>
                    {item.books.description && (
                      <p className="text-gray-600 text-sm mt-1">{item.books.description}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Quantity: {item.qty} × {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">{formatCurrency(item.unit_price * item.qty)}</p>
                  {order.status === "completed" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Order Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {order.status === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button variant="outline">Cancel Order</Button>
              <Button>Pay Now</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
