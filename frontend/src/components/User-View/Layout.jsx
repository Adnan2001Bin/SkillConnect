import React from 'react'
import UserHeader from './Header'
import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div>
      <UserHeader />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
