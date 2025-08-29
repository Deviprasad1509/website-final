'use client'

import { AdminNav } from './admin-nav'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-[250px,1fr]">
      <AdminNav />
      <main className="p-8">{children}</main>
    </div>
  )
}
