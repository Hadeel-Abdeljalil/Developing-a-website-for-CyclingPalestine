import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import WebLayout from './WebLayout';
import Home from '../Components/Web/Home/Home';
import Categories from '../Components/Web/Categories/Categories.jsx';
import HomeDash from '../Components/Dashboard/Home/Home';
import Register from '../Components/Web/Register/Register';
import Login from '../Components/Web/Login/Login';
import DashboardLayout from './DashboardLayout';
import Cart from '../Components/Web/Cart/Cart';
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
import Users from '../Components/Dashboard/Home/Users/Users.jsx';
import TripsA from './../Components/Dashboard/Home/Trips/Trips';
import CategoriesA from './../Components/Dashboard/Home/Categories/Categories';
import Orders from './../Components/Dashboard/Home/Orders/Orders';
import ProductsA from './../Components/Dashboard/Home/Products/Products';
import ProfileHome from '../Components/Web/Profile/ProfileHome.jsx';
import AdminProtectedRouter from '../Components/Web/ProtectedRoute/AdminProtectedRouter.jsx';

export const router = createBrowserRouter([


  {
    path: 'register',
    element: <Register />
  },
  {
    path: 'login',
    element:
      //<ProtectedRoute auth='signin'>
      <Login />
    //</ProtectedRoute>
  },
  {
    path: 'sendCode',
    element: <SendCode />
  },
  {
    path: 'forgotPassword',
    element: <ForgotPassword />
  }, {
    path: 'profile',
    element:
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>,
    children: [
      {
        index:true,
        element:<ProfileHome/>
      },
      {
        path: 'userInfo',
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
    element: <WebLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'trips/',
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
        path: '/trip/:tripId',
        element: <TripDetails />,
      },
      {
        path: 'tripView',
        element: <TripDetails />,
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
        element: <h2>page not found --- web</h2>
      },
      {
        path: 'products/',
        element: <AllProducts />,
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
        path: '/cart',
        element:
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
      },
    ]
  },

  {
    path: '/dashboard',
    element: <AdminProtectedRouter>
      <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
    </AdminProtectedRouter>,
    children: [
      {
        path: 'home',
        element: <HomeDash />
      },
      {
        path:'users',
        element:<Users/>
      },
      {
        path:'trips',
        element:<TripsA/>
      },
      {
        path:'categories',
        element:<CategoriesA/>
      },
      {
        path:'orders',
        element:<Orders/>
      },
      {
        path:'products',
        element:<ProductsA/>
      },
    
    {
      path: '*',
      element: <h2>page not found --- dashboard</h2>
    }
    ]

  }
]);