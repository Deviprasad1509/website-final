import { Book } from '@/types/db'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

interface BookGridProps {
  books: Book[]
}

function BookGrid({ books }: BookGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || ''

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    router.push(`/books?${params.toString()}`)
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No books found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Latest Arrivals</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="title-asc">Title: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link href={`/book/${book.id}`} key={book.id}>
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
              <div className="aspect-[2/3] relative">
                <Image
                  src={book.cover_url || '/placeholder.jpg'}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground">By {book.authors?.name || 'Unknown Author'}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-medium">${book.price.toFixed(2)}</span>
                  <Button variant="secondary" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BookGrid

