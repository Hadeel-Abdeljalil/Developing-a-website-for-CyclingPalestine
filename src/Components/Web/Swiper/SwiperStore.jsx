import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './SwiperStore.css'
import { Link } from 'react-router-dom';

export default function SwiperStoare() {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        spaceBetween={70}
        slidesPerView={1}
        navigation
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className='h-100 d-flex align-content-center header '

      >
        <SwiperSlide className=' h-100 w-100'><img className='h-100 w-100' src="../../../../public/images/back.jpg" alt="" />
        <span className='swiper-text'>
          <h1 className='swiper-text2 '> استعد لاستكشاف الطرقات الجديدة واكتشاف المناظر الخلابة على عجلتك</h1>
          <Link to="/trips">        <button className='btn border border-white bg-transparent text-white rounded-5 fw-bold store-header-botton mt-2'>شارك معنا</button>
          </Link>
        </span>        </SwiperSlide>
        
        <SwiperSlide className=' h-100 w-100'><img className='h-100 w-100' src="../../../../public/images/contact-us.jpg" alt="" />
        <span className='swiper-text'>
          <h1 className='swiper-text2'>استكشف فريقنا ورؤيتنا</h1>
          <Link to="/about">        <button className='btn border border-white bg-transparent text-white rounded-5 fw-bold store-header-botton mt-2'>شاهد الآن</button>
          </Link>
        </span>
        </SwiperSlide>
        <SwiperSlide className=' h-100 w-100'><img className='h-100 w-100' src="../../../../public/images/train.jpg" alt="" />
        <span className='swiper-text'>
          <h1 className='swiper-text2'>كل ما تحتاجه لرحلتك الأمثل</h1>
          <Link to="/products">        <button className='btn border border-white bg-transparent text-white rounded-5 fw-bold store-header-botton mt-2'>تسوق الآن</button>
          </Link>
        </span>
        </SwiperSlide>
        
      </Swiper>
    </>
  );
}
