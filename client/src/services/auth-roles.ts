import { auth } from '@/lib/firebase/client'
import { db } from '@/lib/firebase/client'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export type AppRole = 'admin' | 'user'

export async function ensureUserDoc(): Promise<{ role: AppRole }> {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || '',
      role: 'user',
      createdAt: serverTimestamp(),
    })
    return { role: 'user' }
  }
  const data = snap.data() as { role?: AppRole }
  return { role: (data.role || 'user') as AppRole }
}



