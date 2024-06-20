import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar,Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../Swiper/Swiper.css'
import { Link } from 'react-router-dom';
export default function({data}) {
  return (
   <div className='container'>
    <div className='container-fluid'>
    <Swiper
    modules={[Navigation, Pagination,Scrollbar,Autoplay]}
    spaceBetween={70}
    slidesPerView={5}
    navigation
    loop={true}
    autoplay={{ delay: 2000 }} 
    pagination={{ clickable: true }}
  >
    {data?.length ? data.map((category) => (
      <SwiperSlide key={category._id}>
        <Link to={`/products/category/${category._id}`}>
          <div className='category pt-5'>
            <img src={category.image.secure_url} className='img-fluid' />
            <p>{category.name}</p>
          </div>
        </Link>
      </SwiperSlide>
    )) : <h2 className='dir'>لا يوجد فئات</h2>}
  </Swiper>
    </div>
   </div>
  
  )
}
