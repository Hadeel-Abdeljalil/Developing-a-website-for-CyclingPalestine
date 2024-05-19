import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { Data } from './Data.jsx';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './TripDetails.css'; // Import the CSS file

export default function TripDetails() {
  const { tripId } = useParams();

  const trip = Data.find(item => item.id === parseInt(tripId));

  if (!trip) {
    return <div>غير موجود</div>;
  }

  return (
    <div className='container mt-5 pt-5 vh-100'>
      <div className='d-flex justify-content-center'>
        <div className='container-fluid w-75 h-100'>
          <Swiper
            modules={[Pagination, Scrollbar, Autoplay]}
            spaceBetween={55} // Remove padding between slides
            slidesPerView={1.75}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3000 }}
            className="mySwiper"
            onSwiper={(swiper) => {
            }}
            onSlideChange={(swiper) => {
              swiper.slides.forEach((slide, index) => {
                const isActive = swiper.activeIndex === index;
                slide.style.transform = isActive ? 'scaleX(1.2)' : 'scaleX(1)';
              });
            }}
          >
            {trip.subImage.length ? trip.subImage.map((subImgObj, index) => (
              <SwiperSlide key={index}>
                <div className='trip'>
                  <img src={subImgObj.subImage} className='img-fluid custom-image' alt={`Trip SubImage ${index + 1}`} />
                </div>
              </SwiperSlide>
            )) : <h2 className='dir'>لا يوجد فئات</h2>}
          </Swiper>
          <div className=' mt-4 d-flex  justify-content-end align-items-center '>
          <p>{trip.date}</p>
          <h1 className=' '>{trip.name}</h1>
          </div>
          <p className='dir'>{trip.text}</p>
        </div>
      </div>
    </div>
  );
}
