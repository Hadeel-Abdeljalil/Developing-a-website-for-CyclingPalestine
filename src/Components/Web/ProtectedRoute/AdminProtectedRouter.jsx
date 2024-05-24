import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../Context/FeatureUser.jsx'
import { Navigate } from 'react-router-dom';

export default function AdminProtectedRouter({children,auth}) {
    const {userData} = useContext(UserContext);
    const  role=userData?.role

    if(role === "User"){
        return <Navigate to='/'/> 
    }
  return children
}
