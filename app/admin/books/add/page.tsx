'use client'

import { BookForm } from '@/components/admin/book-form'

export default function AddBookPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload a new book with cover image and PDF file for users to purchase and download.
          </p>
        </div>
        <BookForm />
      </div>
    </div>
  )
}

