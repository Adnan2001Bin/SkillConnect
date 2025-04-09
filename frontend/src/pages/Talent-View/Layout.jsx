import TalentHeader from '@/components/Talent-View/Header'
import TalentSideBar from '@/components/Talent-View/SideBar'
import React from 'react'
import { Outlet } from 'react-router'

const TalentLayout = () => {
  return (
    <div>
      <TalentHeader />

      <TalentSideBar />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default TalentLayout
