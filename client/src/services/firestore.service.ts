import { db } from '@/lib/firebase/client'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit as qLimit,
  serverTimestamp,
} from 'firebase/firestore'

export async function listFeaturedBooks(limit = 6) {
  const q = query(
    collection(db, 'books'),
    where('isFeatured', '==', true),
    orderBy('createdAt', 'desc'),
    qLimit(limit)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getBookById(bookId: string) {
  const ref = doc(db, 'books', bookId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function upsertBook(bookId: string | null, data: Record<string, any>) {
  if (bookId) {
    await setDoc(doc(db, 'books', bookId), { ...data, updatedAt: serverTimestamp() }, { merge: true })
    return bookId
  }
  const res = await addDoc(collection(db, 'books'), { ...data, createdAt: serverTimestamp() })
  return res.id
}

export async function createPayment(rec: { userId: string; bookId: string; amount: number; status: string }) {
  await addDoc(collection(db, 'payments'), { ...rec, createdAt: serverTimestamp() })
}



