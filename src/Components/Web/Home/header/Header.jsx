import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Typed from 'typed.js';
import SwiperStoare from '../../Swiper/SwiperStore.jsx';
export default function Header() {
    const typedElement = useRef(null);

    useEffect(() => {
        const options = {
            strings: ["PALESTINE"],
            typeSpeed: 150,
            backSpeed: 150,
            loop: true,
        };

        if (typedElement.current) {
            const typedInstance = new Typed(typedElement.current, options);

            return () => {
                typedInstance.destroy();
            };
        }
    }, []);

    return (
        <section className=" vh-100 mb-5  m-0 p-0 ">
        <SwiperStoare/>
           {/* <div className=" d-flex flex-column justify-content-center vh-100 ">
           <h1 className="fw-bold font-style">YOUR PERFECT RIDE IN <span ref={typedElement} className="auto-type"></span> </h1>
            <div className=''>
                <div className="social-media  d-flex justify-content-start align-items-center w-100 ">
                    <a href="https://www.facebook.com/cyclingpalestine" className="p-2 ">
                        <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </div>
                    </a>
                    <a href="#" className="p-2">
                        <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={faInstagram} />
                        </div>
                    </a>
                    <a href="#" className="p-2">
                        <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={faTwitter} />
                        </div>
                    </a>
                    <a href="https://www.youtube.com/channel/UCsYE7Di2EmiVD-dtDxH0ayQ" className="p-2">
                        <div className="icon border rounded-circle d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={faYoutube} />
                        </div>
                    </a>
                </div>

            </div>
           </div> */}
            

        </section>
    );
}
