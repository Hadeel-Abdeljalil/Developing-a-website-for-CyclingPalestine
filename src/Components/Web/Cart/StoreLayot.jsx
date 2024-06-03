import React from 'react'
import { Outlet } from 'react-router-dom'
import StoreNav from './StoreNav.jsx'
import Footer from './../Footer/Footer';
import CopyRights from './../Footer/CopyRights';
export default function StoreLayout() {
  return (
    <div className='store bg-white'>
      <div className='fixed-top'>
        <StoreNav />
      </div>
      <div className=''>
        <Outlet />
      </div>
      <Footer />
      <CopyRights />
    </div>
  )
}
