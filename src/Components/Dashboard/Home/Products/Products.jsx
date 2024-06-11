import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function Products() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mainImage: null,
    subImages: [],
    price: '',
    discount: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}category/getActive`);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'subImages') {
      const imageFiles = Array.from(files);
      setFormData(prevState => ({
        ...prevState,
        subImages: [...prevState.subImages, ...imageFiles]
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

    if (formData.subImages.length < 2) {
      toast.error('يرجى تحميل ما لا يقل عن  2 صور', toastConfig);
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mainImage', formData.mainImage);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('categoryId', formData.categoryId);

      formData.subImages.forEach(image => {
        formDataToSend.append('subImages', image);
      });

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}product/createProduct`, formDataToSend, {
        headers: {
          Authorization: `Rufaidah__${userToken}`,
        }
      });
      console.log(data)

      if (data && data.message === "product added successfully!") {
        toast.success('تمت إضافة المنتج بنجاح', toastConfig);
        setFormData({
          name: '',
          description: '',
          mainImage: null,
          subImages: [],
          price: '',
          discount: '',
          categoryId: ''
        });
        setMainImagePreview(null);
        setImagePreviews([]);
      } else {
        toast.error('حدث خطأ أثناء إضافة المنتج', toastConfig);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج', toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageClick = () => {
    mainImageInputRef.current.click();
  };

  const handleSubImagesUploadClick = () => {
    fileInputRef.current.click();
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
      <h1 className='mb-3'>اضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="row mb-3">
          <div className="col-lg-6 d-flex">
            <label className='label-width '>اسم المنتج:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 d-flex">
            <label className='label-width'>الفئة:</label>
            <div className='w-100'>
              <select
                className="form-control bg-white text-dark w-100"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">اختر الفئة</option>
                {categories?.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-lg-6 d-flex">
            <label className='label-width'>السعر:</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 d-flex">
            <label className='label-width'>الخصم:</label>
            <input
              type="number"
              className="form-control"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3 ">

          <div className="col-lg-12 ">
            <label className='label-width'>الوصف:</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3 ">
        <div className="col-lg-6">
          <div className='d-flex'>
            <label className='label-width'>الصورة الرئيسية:</label>
            <input
              type="file"
              className="form-control"
              name="mainImage"
              ref={mainImageInputRef}
              onChange={handleChange}
            />
            <button type="button" className="btn btn-outline-secondary me-2" onClick={handleMainImageClick}>
              حدد
            </button>
          </div>
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
              name="subImages"
              ref={fileInputRef}
              multiple
              onChange={handleChange}
            />
            <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleSubImagesUploadClick}>
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
            إضافة منتج
          </button>
        </div>
      </form>
    </div>
  );
}
