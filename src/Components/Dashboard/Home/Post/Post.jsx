import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function Post() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainImage: null,
    images: []
  });
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

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
    } else if (name === 'mainImage') {
      const mainImageFile = files[0];
      setFormData(prevState => ({
        ...prevState,
        mainImage: mainImageFile
      }));
      setMainImagePreview(URL.createObjectURL(mainImageFile));
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

    if (formData.images.length < 4) {
      toast.error('يرجى تحميل ما لا يقل عن  4 صور', toastConfig);
      return;
    }

    try {
      setLoading(true)
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mainImage', formData.mainImage);

      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await axios.post(`${import.meta.env.VITE_API_URL}post/`, formDataToSend, {
        headers: {
          Authorization: `Rufaidah__${userToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const { data } = response;

      console.log(data);

      if (data && data.message === "success") {
        toast.success('تمت إضافة الرحلة بنجاح', toastConfig);
        setFormData({
          title: '',
          description: '',
          mainImage: null,
          images: []
        });
        setMainImagePreview(null);
        setImagePreviews([]);
      } else {
        setLoading(false)
        toast.error('حدث خطأ أثناء إضافة الرحلة', toastConfig);
        console.error('Server data error:', data);
      }
    } catch (error) {
      setLoading(false)
      toast.error('حدث خطأ أثناء إضافة الرحلة', toastConfig);
      console.error('Error during submission:', error);

      if (error.response) {
        setLoading(false)

        console.error('Server error data:', error.response.data);
      } else if (error.request) {
        console.error('No data received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

    }
    setLoading(false)

  };

  const handleMainImageClick = () => {
    mainImageInputRef.current.click();
  };

  const handleImagesUploadClick = () => {
    fileInputRef.current.click();
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
      <h1 className='mb-3'>اضافة رحلة سابقة</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="row mb-3">
          <div className="col-lg-6 d-flex">
            <label className='label-width'>اسم المسار:</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-lg-6 d-flex">
            <label className='label-width'>الوصف:</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        <div className="row mb-3">
          <div className="col-lg-6">
            <label className='label-width'>الصورة الرئيسية:</label>
            <input
              type="file"
              className="form-control"
              name="mainImage"
              ref={mainImageInputRef}
              onChange={handleChange}
            />
            <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleMainImageClick}>
              اختر الصورة
            </button>
            {mainImagePreview && (
              <div className="mt-2">
                <img
                  src={mainImagePreview}
                  alt="Main preview"
                  className="img-thumbnail"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <label className='label-width'>صور إضافية:</label>
            <input
              type="file"
              className="form-control d-none"
              name="images"
              ref={fileInputRef}
              multiple
              onChange={handleChange}
            />
            <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleImagesUploadClick}>
              اختر الصور
            </button>
            {imagePreviews.length > 0 && (
              <div className="image-previews mt-2">
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
