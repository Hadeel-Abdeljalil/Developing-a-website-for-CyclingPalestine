import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './../Components/Dashboard/Navbar/Navbar';
import SideBar from '../Components/Dashboard/Home/SideBar/SideBar.jsx';
import CopyRights from '../Components/Web/Footer/CopyRights.jsx';

export default function DashboardLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex dir pt-4 ">
        <SideBar />
        <div className="mt-5 p-5">
          <Outlet />
        </div>
      </div>
      <CopyRights/>
    </>
  )
}
