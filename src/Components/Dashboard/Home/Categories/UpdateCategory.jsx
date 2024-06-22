import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function UpdateCategory({ category, userToken }) {
  const [categoryName, setCategoryName] = useState(category.name);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(category.status || 'Active');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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


  const handleUpdate = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('status', status);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const confirmation = await Swal.fire({
        title: "<div class='p-3 pt-5'>هل أنت متأكد؟</div>",
        confirmButtonText: "<span class=''>نعم</span>",
        cancelButtonText: "<span class='mb-3'>لا</span>",
        showCancelButton: true,
        showCloseButton: true,
        customClass: {
          confirmButton: 'btn bg-white border border-success text-dark',
          cancelButton: 'btn bg-white border text-dark'
        },
      });
      if (confirmation.isConfirmed) {
        setLoading(true)
      const {data} = await axios.patch(
        `${import.meta.env.VITE_API_URL}category/update/${category._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Rufaidah__${userToken}`,
          },
        }
      );
      if(data.message =="success"){
        toast.success("تم تعديل الفئة",toastConfig)
        
      }
      console.log(data)
      setLoading(false)
    }} catch (error) {
      console.error('Error updating category:', error);
     
    }
  };

  if (loading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
      </div>

    );
  }
  return (
    <form className='border shadowx p-3 py-5 dir' onSubmit={handleUpdate}>
      <div className="form-group justify-content-around mb-2">
        <label className='label-width'>اسم الفئة:</label>
        <input
          type="text"
          className="form-control"
          name="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
      </div>
      <div className="form-group justify-content-around mb-2">
        <label className='label-width'> تغيير الصورة</label>
        <input
          type="file"
          className="form-control"
          name="image"
          onChange={handleFileChange}
        />
      </div>
      <div className="form-group justify-content-around mb-2">
        <label className='label-width'>الحالة:</label>
        <select
          className="form-control bg-white text-black"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Active">مفعل</option>
          <option value="notActive">غير مفعل</option>
        </select>
      </div>
      <div className='d-flex justify-content-end mt-3'>
        <button type="submit" className="btn btn-outline-dark">
          تعديل الفئة
        </button>
      </div>
     
    </form>
  );
}
