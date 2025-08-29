'use client'

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface Book {
  id: string
  title: string
  author: string
  cover_image: string
  price: number
  category: string
}

interface BookGridProps {
  books: Book[]
}

export function BookGrid({ books }: BookGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(books.map(book => book.category)))

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <div className="aspect-[2/3] relative">
              <img
                src={book.cover_image}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{book.title}</h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-medium">${book.price.toFixed(2)}</span>
                <Button variant="outline" size="sm">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-500 py-8">No books found</p>
      )}
    </div>
  )
}
