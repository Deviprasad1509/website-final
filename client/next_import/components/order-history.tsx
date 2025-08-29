"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Eye, Download, Calendar, DollarSign } from "lucide-react"
import { useAuth } from "../lib/auth-context"

interface OrderItem {
  id: string
  book_id: string
  qty: number
  unit_price: number
  books: {
    title: string
    cover_url?: string
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

export function OrderHistory() {
  const { state } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // TODO: Replace with actual API call to Supabase
        // GET /api/orders
        const mockOrders: Order[] = [
          {
            id: "ORD-001",
            user_id: state.user?.id || "",
            status: "completed",
            subtotal: 24.99,
            total: 24.99,
            currency: "USD",
            created_at: "2024-01-15T10:30:00Z",
            items: [
              {
                id: "1",
                book_id: "book-1",
                qty: 1,
                unit_price: 24.99,
                books: {
                  title: "The Great Gatsby",
                  cover_url: "/placeholder.svg"
                }
              }
            ]
          },
          {
            id: "ORD-002",
            user_id: state.user?.id || "",
            status: "pending",
            subtotal: 43.98,
            total: 43.98,
            currency: "USD",
            created_at: "2024-01-14T15:45:00Z",
            items: [
              {
                id: "2",
                book_id: "book-2",
                qty: 1,
                unit_price: 19.99,
                books: {
                  title: "To Kill a Mockingbird",
                  cover_url: "/placeholder.svg"
                }
              },
              {
                id: "3",
                book_id: "book-3",
                qty: 1,
                unit_price: 23.99,
                books: {
                  title: "1984",
                  cover_url: "/placeholder.svg"
                }
              }
            ]
          }
        ]
        
        setOrders(mockOrders)
      } catch (err) {
        console.error('Error loading orders:', err)
      } finally {
        setLoading(false)
      }
    }

    if (state.user) {
      loadOrders()
    }
  }, [state.user])

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!state.user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to view your orders.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-2">Track your purchases and order status</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No orders found.</p>
            <p className="text-gray-500 mt-2">Start shopping to see your order history here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order {order.id}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(order.status) as any}>
                      {order.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedOrder?.id === order.id ? 'Hide' : 'View'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {selectedOrder?.id === order.id && (
                <CardContent>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
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
                              <p className="font-medium">{item.books.title}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.qty} × {formatCurrency(item.unit_price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(item.unit_price * item.qty)}</p>
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
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
