'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

function CheckoutForm({ total, items }: { total: number; items: any[] }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Handle payment and order creation
      // Redirect to success page after successful payment
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Payment Details</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <Input
              type="text"
              placeholder="4242 4242 4242 4242"
              required
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <Input
                type="text"
                placeholder="MM/YY"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVC</label>
              <Input
                type="text"
                placeholder="123"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name on Card</label>
            <Input
              type="text"
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CheckoutForm

