import React, { useState } from 'react';
import axios from 'axios';

export default function UpdateCategory({ category, userToken }) {
  const [categoryName, setCategoryName] = useState(category.name);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(category.status || 'active');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}category/update/${category._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Rufaidah__${userToken}`,
          },
        }
      );
      console.log(response.data);

    } catch (error) {
      console.error('Error updating category:', error);
     
    }
  };

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
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
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
