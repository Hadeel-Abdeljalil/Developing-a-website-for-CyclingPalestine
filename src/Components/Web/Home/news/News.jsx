import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import './News.css';
import './NewsMedia.css';
import { UserContext } from '../../Context/FeatureUser.jsx';

export default function News() {
  const {userToken}=useContext(UserContext)
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}news/`,{
          headers :{Authorization :`Rufaidah__${userToken}`}
        });
        setNews(data.news);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load news.');
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="notice">
        <div className="container d-flex">
          <div className="border-c">
            {error ? (
              <p>{error}</p>
            ) : (
              <Swiper
                modules={[Scrollbar, Autoplay]}
                spaceBetween={70}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 9000 }}
              >
                {news.length ? news.map((newsItem, index) => (
                  <SwiperSlide key={index} className='text-end hi'>
                    <div className='me-5'>
                      <p>{newsItem.content}</p>
                      <h1>{newsItem.content}</h1>
                      <p>{newsItem.content}</p>
                    </div>
                  </SwiperSlide>
                )) : ''}
              </Swiper>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
