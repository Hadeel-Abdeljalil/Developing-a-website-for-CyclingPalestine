import React, { useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Scrollbar, Mousewheel } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import axios from 'axios';
import { UserContext } from '../Context/FeatureUser.jsx';
import Popup from 'reactjs-popup';
import { FaComment } from 'react-icons/fa';

export default function Comment({ itemId, val }) {
  const { userToken } = useContext(UserContext);
  const [data, setData] = useState({ reviews: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const comment = async (itemId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${val}/comment/${itemId}`, 
        {}, 
        { headers: { Authorization: `Rufaidah__${userToken}` } }
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup
      trigger={<div className=' p-2 mx-1'><FaComment /></div>}
    >
  <div className='d-flex justify-content-end'>
      <div className='w-75 ' style={{ height: '300px' }}>

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
            {data.reviews.length ? data.reviews.map((review) => (
              <SwiperSlide key={review._id} className=' p-0 m-0'>
                <div className="d-flex justify-content-start dir mx-5 mt-4 ">
                  <div className="  ">
                    <img className='rounded-circle ' style={{ width: '50px', height: '50px' }} src={review.createdBy.image.secure_url} alt="girl" />
                  </div>
                 <div className=''>
                 <div className='d-flex me-3'>
                    <p className='ps-3'> {review.createdBy.userName}</p>
                    <p>
                      {Array.from({ length: review.rating }, (_, index) => (
                        <svg
                          height="800px"
                          width="800px"
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 47.94 47.94"
                          xmlSpace="preserve"
                          key={index}
                        >
                          <path
                            fill="#ED8A19"
                            d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
                          />
                        </svg>
                      ))}
                    </p>
                  </div>
                 <div className='bg-secondary-subtle rounded-3 me-3  d-flex'>
                  <div className="px-5  ">
                    <p>{review.comment}</p>
                  </div>
                 </div>
                </div>
                 </div>

              </SwiperSlide>
            )) : <h2>لا يوجد تعليقات</h2>}

          </div>
        </Swiper>
      </div>
    </div>
    </Popup>
  );
}
