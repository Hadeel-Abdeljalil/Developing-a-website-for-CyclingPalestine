import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import '../Trips/Trips.css';

export default function News() {
  const { userToken } = useContext(UserContext);
  const [loading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    content: '',
    images: [],
    video: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' || name === 'video') {
      const filesArray = Array.from(files);
      const previews = filesArray.map(file => URL.createObjectURL(file));

      setFormData(prevState => ({
        ...prevState,
        [name]: [...prevState[name], ...filesArray],
      }));

      if (name === 'images') {
        setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
      } else {
        setVideoPreviews(prevPreviews => [...prevPreviews, ...previews]);
      }

      // Reset file input to allow re-selection of the same files
      setFileInputKey(Date.now());
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastConfig = {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
    };

    try {
      setIsLoading(true)

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('content', formData.content);
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image); // Changed to simple append
      });
      formData.video.forEach((video, index) => {
        formDataToSend.append(`video`, video); // Changed to simple append
      });

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}news/add`, formDataToSend, {
        headers: { Authorization: `Rufaidah__${userToken}`, 'Content-Type': 'multipart/form-data' }
      });
      console.log(data)

      if (data.message === "success") {
        toast.success("تمت اضافة الخبر بنجاح", toastConfig);
        setFormData({
          title: '',
          date: '',
          content: '',
          images: [],
          video: []
        });
        setImagePreviews([]);
        setVideoPreviews([]);
        setIsLoading(false)

      } else {
        toast.warning(data.message, toastConfig);
      }
    } catch (error) {
      toast.error(error.message, toastConfig);
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
    }
  };
  if (loading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
      </div>

    );
  }

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة خبر جديد</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="row">
          <div className="col-lg-6 mb-3 d-flex">
            <label className='px-1'>العنوان:</label>
            <input
              type="text"
              className="form-control input-width"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 mb-3 d-flex">
            <label className='px-1'>التاريخ:</label>
            <input
              type="date"
              className="form-control input-width"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-lg-12 mb-3">
          <label className='px-1'>المحتوى:</label>
          <textarea
            className="form-control input-width"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className='d-flex'>
        <div className="col-lg-6 mb-3 mx-1">
          <label className='px-1'>صور:</label>
          <input
            key={fileInputKey}
            type="file"
            className="form-control input-width"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
          <div className="image-previews">
            {imagePreviews.map((url, index) => (
              <img key={index} src={url} alt={`preview ${index}`} className="img-thumbnail m-1" />
            ))}
          </div>
        </div>
        <div className="col-lg-6 mb-3 mx-1">
          <label className='px-1'>فيديو:</label>
          <input
            key={fileInputKey}
            type="file"
            className="form-control input-width "
            name="video"
            multiple
            accept="video/*"
            onChange={handleChange}
          />
          <div className="video-previews ">
            {videoPreviews.map((url, index) => (
              <video key={index} src={url} controls className="video-thumbnail w-50 m-1" />
            ))}
          </div>
        </div>
        </div>
        <div className='d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark">
            إضافة الخبر
          </button>
        </div>
      </form>
    </div>
  );
}
