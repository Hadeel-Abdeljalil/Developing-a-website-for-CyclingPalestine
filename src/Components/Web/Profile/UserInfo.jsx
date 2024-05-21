import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/FeatureUser';
import { IoMdKey } from 'react-icons/io';
import { BsArrowLeft } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserInfo() {
  const navigate =useNavigate();
  let { userToken, setUserToken, userData, setUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

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
      userName: userData.userName || '',
      birthdate: userData.birthdate || '',
      gender: userData.gender || '',
      phone: userData.phone || '',
      Address: userData.Address || '',
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
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue('image', event.target.files[0]);
  };

  const handleInfoChange = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `https://cycling-palestine.onrender.com/user/updateProfile/${userData._id}`,
        {
          userName: values.userName,
          birthdate: values.birthdate,
          gender: values.gender,
          phone: values.phone,
          Address: values.Address,
        },
        { headers: { Authorization: `Rufaidah__${userToken}` } }
      );

      const { data } = response;

      console.log('Server response:', data);

      if (data.message === 'success') {
        setUserData({ ...userData, ...values });
        toast.success('تم تحديث المعلومات بنجاح', toastConfig);
      } else {
        toast.warn('لم يتم تحديث المعلومات');
        console.log('Server response message:', data.message);
      }
    } catch (error) {
      toast.error('خطأ في تحديث المعلومات');
      console.error('Error updating info:', error);
    } finally {
      setIsLoading(false);
      setIsEditingInfo(false);
    }
  };

  

  const handleDeleteAccount = async () => {
    const confirmDeletion = window.confirm('هل أنت متأكد أنك تريد حذف حسابك؟ سيتم حذف جميع بياناتك بشكل نهائي.');

    if (confirmDeletion) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}user/deleteAccount/${userData._id}`,
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );
    
        if (response.status === 200) {
          alert('تم حذف الحساب بنجاح');
          localStorage.removeItem('userToken');
          setUserToken(null);
          setUserData(null);
          navigate("/login")
        } else {
          alert('فشل في حذف الحساب');
        }
      } catch (error) {
        console.error('There was an error deleting the account!', error);
        alert('حدث خطأ أثناء حذف الحساب!');
      }
    }
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
              <input type='file' name='image' onChange={handleFileChange} />
              <button type="submit" disabled={isLoading || !formik.isValid} className='btn border-black mt-1'>{isLoading ? 'جاري التحميل...' : 'غيَر الصورة'}</button>
            </div>
          </form>
        </div>
        <hr />
        <div className='mx-3 d-flex justify-content-between'>
          <p>الإسم الكامل</p>
          {isEditingName ? (
            <div>
              <input
                type="text"
                defaultValue={userData.userName}
                onBlur={(e) => handleInfoChange({ userName: e.target.value })}
                autoFocus
              />
              <button onClick={() => setIsEditingName(false)}>إلغاء</button>
            </div>
          ) : (
            <>
              <p>{userData.userName}</p>
              <button className='text-info border-0 bg-transparent mb-3' onClick={() => setIsEditingName(true)}>تغيير الاسم</button>
            </>
          )}
        </div>
      </div>
      <div className='border rounded-2 bg-white shadowx mt-3'>
        <div>
          <div className='d-flex align-items-center'>
            <div className='border-bottom w-100'>
              <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                <p>المعلومات الشخصية</p>
                <button className='text-info border-0 bg-transparent mb-3' onClick={() => setIsEditingInfo(true)}>تعديل</button>
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
          {isEditingInfo ? (
            <form onSubmit={formik.handleSubmit}>
              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                    <label className='opacity-50  w-25'>تاريخ الميلاد</label>
                    <input
                      type='date'
                      name='birthdate'
                      value={formik.values.birthdate}
                      onChange={formik.handleChange}
                      className='form-control m-2'
                    />
                  </div>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3  d-flex justify-content-between align-items-center'>
                    <label className='opacity-50 w-25'>الجنس </label>
                    <select
                      name='gender'
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      className='form-control bg-transparent text-dark m-2'
                    >
                      <option value=''>اختيار</option>
                      <option value='male'>ذكر</option>
                      <option value='female'>أنثى</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                    <label className='opacity-50 w-25'>رقم الهاتف</label>
                    <input
                      type='text'
                      name='phone'
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      className='form-control m-2'
                    />
                  </div>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3  d-flex justify-content-between align-items-center'>
                    <label className='opacity-50 w-25'>العنوان</label>
                    <input
                      type='text'
                      name='Address'
                      value={formik.values.Address}
                      onChange={formik.handleChange}
                      className='form-control m-2'
                    />
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-end'>
                <button
                  type='button'
                  className='btn btn-secondary mt-3 my-3 mx-1 '
                  onClick={() => setIsEditingInfo(false)}
                >
                  إلغاء
                </button>
                <button
                  type='submit'
                  className='btn btn-primary mt-3 my-3 mx-1 ms-3'
                  disabled={isLoading}
                  onClick={() => handleInfoChange(formik.values)}
                >
                  {isLoading ? 'جاري التحديث...' : 'تحديث'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                    <p className='opacity-50'>تاريخ الميلاد</p>
                    <p>{userData.birthdate ? (new Date(userData.birthdate)).toISOString().split('T')[0] : 'لا يوجد'}</p>
                    <Link className='pb-3 opacity-50'>
                      <BsArrowLeft />
                    </Link>
                  </div>
                </div>
              </div>

              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                    <p className='opacity-50'>الجنس </p>
                    <p>{userData.gender || 'لا يوجد'}</p>
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
                    <p>{userData.phone || 'لا يوجد'}</p>
                    <Link className='pb-3 opacity-50'>
                      <BsArrowLeft />
                    </Link>
                  </div>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='border-bottom w-100'>
                  <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
                    <p className='opacity-50'>العنوان </p>
                    <p>{userData.Address || 'لا يوجد'}</p>
                    <Link className='pb-3 opacity-50'>
                      <BsArrowLeft />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className='mx-5 mt-2 d-flex'>
          <Link to='#' className='text-danger' onClick={handleDeleteAccount}>
            حذف الحساب الشخصي 
          </Link>
          <p className='small'>سيتم حذف جميع بياناتك بشكل نهائي </p>
        </div>
    </div>
  );
}