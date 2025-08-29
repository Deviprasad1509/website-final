import { NextRequest, NextResponse } from 'next/server'
import { getBook, hasAccess, requireAuth } from '@/lib/server-functions'
import { createClient } from '@supabase/supabase-js'

// Admin client for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
})

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await requireAuth()
		const bookId = params.id

		// Check if user has access to this book
		const hasBookAccess = await hasAccess(user.id, bookId)
		if (!hasBookAccess) {
			return NextResponse.json(
				{ ok: false, error: 'Access denied. Purchase this book to download it.' },
				{ status: 403 }
			)
		}

		// Get book details
		const book = await getBook(bookId)
		if (!book) {
			return NextResponse.json(
				{ ok: false, error: 'Book not found' },
				{ status: 404 }
			)
		}

		if (!book.file_url) {
			return NextResponse.json(
				{ ok: false, error: 'Book file not available' },
				{ status: 404 }
			)
		}

		// Generate signed URL for download
		const { data: signedUrl, error } = await supabaseAdmin.storage
			.from('books')
			.createSignedUrl(book.file_url, 60) // 60 seconds expiry

		if (error || !signedUrl?.signedUrl) {
			console.error('Error generating signed URL:', error)
			return NextResponse.json(
				{ ok: false, error: 'Failed to generate download link' },
				{ status: 500 }
			)
		}

		// Extract filename from file_url
		const filename = book.file_url.split('/').pop() || `${book.title}.pdf`

		return NextResponse.json({
			ok: true,
			downloadUrl: signedUrl.signedUrl,
			filename: filename,
			bookTitle: book.title
		})
	} catch (err: any) {
		console.error('Download error:', err)
		return NextResponse.json(
			{ ok: false, error: err.message || 'Download failed' },
			{ status: 500 }
		)
	}
}
