import AdminHeader from '@/components/Admin-View/Header'
import AdminSideBar from '@/components/Admin-View/SideBar'
import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader />

      <AdminSideBar />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
