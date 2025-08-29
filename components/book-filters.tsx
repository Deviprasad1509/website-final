'use client'

import { Category } from '@/types/db'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCallback } from 'react'

interface BookFiltersProps {
  categories: Category[]
}

export default function BookFilters({ categories }: BookFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get('category')
  const searchTerm = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || ''

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }, [searchParams])

  const handleSearch = (term: string) => {
    router.push(`/books?${createQueryString('q', term)}`)
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/books?${createQueryString('category', 
      categoryId === currentCategory ? '' : categoryId
    )}`)
  }

  const handleSortChange = (value: string) => {
    router.push(`/books?${createQueryString('sort', value)}`)
  }

  const clearFilters = () => {
    router.push('/books')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your book search
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sort by</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={sort === 'price-asc' ? 'secondary' : 'outline'}
                    onClick={() => handleSortChange('price-asc')}
                  >
                    Price: Low to High
                  </Button>
                  <Button
                    variant={sort === 'price-desc' ? 'secondary' : 'outline'}
                    onClick={() => handleSortChange('price-desc')}
                  >
                    Price: High to Low
                  </Button>
                  <Button
                    variant={sort === 'title-asc' ? 'secondary' : 'outline'}
                    onClick={() => handleSortChange('title-asc')}
                  >
                    Title: A to Z
                  </Button>
                  <Button
                    variant={sort === 'latest' ? 'secondary' : 'outline'}
                    onClick={() => handleSortChange('latest')}
                  >
                    Latest Arrivals
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={currentCategory === category.id ? 'secondary' : 'outline'}
                      onClick={() => handleCategoryClick(category.id || '')}
                      className="justify-start"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={clearFilters}
                variant="ghost" 
                className="w-full mt-4"
              >
                Clear all filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

