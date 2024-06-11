import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import '../Trips/Trips.css';

export default function News() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    content: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastConfig = { position: "top-right", autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light" };

    try {
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}news/add`, formData,
       { headers: { Authorization: `Rufaidah__${userToken}` } });
       if(data.message =="success"){
        toast.success("تمت اضافة الرحلة بنجاح", toastConfig);
       }else{
        toast.warning(data.message,toastConfig);
       }
      setFormData({
        title: '',
        date: '',
        content: '',
      });
    } catch (error) {
      toast.error(error.message);
      console.error('Error:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة خبر جديد</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="row">
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>عنوان الخبر:</label>
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
            <label className='label-width'>التاريخ:</label>
            <input
              type="date"
              className="form-control input-width"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
        </div>
    

          <div className="col-lg-12 mb-3 ">
            <label className='label-width'> المحتوى :</label>
            <textarea
              className="form-control input-width"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
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
