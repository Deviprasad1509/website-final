'use client'

import { BookForm } from '@/components/admin/book-form'

export default function EditBookPage({ params }: { params: { id: string } }) {
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Edit Book
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <BookForm bookId={params.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
