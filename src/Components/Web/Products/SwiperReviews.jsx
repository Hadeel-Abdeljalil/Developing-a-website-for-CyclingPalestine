import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { FreeMode, Scrollbar, Mousewheel } from 'swiper/modules';
import './SwiperProduct.css'
export default function ({ data }) {
  
  return (
    <div className='d-flex justify-content-end mb-3'>
      <div className='w-75 ' style={{ height: '350px' }}>

        <Swiper
          direction={'vertical'}
          slidesPerView={'auto'}
          freeMode={true}
          scrollbar={true}
          mousewheel={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          className="mySwiper"
        >
          <div className="d-flex justify-content-center ">
            {data.comments?.length ? data.comments?.map((review) => (
              <SwiperSlide key={review._id} className=' p-0 m-0'>
                <div className="d-flex justify-content-start dir mx-5 mt-4 ">
                 <div className=''>
                 <div className='bg-secondary-subtle rounded-3 me-3  d-flex'>
                  <div className="px-5  ">
                  <p className='dir text-end'>{review.userName}</p>

                    <p>{review.text}</p>
                  </div>
                 </div>
                </div>
                 </div>

              </SwiperSlide>
            )) : <p>لا يوجد تعليقات</p>}

          </div>
        </Swiper>
      </div>
    </div>
  )
  
}
