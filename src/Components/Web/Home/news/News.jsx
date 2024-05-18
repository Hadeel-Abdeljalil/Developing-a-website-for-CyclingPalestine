import React from 'react'
import { DataNews } from './DataNews.jsx'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import './News.css'

export default function News() {
  return (
    <>
      <section className="notice">
        <div className="container d-flex">

          <div className=" w-75 border-c ">
            <Swiper
              modules={[Scrollbar, Autoplay]}
              spaceBetween={70}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 9000 }}
            >
              {
                DataNews.length ? DataNews.map((news, index) => (
                  <SwiperSlide key={index}>
                    <div className='me-5'>
                      <p>{news.date}</p>
                      <h1>{news.name}</h1>
                      <p>
                        {news.details}
                      </p>
                    </div>
                  </SwiperSlide>
                )) : ''
              }
            </Swiper>
          </div>
          </div>

      </section>
    </>
  )
}
