import React from 'react'

import { Outlet } from 'react-router-dom'
import Navbar from './../Components/Dashboard/Navbar/Navbar';
import Footer from '../Components/Dashboard/Footer/Footer.jsx';

export default function DashboardLayout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}
