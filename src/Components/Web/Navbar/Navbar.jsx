import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faBell } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { UserContext } from '../Context/FeatureUser';
import { CartContext } from '../Context/FeatureCart';
import './Navbar.css';
import Popup from 'reactjs-popup';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  let { userToken, setUserToken, userData, setUserData } = useContext(UserContext);
  let { count } = useContext(CartContext);
  const role = userData?.role;

  const logOut = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
    setUserData(null);
    navigate('/login');
  };

  const [navbar, setNavbar] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const changeBackground = () => {
    if (window.scrollY >= 30) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  const getNotification = async () => {
    try {
      const { data } = await axios.get(`https://cycling-palestine.onrender.com/notification/`, {
        headers: { Authorization: `Rufaidah__${userToken}` }
      });
      setNotifications(data.notifications.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userToken) {
      getNotification();
    }
  }, [userToken]);

  window.addEventListener('scroll', changeBackground);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top bg-nav ${navbar ? ' mt-0 nav x ' : ''}`}>
      <div className="container h-100">
        <span className="navbar-brand mb-0 h1 font-style">
          CYCLING PALESTINE
          <FontAwesomeIcon icon={faRoute} />
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto mb-3 mb-lg-0 dir">
            <li className="nav-item me-4">
              <NavLink className="nav-link border-nav" activeclassname="active" to="/">
                الرئيسية
              </NavLink>
            </li>
            <li className="nav-item me-4">
              <NavLink className="nav-link border-nav" activeclassname="active" to="/trips">
                جولاتنا
              </NavLink>
            </li>
            <li className="nav-item me-4">
              <NavLink className="nav-link border-nav" activeclassname="active" to="/about">
                عنا
              </NavLink>
            </li>
            <li className="nav-item me-4">
              <HashLink className="nav-link border-nav" activeclassname="active" smooth to="/#services">
                خدماتنا
              </HashLink>
            </li>
            <li className="nav-item me-4">
              <NavLink className="nav-link border-nav" activeclassname="active" to="/products">
                المتجر
              </NavLink>
            </li>

            {userToken ? (
              <li className="nav-item me-4">
                <NavLink className="nav-link border-nav" activeclassname="active" to="/cart">
                  السلة <span className="badge badge-info bg-secondary">{count}</span>
                </NavLink>
              </li>
            ) : null}
          </ul>

          <ul className="navbar-nav">
            <li className='nav-item dropdown d-flex align-items-center '>
              {userData ? (
                <Popup
                  trigger={<button className="btn"><FontAwesomeIcon icon={faBell} /></button>}
                  
                >
                  <div className='bg-white  position-relative comment-container rounded-3'>
                    {notifications.length > 0 ? notifications.map((not) => (
                      <div key={not._id} className=''>
                        <p className='color'>{not.createdAt.split('T')[0]}</p>
                        <p className='text-end me-3'>{not.content}</p>
                        <hr />
                      </div>
                    )) : 'No notifications'}
                  </div>
                </Popup>
              ) : ''}
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {userData ? userData.userName : 'شارك معنا'}
              </a>

              <ul className="dropdown-menu dir">
                {!userToken ? (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        إنشاء حساب
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        تسجيل الدخول
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        الملف الشخصي
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/profile/orders">
                        طلباتي
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={logOut}>
                        تسجيل خروج
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
      {
        role === 'Admin' ? (
          <Link to={'/dashboard/home'}>
            <button className='btn btn-outline-dark me-2'>dashboard</button>
          </Link>
        ) : ''
      }
    </nav>
  );
}
