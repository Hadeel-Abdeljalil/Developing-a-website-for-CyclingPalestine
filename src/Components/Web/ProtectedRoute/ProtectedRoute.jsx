import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({children,auth}) {
  
    if(localStorage.getItem('userToken')==null){
       return <Navigate to='/login'/> 
    } 
  return children
  
}
