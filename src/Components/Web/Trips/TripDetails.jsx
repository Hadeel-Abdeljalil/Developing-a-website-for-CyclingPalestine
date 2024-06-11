import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './TripDetails.css';
import TripComments from '../Products/TripComments.jsx';

const TripDetails = () => {
  const { postId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}post/getDetails/${postId}`);
        setTrip(data.post);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching trip details</div>;
  }

  if (!trip) {
    return <div>No trip details available</div>;
  }

  return (
    <div className='container mt-5 pt-5 mb-5'>
      <div className='d-flex justify-content-center'>
        <div className='container-fluid w-75 h-100'>
        <div className='mt-4 d-flex justify-content-end align-items-center'>
            <h1>{trip.title}</h1>
          </div>
          <p className='dir text-wrap text-break'>{trip.description}</p>
          <Swiper
            modules={[Pagination, Scrollbar, Autoplay]}
            spaceBetween={55} // Remove padding between slides
            slidesPerView={1.75}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3000 }}
            className="mySwiper"
            onSwiper={(swiper) => { }}
            onSlideChange={(swiper) => {
              swiper.slides.forEach((slide, index) => {
                const isActive = swiper.activeIndex === index;
                slide.style.transform = isActive ? 'scaleX(1.2)' : 'scaleX(1)';
              });
            }}
          >
            {trip.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className='trip'>
                  <img src={image.secure_url} className='img-fluid custom-image' alt={`Trip SubImage ${index + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

       <div className='mt-5'>
        <h1 className='dir'>التعليقات</h1>
        <TripComments postId={trip._id}  />

       </div>

        </div>
      </div>
    </div>
  );
}

export default TripDetails;
