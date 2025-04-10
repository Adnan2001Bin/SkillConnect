import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Outlet />
    </div>
  )
}

export default AuthLayout