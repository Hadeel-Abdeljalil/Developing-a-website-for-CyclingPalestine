import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../Components/Dashboard/Home/SideBar/SideBar.jsx';
import CopyRights from '../Components/Web/Footer/CopyRights.jsx';
import Navbar from './../Components/Web/Navbar/Navbar';

export default function DashboardLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex dir pt-4 ">
        <SideBar />
        <div className="mt-5 p-5 w-100">
          <Outlet />
        </div>
      </div>
      <CopyRights/>
    </>
  )
}
