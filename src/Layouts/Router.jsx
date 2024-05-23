import React, { useContext, useEffect } from 'react';
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
import { UserContext } from '../Components/Web/Context/FeatureUser.jsx';

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
      <ProtectedRoute auth='admin'>
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
// Define a function to check the user's role and redirect accordingly
function CheckUserRole() {
  const { userToken, userData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has data
    if (userToken && userData) {
      // Check user's role
      if (userData.role === 'Admin') {
        navigate('/dashboard/home');
      } else {
        navigate('/dashboard/home');
      }
    }
  }, [userToken, userData, navigate]);

  return null;
}


// Wrap the router component with the CheckUserRole component
export const RoutedApp = () => (
  <>
    <router />
    <CheckUserRole />
  </>
);
