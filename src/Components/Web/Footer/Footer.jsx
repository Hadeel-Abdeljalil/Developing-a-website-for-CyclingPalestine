import React from 'react'
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram , faFacebookF, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer ">
      <div className="container">
        <div className="footer-img">
          <img src="/images/footerLogo.jpg" alt="restaurant_logo" />
        </div>
        <p><span>©</span> 2021 Palestine on Bicycle. All Rights Reserved.</p>
        <div className="social-media mt-3 d-flex justify-content-center w-100">
          <Link to="https://www.facebook.com/cyclingpalestine" className="p-2" target="_blank" rel="noopener noreferrer">
            <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
              <FontAwesomeIcon icon={faFacebookF}/>
            </div>
          </Link>
          <Link to="https://www.instagram.com/cyclingpalestine/" className="p-2" target="_blank" rel="noopener noreferrer">
            <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
              <FontAwesomeIcon icon={faInstagram} />
            </div>
          </Link>
          <Link to="https://twitter.com" className="p-2" target="_blank" rel="noopener noreferrer">
            <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
              <FontAwesomeIcon icon={faTwitter} />
            </div>
          </Link>
          <Link to="https://www.youtube.com/channel/UCsYE7Di2EmiVD-dtDxH0ayQ" className="p-2" target="_blank" rel="noopener noreferrer">
            <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
              <FontAwesomeIcon icon={faYoutube}/>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}
