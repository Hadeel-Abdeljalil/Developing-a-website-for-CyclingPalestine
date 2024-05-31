import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function Categories() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [imagePreview, setimagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const imageFile = files[0];
      setFormData(prevState => ({
        ...prevState,
        image: imageFile
      }));
      setimagePreview(URL.createObjectURL(imageFile));
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
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('image', formData.image);

      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}category/create`, formDataToSend, {
        headers: {
          Authorization: `Rufaidah__${userToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });


      console.log(data);

      if (data && data.message === "success") {
        toast.success('تمت إضافة الفئة بنجاح ', toastConfig);
        setFormData({
          name: '',
          image: null
        });
        setimagePreview(null);
      } else {
        setLoading(false);
        toast.error('حدث خطأ أثناء إضافة الفئة', toastConfig);
        console.error('Server data error:', data);
      }
    } catch (error) {
      setLoading(false);
      toast.error('حدث خطأ أثناء إضافة الفئة', toastConfig);
      console.error('Error during submission:', error);
    }
    setLoading(false);
  };

  const handleimageClick = () => {
    imageInputRef.current.click();
  };

  if (loading) {
    return (
      <div className="loading bg-white w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة  فئة جديدة</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>اسم الفئة:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>الصورة الرئيسية:</label>
          <input
            type="file"
            className="form-control"
            name="image"
            ref={imageInputRef}
            onChange={handleChange}
          />
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleimageClick}>
            اختر الصورة
          </button>
          {imagePreview && (
            <div className="form-group justify-content-around mb-2">
              <img
                src={imagePreview}
                alt="Main preview"
                className="img-thumbnail m-2"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
        <div className='d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark">
            إضافة مسار
          </button>
        </div>
      </form>
      <div>
        
      </div>
    </div>
  );
}
