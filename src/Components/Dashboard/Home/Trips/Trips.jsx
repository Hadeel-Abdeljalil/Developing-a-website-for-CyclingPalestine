import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';  // Adjust the import according to your file structure
import { toast } from 'react-toastify';
import './Trips.css'

export default function Trips() {
  const { userToken } = useContext(UserContext);
  const [trackName, setTrackName] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trackData = {
      trackName,
      date,
      distance,
      start_point: startPoint,
      end_point: endPoint,
      difficulty_level: difficultyLevel,
      description,
      maxParticipants: parseInt(maxParticipants, 10),
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

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}track`, trackData, {
        headers: {
          Authorization: `Rufaidah__${userToken}`
        },
      });
      toast.success('تمت إضافة الرحلة بنجاح', toastConfig)
      console.log('Success:', response.data);
      setTrackName('');
      setDate('');
      setDistance('');
      setStartPoint('');
      setEndPoint('');
      setDifficultyLevel('');
      setDescription('');
      setMaxParticipants('');
    } catch (error) {
      toast.error(error)
      console.error('Error:', error);
    }
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة رحلة جديدة</h1>
      <form onSubmit={handleSubmit} className='border shadowx p-3 py-5'>
        <div className="form-group justify-content-around mb-2 ">
          <label className='label-width' >اسم المسار:</label>
          <input
            type="text"
            className="form-control "
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>التاريخ:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today} // Set the min attribute to today's date
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>المسافة:</label>
          <input
            type="number"
            className="form-control "
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>نقطة البداية:</label>
          <input
            type="text"
            className="form-control  "
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>نقطة النهاية:</label>
          <input
            type="text"
            className="form-control "
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>مستوى الصعوبة:</label>
          <input
            type="text"
            className="form-control "
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>الوصف:</label>
          <textarea
            className="form-control "
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group justify-content-around mb-2">
          <label className='label-width'>الحد الأقصى للمشاركين:</label>
          <input
            type="number"
            className="form-control "
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            required
          />
        </div>
        <div className=' d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark  ">
            إضافة مسار
          </button>
        </div>
      </form>
    </div>
  );
}
