import React, { useContext } from 'react'
import { UserContext } from '../Context/FeatureUser'
import { IoMdKey } from 'react-icons/io'; // Importing key icon from react-icons/io package
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'; // Importing arrow icon from react-icons/bs package
import { Link } from 'react-router-dom';
import SendCode from '../Auth/SendCode.jsx';

export default function UserInfo() {

  const { userData } = useContext(UserContext);

  return (
    <div className='h-100 py-5'>
      <div className='d-flex justify-content-between mx-4 mb-3 '>
        <h3 className=''>بياناتك</h3>
        <Link className='text-info' to='../sendCode'>تغيير كلمة السر
          <span>
            <IoMdKey />
          </span>
        </Link>

      </div>
      <div className='border rounded-2  bg-white shadowx'>
        <div className='m-5 '>
          <div className='d-flex align-items-center '>
            <div className=" pt-3"><img className='profileImage' src={userData.image.secure_url} /></div>
            <div className='w-25 me-3'>
              <p className='  mt-3'>إضفاء الطابع الشخصي على حسابك مع صورة. ستظهر صورة ملفك الشخصي</p>
              <button className='btn border-black'> غيَر الصورة</button>
            </div>
          </div>
        </div>
        <hr className='' />
        <div className="mx-3 d-flex justify-content-between ">
          <p>الإسم الكامل</p>
          <p >{userData.userName}</p>
          <div>{/*مش بالغلط */}
          </div>
          <Link className='text-info'> تغيير الاسم</Link>
        </div>
      </div>
      <div className='border rounded-2  bg-white shadowx mt-3'>
        <div >
          <div className='d-flex align-items-center  '>
            <div className='border-bottom w-100'>
            <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
              <p>المعلومات الشخصية</p>
              <Link className='text-info pb-3'>تعديل</Link>
            </div>
            </div>
          </div>
          <div className='d-flex align-items-center  '>
            <div className='border-bottom w-100'>
            <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
              <p className='opacity-50'>البريد الإلكتروني </p>
              <p>{userData.email}</p>
              <div>{/*مش بالغلط */}
          </div>
              <Link className='pb-3 opacity-50'>
              <BsArrowLeft />
              </Link>
            </div>
            </div>
          </div>
          <div className='d-flex align-items-center  '>
            <div className='border-bottom w-100'>
            <div className='mx-3 pt-3 d-flex justify-content-between align-items-center'>
              <p className='opacity-50'> رقم الهاتف </p>
              <p className='opacity-50'>{userData.phone? userData.phone:'لا يوجد'}</p>
              <div>{/*مش بالغلط */}
          </div>
              <Link className='pb-3 opacity-50'>
              <BsArrowLeft />
              </Link>
            </div>
            </div>
          </div>
        </div>
       
      </div>

    </div>
  )
}
