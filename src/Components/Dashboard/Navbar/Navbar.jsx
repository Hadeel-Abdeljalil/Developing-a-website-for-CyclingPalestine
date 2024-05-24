import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Web/Context/FeatureUser.jsx';
import { HashLink } from 'react-router-hash-link';


export default function Navbar() { const navigate = useNavigate();
  let { userToken, setUserToken, userData, setUserData } = useContext(UserContext);

  const logOut = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
    setUserData(null);
    navigate('/');
  };

  const [navbar, setNavbar] = useState(false);
  const changeBackground = () => {
    if (window.scrollY >= 30) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

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
            <li className="nav-item me-4 ">
            <NavLink className="nav-link border-nav" activeclassname="active" to="/">
                الرئيسية
              </NavLink>
            </li>
            <li className="nav-item me-4 ">
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
           

           
          </ul>
          
        </div>
      </div>
    </nav>
  );
}