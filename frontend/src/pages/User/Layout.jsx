import UserHeader from '@/components/User-View/Header'
import React from 'react'
import { Outlet } from 'react-router'

const UserLayout = () => {
  return (
    <div>
      <UserHeader />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout
