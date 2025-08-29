'use client'

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

interface BookFiltersProps {
  onFilterChange: (filters: {
    priceRange: { min: number; max: number }
    categories: string[]
    formats: string[]
    inStock: boolean
  }) => void
  categories: string[]
  formats: string[]
}

export function BookFilters({ onFilterChange, categories, formats }: BookFiltersProps) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [inStock, setInStock] = useState(false)

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const newRange = { ...priceRange, [field]: numValue }
      setPriceRange(newRange)
      updateFilters(newRange, selectedCategories, selectedFormats, inStock)
    }
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    updateFilters(priceRange, newCategories, selectedFormats, inStock)
  }

  const handleFormatChange = (format: string) => {
    const newFormats = selectedFormats.includes(format)
      ? selectedFormats.filter(f => f !== format)
      : [...selectedFormats, format]
    setSelectedFormats(newFormats)
    updateFilters(priceRange, selectedCategories, newFormats, inStock)
  }

  const handleInStockChange = (checked: boolean) => {
    setInStock(checked)
    updateFilters(priceRange, selectedCategories, selectedFormats, checked)
  }

  const updateFilters = (
    prices: typeof priceRange,
    cats: string[],
    fmts: string[],
    stock: boolean
  ) => {
    onFilterChange({
      priceRange: prices,
      categories: cats,
      formats: fmts,
      inStock: stock,
    })
  }

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 100 })
    setSelectedCategories([])
    setSelectedFormats([])
    setInStock(false)
    onFilterChange({
      priceRange: { min: 0, max: 100 },
      categories: [],
      formats: [],
      inStock: false,
    })
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Range</h4>
          <div className="flex gap-4">
            <div>
              <Label htmlFor="min-price">Min</Label>
              <Input
                id="min-price"
                type="number"
                min="0"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-24"
              />
            </div>
            <div>
              <Label htmlFor="max-price">Max</Label>
              <Input
                id="max-price"
                type="number"
                min="0"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-medium">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Formats */}
        <div className="space-y-3">
          <h4 className="font-medium">Formats</h4>
          <div className="space-y-2">
            {formats.map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox
                  id={`format-${format}`}
                  checked={selectedFormats.includes(format)}
                  onCheckedChange={() => handleFormatChange(format)}
                />
                <Label htmlFor={`format-${format}`}>{format}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStock}
            onCheckedChange={(checked) => handleInStockChange(checked as boolean)}
          />
          <Label htmlFor="in-stock">In Stock Only</Label>
        </div>

        {/* Clear Filters */}
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
