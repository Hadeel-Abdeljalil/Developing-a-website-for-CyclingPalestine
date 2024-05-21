import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './SwiperStore.css'
import './SwiperMedia.css'

export default function SwiperStoare() {
  return (
    <div className='h-100'>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        spaceBetween={70}
        slidesPerView={1}
        navigation
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className=' d-flex align-content-center header  h-100 w-100'

      >
        <SwiperSlide className=' h-100 w-100'><img className='h-100 w-100' src="/images/back.jpg" alt="swiper-slide" />
        <span className='swiper-text'>
          <h1 className='swiper-text2 '> استعد لاستكشاف الطرقات الجديدة واكتشاف المناظر الخلابة على عجلتك</h1>
          <Link to="/trips">        <button className='btn border border-white bg-transparent text-white rounded-5 fw-bold store-header-botton mt-2'>شارك معنا</button>
          </Link>
        </span>        </SwiperSlide>
        
        <SwiperSlide className=' h-100 w-100'><img className='h-100 w-100' src="/images/contact-us.jpg" alt="swiper-slide" />
        <span className='swiper-text'>
          <h1 className='swiper-text2'>استكشف فريقنا ورؤيتنا</h1>
          <Link to="/about">        <button className='btn border border-white bg-transparent text-white rounded-5 fw-bold store-header-botton mt-2'>شاهد الآن</button>
          </Link>
        </span>
        </SwiperSlide>
        <SwiperSlide className=' h-100 w-100'><img className='h-100 w-100' src="/images/x3.jpeg" alt="swiper-slide" />
        <span className='swiper-text'>
          <h1 className='swiper-text2'>كل ما تحتاجه لرحلتك الأمثل</h1>
          <Link to="/products">        <button className='btn border border-white bg-transparent text-white rounded-5 fw-bold store-header-botton mt-2'>تسوق الآن</button>
          </Link>
        </span>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
