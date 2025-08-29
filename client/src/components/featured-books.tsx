"use client"

import { useState, useEffect } from "react"
import { BookCard } from "@/components/book-card"
import { listFeaturedBooks } from "@/lib/firestore.service"
import { Loader2 } from "lucide-react"

export function FeaturedBooks() {
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const data = await listFeaturedBooks(6)
        const transformed = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          price: Number(book.price || 0),
          rating: 4.5,
          reviews: 100,
          cover: book.cover || '/placeholder-book-cover.png',
          description: book.description || ''
        }))
        setFeaturedBooks(transformed)
      } catch (err) {
        console.error('Error loading featured books:', err)
        setError('Failed to load featured books')
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedBooks()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading featured books...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Books</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of bestsellers and must-read titles
          </p>
        </div>

        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No featured books available at the moment.
          </div>
        )}
      </div>
    </section>
  )
}
