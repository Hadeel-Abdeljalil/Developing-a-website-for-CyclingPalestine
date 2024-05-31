import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import './Trips.css'

export default function Trips() {
  const { userToken, userData } = useContext(UserContext);
  console.log(userToken)
  const [formData, setFormData] = useState({
    trackName: '',
    date: '',
    distance: '',
    startPoint: '',
    endPoint: '',
    difficultyLevel: '',
    description: '',
    maxParticipants: ''
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
        description: '',
        maxParticipants: ''
      });
    } catch (error) {
      toast.error(error);
      console.error('Error:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-3">
      <h1 className='mb-3'>اضافة رحلة جديدة</h1>
      <form onSubmit={handleSubmit} className='border shadowx p-3 py-5'>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group justify-content-around mb-2">
            <label className='label-width'>{key === 'maxParticipants' ? 'الحد الأقصى للمشاركين' : key === 'difficultyLevel' ? 'مستوى الصعوبة' : key === 'description' ? 'الوصف' : key === 'distance' ? 'المسافة' : key === 'endPoint' ? 'نقطة النهاية' : key === 'startPoint' ? 'نقطة البداية' : key === 'date' ? 'التاريخ' : 'اسم المسار'}:</label>
            {key === 'description' ? (
              <textarea
                className="form-control"
                name={key}
                value={value}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={key === 'date' ? 'date' : 'text'}
                className="form-control"
                name={key}
                value={value}
                onChange={handleChange}
                min={key === 'date' ? today : undefined}
                required
              />
            )}
          </div>
        ))}
        <div className='d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark">
            إضافة مسار
          </button>
        </div>
      </form>
    </div>
  );
}
