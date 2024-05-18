import React from 'react'
import { Link } from 'react-router-dom'
import './ServiceMedia.css'

export default function Services() {
  return (
    <>
      <section className="services" id="services"> {/* Removed unnecessary classes */}
        <div className="container text-center"> {/* Added text-center class for center alignment */}
          <div className="row "> {/* Added row class */}
            <div className="col-lg-4 mb-4"> {/* Adjusted column size and added margin bottom */}
              <Link to="/products" className="service-link"> {/* Moved Link component outside of div */}
                <div className="service">
                  <h1>03</h1>
                  <h2>متجرنا</h2>
                  <p>
                    إمكانية تأجير وتصليح الدراجات الهوائية وبيع المعدات والمستلزمات
                    الرياضية.
                  </p>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mb-4"> {/* Adjusted column size and added margin bottom */}
              <Link to="/trips" className="service-link"> {/* Moved Link component outside of div */}
                <div className="service">
                  <h1>02</h1>
                  <h2>جولات خارجية</h2>
                  <p>كل يوم جمعة وسبت ع مناطق مختلفة من فلسطين.</p>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mb-4"> {/* Adjusted column size and added margin bottom */}
              <Link to="/trips" className="service-link"> {/* Moved Link component outside of div */}
                <div className="service">
                  <h1>01</h1>
                  <h2>جولات أسبوعية</h2>
                  <p>نقدم جولات في مدينة رام الله على مدار الأسبوع.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
