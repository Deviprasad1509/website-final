'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, Image as ImageIcon, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface BookFormProps {
  bookId?: string // Optional for edit mode
}

interface BookFormData {
  title: string
  author: string
  description: string
  price: number
  stock: number
  cover_image?: string
  file_url?: string
  isbn: string
  category_id: string
}

export function BookForm({ bookId }: BookFormProps) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    price: 0,
    stock: 0,
    cover_image: '',
    file_url: '',
    isbn: '',
    category_id: ''
  })

  useEffect(() => {
    fetchCategories()
    if (bookId) {
      fetchBookDetails()
    }
  }, [bookId])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBookDetails = async () => {
    if (!bookId) return

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()

      if (error) throw error
      if (data) {
        setFormData(data)
        if (data.cover_image) {
          setCoverImagePreview(data.cover_image)
        }
      }
    } catch (error) {
      console.error('Error fetching book details:', error)
    }
  }

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  }

  const handleCoverImageUpload = async (file: File) => {
    if (!file) return

    setUploadingCover(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `covers/${fileName}`

      const publicUrl = await uploadFile(file, 'covers', filePath)

      setFormData(prev => ({ ...prev, cover_image: publicUrl }))
      setCoverImagePreview(publicUrl)
      toast.success('Cover image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading cover image:', error)
      toast.error('Failed to upload cover image')
    } finally {
      setUploadingCover(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    if (!file) return

    setUploadingPdf(true)
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.pdf`
      const filePath = `books/${fileName}`

      const publicUrl = await uploadFile(file, 'books', filePath)

      setFormData(prev => ({ ...prev, file_url: publicUrl }))
      toast.success('PDF uploaded successfully!')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      toast.error('Failed to upload PDF')
    } finally {
      setUploadingPdf(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'cover') {
      setCoverImageFile(file)
      handleCoverImageUpload(file)
    } else {
      setPdfFile(file)
      handlePdfUpload(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/books', {
        method: bookId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save book')
      }

      const result = await response.json()
      toast.success(bookId ? 'Book updated successfully!' : 'Book added successfully!')

      router.push('/admin/books')
    } catch (error) {
      console.error('Error saving book:', error)
      toast.error('Failed to save book. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {bookId ? 'Edit Book' : 'Add New Book'}
          </CardTitle>
          <p className="text-muted-foreground">
            Fill in the information below to {bookId ? 'update' : 'add'} a book to your store.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows={4}
              />
            </div>

            {/* Pricing and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Cover Image Upload */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Cover Image</Label>

                {coverImagePreview && (
                  <div className="relative">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white border-red-500"
                      onClick={() => {
                        setCoverImagePreview('')
                        setFormData(prev => ({ ...prev, cover_image: '' }))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload cover image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </Label>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cover')}
                        className="hidden"
                        disabled={uploadingCover}
                      />
                    </div>
                    {uploadingCover && (
                      <div className="mt-4 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF Upload */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Book PDF</Label>

                {formData.file_url && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">PDF uploaded successfully</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, file_url: '' }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload PDF file
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PDF files up to 50MB
                        </span>
                      </Label>
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'pdf')}
                        className="hidden"
                        disabled={uploadingPdf}
                      />
                    </div>
                    {uploadingPdf && (
                      <div className="mt-4 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingCover || uploadingPdf}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  bookId ? 'Update Book' : 'Add Book'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

