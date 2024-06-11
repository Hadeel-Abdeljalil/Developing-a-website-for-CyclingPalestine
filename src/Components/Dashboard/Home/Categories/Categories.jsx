import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import UpdateCategory from './UpdateCategory.jsx';

export default function Categories() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [imagePreview, setimagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
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

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}category/create`, formDataToSend, {
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
        getCategories();  // Fetch categories again to update the table
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

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}category/getActive`);
      if (data && data.message === "success") {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
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
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}category/delete/${id}`, {
        headers: {
          Authorization: `Rufaidah__${userToken}`
        }
      });

      if (data && data.message === "success") {
        toast.success('تم حذف الفئة بنجاح', toastConfig);
        getCategories();  // Fetch categories again to update the table
      } else {
        setLoading(false);
        toast.error('حدث خطأ أثناء حذف الفئة', toastConfig);
        console.error('Server data error:', data);
      }
    } catch (error) {
      setLoading(false);
      toast.error('حدث خطأ أثناء حذف الفئة', toastConfig);
      console.error('Error during deletion:', error);
    }
    setLoading(false);
  };

  const handleUpdate = async (id) => {
    // Implement update functionality here
    console.log('Update category with ID:', id);
  };

  useEffect(() => {
    getCategories();
  }, []);

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
       <div className='row'>
       <div className="col-lg-6 mb-3 d-flex">
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
    
       </div>
       <div className="col-lg-9 mb-3 d-flex">
          <label className='label-width'>الصورة الرئيسية:</label>
          <input
            type="file"
            className="form-control"
            name="image"
            ref={imageInputRef}
            onChange={handleChange}
          />
          <button type="button" className="btn btn-outline-secondary w-25 me-2 " onClick={handleimageClick}>
            اختر الصورة
          </button>
          </div>
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
        <div className='d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark">
            إضافة مسار
          </button>
        </div>
      </form>

      <h2 className='mt-5'>الفئات الحالية</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الصورة</th>
            <th>التاريخ</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <img src={category.image.secure_url} alt={category.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </td>
              <td>{new Date(category.createdAt).toLocaleDateString()}</td>
              <td >
                <button className="btn btn-danger" onClick={() => handleDelete(category._id)}>
                  حذف
                </button>
                <Popup
                  trigger={<button className="btn btn-info me-2" onClick={() => handleUpdate(category._id)}>
                    تعديل
                  </button>}
                  position='center center'
                >
                  <UpdateCategory
                    category={category}
                    userToken={userToken}
                  />
                </Popup>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
