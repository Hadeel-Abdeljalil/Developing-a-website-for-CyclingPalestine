import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function Post() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const imageFiles = Array.from(files);
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, ...imageFiles]
      }));

      const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...imageUrls]);
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

    if (formData.images.length < 5) {
      toast.error('يرجى تحميل ما لا يقل عن 5 صور', toastConfig);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('body', formData.body);

      formData.images.forEach(image => {
        formDataToSend.append('images', image);  // Use 'images' instead of 'images[]'
      });

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}post/`, formDataToSend, {
        headers: {
          Authorization: `Rufaidah__${userToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(data);
      if (data.message === "success") {
        toast.success('تمت إضافة الرحلة بنجاح', toastConfig);
        setFormData({
          title: '',
          body: '',
          images: []
        });
        setImagePreviews([]);
      } else {
        toast.error('حدث خطأ أثناء إضافة الرحلة', toastConfig);
        console.error('Server data error:', data);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الرحلة', toastConfig);
      console.error('Error during submission:', error);

      // Log detailed error information
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Server error data:', error.response.data);
      } else if (error.request) {
        // Request was made but no data was received
        console.error('No data received:', error.request);
      } else {
        // Something else caused the error
        console.error('Error message:', error.message);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة رحلة سابقة</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>اسم المسار:</label>
          <input
            type="text"
            className="form-control"
            name="title" // Changed to 'title'
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>الوصف:</label>
          <textarea
            className="form-control"
            name="body" // Changed to 'body'
            value={formData.body}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>تحميل الصور:</label>
          <input
            type="file"
            className="form-control d-none"
            name="images"
            ref={fileInputRef}
            multiple
            onChange={handleChange}
          />
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleUploadClick}>
            اختر الصور
          </button>
        </div>
        <div className="form-group justify-content-around mb-2">
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="img-thumbnail m-2"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ))}
            </div>
          )}
        </div>
        <div className='d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark">
            إضافة مسار
          </button>
        </div>
      </form>
    </div>
  );
}
