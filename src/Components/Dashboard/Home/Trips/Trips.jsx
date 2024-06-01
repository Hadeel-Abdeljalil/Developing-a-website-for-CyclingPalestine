import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import './Trips.css';

export default function Trips() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    trackName: '',
    date: '',
    distance: '',
    startPoint: '',
    endPoint: '',
    difficultyLevel: '',
    maxParticipants: '',
    description: '',
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}track`, formData, { headers: { Authorization: `Rufaidah__${userToken}` } });
      toast.success('تمت إضافة الرحلة بنجاح', toastConfig);
      setFormData({
        trackName: '',
        date: '',
        distance: '',
        startPoint: '',
        endPoint: '',
        difficultyLevel: '',
        maxParticipants: '',
        description: '',
      });
    } catch (error) {
      toast.error(error.message);
      console.error('Error:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة رحلة جديدة</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="row">
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>اسم المسار:</label>
            <input
              type="text"
              className="form-control input-width"
              name="trackName"
              value={formData.trackName}
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
        <div className="row">
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>المسافة:</label>
            <input
              type="text"
              className="form-control input-width"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>نقطة البداية:</label>
            <input
              type="text"
              className="form-control input-width"
              name="startPoint"
              value={formData.startPoint}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>نقطة النهاية:</label>
            <input
              type="text"
              className="form-control input-width"
              name="endPoint"
              value={formData.endPoint}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>مستوى الصعوبة:</label>
            <input
              type="text"
              className="form-control input-width"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 mb-3 d-flex">
            <label className='label-width'>الحد الأقصى للمشاركين:</label>
            <input
              type="text"
              className="form-control input-width"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
            />
          </div>
         
        </div>
      
          <div className="col-lg-12 mb-3 ">
            <label className='label-width'> الوصف :</label>
            <textarea
              className="form-control input-width"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
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
