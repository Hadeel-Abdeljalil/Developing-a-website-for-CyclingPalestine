import React, { useEffect } from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import WebLayout from './WebLayout';
import DashboardLayout from './DashboardLayout';
import Home from '../Components/Web/Home/Home';
import HomeDash from '../Components/Dashboard/Home/Home';
import Register from '../Components/Web/Register/Register';
import Login from '../Components/Web/Login/Login';
import Cart from '../Components/Web/Cart/Cart';
import Categories from '../Components/Web/Categories/Categories.jsx';
import CategoriesDetails from '../Components/Web/Categories/CategoriesDetails';
import Products from '../Components/Web/Products/Products';
import ProtectedRoute from '../Components/Web/ProtectedRoute/ProtectedRoute';
import Profile from '../Components/Web/Profile/Profile';
import UserInfo from '../Components/Web/Profile/UserInfo';
import SendCode from '../Components/Web/Auth/SendCode';
import ForgotPassword from '../Components/Web/Auth/ForgotPassword';
import Order from '../Components/Web/Order/Order';
import UserOrders from '../Components/Web/Profile/UserOrders';
import AllProducts from './../Components/Web/AllProducts/AllProducts';
import Trips from '../Components/Web/Trips/Trips.jsx';
import TripDetails from '../Components/Web/Trips/TripDetails.jsx';
import PrevTrips from './../Components/Web/Trips/PrevTrips';
import NextTrips from './../Components/Web/Trips/NextTrips';

export const router = createBrowserRouter([
  {
    path: 'register',
    element: <Register />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'sendCode',
    element: <SendCode />
  },
  {
    path: 'forgotPassword',
    element: <ForgotPassword />
  },
  {
    path: 'profile',
    element: (
      <ProtectedRoute auth='user'>
        <Profile />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserInfo />
      },
      {
        path: 'orders',
        element: <UserOrders />
      }
    ]
  },
  {
    path: '/',
    element:(<ProtectedRoute auth='user'>
       <WebLayout />
    </ProtectedRoute>),
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'trips',
        element: <Trips />,
        children: [
          {
            index: true,
            element: <NextTrips />
          },
          {
            path: 'nextTrips',
            element: <NextTrips />
          },
          {
            path: 'prevTrips',
            element: <PrevTrips />
          },
        ]
      },
      {
        path: 'trip/:tripId',
        element: <TripDetails />
      },
      {
        path: 'tripView',
        element: <TripDetails />
      },
      {
        path: 'categories',
        element: <Categories />
      },
      {
        path: 'order',
        element: <Order />
      },
      {
        path: '*',
        element: <h2>Page not found --- web</h2>
      },
      {
        path: 'products',
        element: <AllProducts />
      },
      {
        path: 'products/category/:categoryId',
        element: <CategoriesDetails />
      },
      {
        path: 'products/:productId',
        element: <Products />
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute auth='user'>
            <Cart />
          </ProtectedRoute>
        )
      },
    ]
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute auth='Admin'>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'home',
        element: <HomeDash />
      },
    
      {
        path: '*',
        element: <h2>Page not found --- dashboard</h2>
      }
    ]
  }
]);

// Define a function to check the user's role and redirect accordingly
function CheckUserRole() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'Admin') {
      navigate('/dashboard/home');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return null;
}

// Wrap the router component with the CheckUserRole component
export const RoutedApp = () => (
  <>
    <router />
    <CheckUserRole />
  </>
);
