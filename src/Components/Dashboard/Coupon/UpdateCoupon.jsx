import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function UpdateCoupon({ coupon, userToken, onUpdate }) {
  const [code, setCode] = useState('');
  const [expiredDate, setExpiredDate] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code || '');
      setExpiredDate(coupon.expiredDate ? new Date(coupon.expiredDate).toISOString().split('T')[0] : '');
      setDiscountPercentage(coupon.discountPercentage || 0);
    }
  }, [coupon]);

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

  const handleUpdate = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('code', code);
    formData.append('discountPercentage', discountPercentage);
    formData.append('expiredDate', expiredDate);

    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        customClass: {
          confirmButton: 'btn bg-white border border-success text-dark',
          cancelButton: 'btn bg-white border text-dark'
        },
      });

      if (!confirmation.isConfirmed) {
        return; // Do nothing if not confirmed
      }

      setLoading(true);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}coupon/update/${coupon._id}`,
        formData,
        {
          headers: {
            'Authorization': `Rufaidah__${userToken}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      console.log('Response:', response.data); // Debugging

      if (response.data.message === "coupon updated successfully") {
        toast.success("Coupon updated successfully", toastConfig);

        // Update local state or parent component
        if (onUpdate) {
          onUpdate({
            ...coupon,
            code,
            expiredDate,
            discountPercentage
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error("An error occurred while updating the coupon", toastConfig);
      setLoading(false);
    }
  };

  if (!coupon) {
    return <div>Coupon not found</div>;
  }

  if (loading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="Loading" className="img-fluid" style={{ width: '200px' }} />
      </div>
    );
  }

  return (
    <form className='border shadowx p-3 py-5  ms-5 dir' onSubmit={handleUpdate}>
      <div className="form-group justify-content-around mb-2">
        <label className='label-width'>Coupon Code:</label>
        <input
          type="text"
          className="form-control"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="form-group justify-content-around mb-2">
        <label className='label-width'>Expiration Date:</label>
        <input
          type="date"
          className="form-control"
          name="expiredDate"
          value={expiredDate}
          onChange={(e) => setExpiredDate(e.target.value)}
        />
      </div>
      <div className="form-group justify-content-around mb-2">
        <label className='label-width'>Discount Percentage:</label>
        <input
          type="number"
          className="form-control"
          name="discountPercentage"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
      </div>

      <div className='d-flex justify-content-end mt-3'>
        <button type="submit" className="btn btn-outline-dark">
          Update Coupon
        </button>
      </div>
    </form>
  );
}
