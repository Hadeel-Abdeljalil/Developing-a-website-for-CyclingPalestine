import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './TripDetails.css'; 

const TripDetails = () => {
  const { postId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const {data} = await axios.get(`${import.meta.env.VITE_API_URL}post/getDetails/${postId}`);
        console.log(data)
        setTrip(data);
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
  <></>
  );
}

export default TripDetails;
