"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import AdminDashboard from "@/components/admin-dashboard"

export default function AdminProductsPage() {
  // Mock userId - in real app this would come from auth context
  const userId = "admin-user-id"
  
  return (
    <AdminLayout>
      <AdminDashboard userId={userId} />
    </AdminLayout>
  )
}
