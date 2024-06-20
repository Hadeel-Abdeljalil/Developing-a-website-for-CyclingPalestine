import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import './News.css';
import './NewsMedia.css';
import { UserContext } from '../../Context/FeatureUser.jsx';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function News() {
  const { userToken, userData } = useContext(UserContext);
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const role = userData?.role;

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}news/`, {
          headers: { Authorization: `Rufaidah__${userToken}` },
        });
        setNews(data.news);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load news.');
      }
    };

    fetchData();
  }, [userToken]); // Add userToken to the dependency array

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const toastConfig = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  const deleteNews = async (trackId) => {
    console.log(trackId)
    try {
      const confirmation = await Swal.fire({
        title: "<div class='pt-3'>هل أنت متأكد؟</div>",
        confirmButtonText: "<span class=''>نعم</span>",
        cancelButtonText: "<span class='mb-3'>لا</span>",
        showCancelButton: true,
        showCloseButton: true,
        customClass: {
          confirmButton: 'btn bg-white border border-success text-dark',
          cancelButton: 'btn bg-white border text-dark'
        },
      });
      if (confirmation.isConfirmed) {
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}news/delete/${trackId}`,
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );
        console.log(data)
        if (data.message == 'success') {
          toast.success("تم حذف الخبر بنجاح", toastConfig);
          location.reload();
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <section className="p-5 my-5 w-100  dir mt-3">
      <div className="h-100 w-100 ">
        <div className=" container ">
          {error ? (
            <p>{error}</p>
          ) : (
            <Swiper
              modules={[Scrollbar, Autoplay]}
              spaceBetween={70}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 7000 }}
            >
              {news.length > 0 ? (
                news.map((newsItem, index) => (
                  <SwiperSlide key={index} className="text-center   w-100 slider ">
                    <div className="">
                      <h1>{newsItem.title}</h1>
                      <p className='text-end'>{formatDate(newsItem.date)}</p>

                      {/* Display images if available */}
                      {newsItem.images.length > 0 && (
                        <div className="mb-3">
                          {newsItem.images.map((image, idx) => (
                            <img
                              key={idx}
                              src={image.secure_url}
                              alt={`Image ${idx + 1}`}
                              className="img-fluid rounded mx-1 w-100"
                              style={{ maxWidth: '250px', maxHeight: '250px' }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Display video if available */}
                      {newsItem.video && (
                        <div className="mb-3">
                          <video controls className="img-fluid rounded w-50">
                            <source src={newsItem.video.secure_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      <div className='text-end  '>
                        <p>
                          {isExpanded ? newsItem.content : newsItem.content.length > 150 ? newsItem.content.substring(0, 500) + ' ... ' : newsItem.content}
                          {newsItem.content.length > 500 && (
                            <span className='color ' onClick={toggleExpansion}>
                              {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                            </span>
                          )}
                        </p>

                      </div>

                      {role === 'Admin' && (
                        <div className="d-flex w-25  ">
                          <button
                            className="btn bg-white text-danger btn-outline-danger w-50 me-1 rounded-2 p-2"
                            onClick={() => deleteNews(newsItem._id)}
                          >
                            حذف
                          </button>

                          <button
                            className="btn bg-white text-info btn-outline-info w-50 me-1 rounded-2 p-2"
                            onClick={() => editNews(newsItem._id)}
                          >
                            تعديل
                          </button>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <p>لا يوجد أخبار </p>
              )}
            </Swiper>
          )}
        </div>
      </div>
    </section>

  );
}
