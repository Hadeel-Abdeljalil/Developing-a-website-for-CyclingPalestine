import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../../Web/Context/FeatureUser.jsx';
import Popup from 'reactjs-popup';

export default function Coupon() {
  const { userToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    expiredDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const getCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}coupon/getAll`, {
        headers: {
          Authorization: `Rufaidah__${userToken}`
        }
      });
      if (data && data.message === "success") {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
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
      const formDataToSend = {
        code: formData.code,
        discountPercentage: formData.discountPercentage,
        expiredDate: formData.expiredDate
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}coupon/create`, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Rufaidah__${userToken}`
        }
      });

      const { data } = response;

      if (data && data.message === "coupon created successfully") {
        toast.success('تمت إضافة الكوبون بنجاح', toastConfig);
        setFormData({
          code: '',
          discountPercentage: '',
          expiredDate: '',
        });
        getCoupons();  // Refresh the coupon list
      } else if (data && data.message === "name already exists") {
        toast.warn('الكوبون موجود مسبقاً', toastConfig);
      } else {
        toast.error('حدث خطأ أثناء إضافة الكوبون', toastConfig);
        console.error('Server data error:', data);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الكوبون', toastConfig);
      console.error('Error during submission:', error);
    } finally {
      setLoading(false);
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
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}coupon/delete/${id}`, {
        headers: {
          Authorization: `Rufaidah__${userToken}`
        }
      });
      if (data && data.message === "coupon deleted successfully") {
        toast.success('تم حذف الكوبون بنجاح', toastConfig);
        getCoupons();
      } else {
        toast.error('حدث خطأ أثناء حذف الكوبون', toastConfig);
        console.error('Server data error:', data);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الكوبون', toastConfig);
      console.error('Error during deletion:', error);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-3">
      <h1 className='mb-3 text-end'>اضافة كوبون</h1>
      <form onSubmit={handleSubmit} className='border shadow p-3 py-5'>
        <div className="row ">
          <div className="col-lg-6 d-flex mb-3">
            <label className='label-width'>الكود :</label>
            <input
              type="text"
              className="form-control"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 d-flex mb-3">
            <label className='label-width'>قيمة الخصم:</label>
            <input
              type="number"
              className="form-control"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-6 d-flex">
            <label className='label-width'>تاريخ الانتهاء :</label>
            <input
              type="date"
              className="form-control"
              name="expiredDate"
              value={formData.expiredDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
        </div>

        <div className='d-flex justify-content-end mt-3'>
          <button type="submit" className="btn btn-outline-dark">
            إضافة كوبون
          </button>
        </div>
      </form>

      <h2 className='mt-5'> الكوبونات</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>الكود</th>
            <th>الخصم</th>
            <th>تاريخ الانشاء</th>
            <th>تاريخ الانتهاء</th>
            <th>مستخدمين</th>
            <th>اجراءات</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>%{coupon.discountPercentage}</td>
              <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
              <td>{new Date(coupon.expiredDate).toLocaleDateString()}</td>
              <td>
                <ul>
                  {coupon?.usedBy.map((user) => (
                    <li key={user.id}>{user.userName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(coupon._id)}>
                  حذف
                </button>
                <Popup
                  trigger={<button className="btn btn-info me-2">
                    تعديل
                  </button>}
                  position='center center'
                >
                  <div>
                    {/* Place your update form or component here */}
                  </div>
                </Popup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
