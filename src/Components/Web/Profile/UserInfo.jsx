import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/FeatureUser';
import { IoMdKey } from 'react-icons/io';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserInfo() {
  const { userData, userToken } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

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

  const formik = useFormik({
    initialValues: {
      image: null,
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', values.image);

      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}user/uploadPic`,
          formData,
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );

        const { data } = response;

        // Log the response for debugging
        console.log('Server response:', data);

        if (data.message === 'success') {
          formik.resetForm();
          toast.success('تم تغيير الصورة بنجاح', toastConfig);
        } else {
          toast.warn('لم يتم تغيير الصورة');
          console.log('Server response message:', data.message);
        }
      } catch (error) {
        toast.error('خطأ في تحميل الصورة');
        console.error('Error uploading image:', error); // Specific error logging
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue('image', event.target.files[0]);
  };

  return (
    <div className='h-100 py-5'>
      <div className='d-flex justify-content-between mx-4 mb-3'>
        <h3>بياناتك</h3>
        <Link className='text-info' to='../sendCode'>
          تغيير كلمة السر
          <span><IoMdKey /></span>
        </Link>
      </div>
      <div className='border rounded-2 bg-white shadowx'>
        <div className='m-5'>
          <form className='d-flex align-items-center' onSubmit={formik.handleSubmit} encType='multipart/form-data'>
            <div className="pt-3">
              <img className='profileImage' src={userData.image ? userData.image : 'images/profile.jpeg'} alt="Profile" />
            </div>
            <div className='w-25 me-3'>
              <p className='mt-3'>إضفاء الطابع الشخصي على حسابك مع صورة. ستظهر صورة ملفك الشخصي</p>
              <input type='file' name='image' onChange={handleFileChange} /> {/* Add name attribute */}
              <button type="submit" disabled={isLoading || !formik.isValid} className='btn border-black'>{isLoading ? 'جاري التحميل...' : 'غيَر الصورة'}</button>
            </div>
          </form>
        </div>
        <hr />
        <div className='mx-3 d-flex justify-content-between'>
          <p>الإسم الكامل</p>
          <p>{userData.userName}</p>
          <Link className='text-info'>تغيير الاسم</Link>
        </div>
      </div>
      <div className='border rounded-2 bg-white shadowx mt-3'>
        <div>
          <div className='d-flex align-items-center'>
            <div className='border-bottom w-100'>
              <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                <p>المعلومات الشخصية</p>
                <Link className='text-info pb-3'>تعديل</Link>
              </div>
            </div>
          </div>
          <div className='d-flex align-items-center'>
            <div className='border-bottom w-100'>
              <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                <p className='opacity-50'>البريد الإلكتروني</p>
                <p>{userData.email}</p>
                <Link className='pb-3 opacity-50'>
                  <BsArrowLeft />
                </Link>
              </div>
            </div>
          </div>
          <div className='d-flex align-items-center'>
            <div className='border-bottom w-100'>
              <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                <p className='opacity-50'>رقم الهاتف</p>
                <p className='opacity-50'>{userData.phone ? userData.phone : 'لا يوجد'}</p>
                <Link className='pb-3 opacity-50'>
                  <BsArrowLeft />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
