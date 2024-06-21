import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './News.css';
import './NewsMedia.css';
import { UserContext } from '../../Context/FeatureUser.jsx';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

export default function News() {
  const { userToken, userData } = useContext(UserContext);
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
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
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}news/delete/${trackId}`, {
          headers: { Authorization: `Rufaidah__${userToken}` }
        });
        if (data.message === 'success') {
          toast.success("تم حذف الخبر بنجاح", toastConfig);
          location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowModal(true);
  };

  return (
    <section className="section my-5 swiper-container">
      <div className="h-100 w-100">
        <h1>أخبار فلسطين على البسكليت</h1>
        <div className="container">
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
                  <SwiperSlide key={index} className="swiper-slide">
                    <div>
                      <div className="d-flex justify-content-between align-items-center pb-3">
                        <p className="text-end pt-3 pe-2">{formatDate(newsItem.date)}</p>
                        <h2>{newsItem.title}</h2>
                      </div>
                      <div className="text-end">
                        <p className="text-center">
                          {isExpanded ? newsItem.content : newsItem.content.length > 150 ? newsItem.content.substring(0, 500) + ' ... ' : newsItem.content}
                          {newsItem.content.length > 500 && (
                            <span className="toggle-text" onClick={toggleExpansion}>
                              {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Display images if available */}
                      {newsItem.images.length > 0 && (
                        <div className="mb-3 d-flex justify-content-center flex-wrap">
                          {newsItem.images.map((image, idx) => (
                            <img
                              key={idx}
                              src={image.secure_url}
                              alt={`Image ${idx + 1}`}
                              className="img-fluid rounded mx-1 news-image"
                              onClick={() => handleImageClick(newsItem.images)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Display video if available */}
                      {newsItem.video && (
                        <div className="mb-3 d-flex justify-content-center">
                          <video controls className="img-fluid rounded news-video">
                            <source src={newsItem.video.secure_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}

                      {role === 'Admin' && (
                        <div className="d-flex justify-content-center mt-3">
                          <button
                            className="btn btn-outline-danger me-2"
                            onClick={() => deleteNews(newsItem._id)}
                          >
                            حذف
                          </button>
                          <button
                            className="btn btn-outline-info"
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
                <p>لا يوجد أخبار</p>
              )}
            </Swiper>
          )}
        </div>
      </div>

      {/* Modal for Image Swiper */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>عرض الصور</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            navigation
            className="swiper-modal"
          >
            {selectedImages.map((image, idx) => (
              <SwiperSlide key={idx}>
                <img src={image.secure_url} alt={`Image ${idx + 1}`} className="img-fluid rounded mx-auto d-block w-100" />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal.Body>
      </Modal>
    </section>
  );
}
