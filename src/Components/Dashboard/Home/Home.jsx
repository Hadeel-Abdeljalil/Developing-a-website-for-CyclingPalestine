import React, { useContext } from 'react';
import { UserContext } from '../../Web/Context/FeatureUser.jsx';
import { HashLink } from 'react-router-hash-link';

export default function Home() {
  const { userData } = useContext(UserContext);

  // Check if userData is not null or undefined before accessing its properties
  // You can use optional chaining (?.) to safely access nested properties
  const userName = userData?.userName;

  return (
    <div className='d-flex flex-column align-items-center'>
      <h1 className='m-5'>
        {/* Render userName if it exists, otherwise render a fallback */}
        مرحبًا بك، {userName || 'مستخدم'} 👋
      </h1>
      <p>
        مرحبًا بك في ركوب الدراجات في فلسطين! هذه لوحة التحكم الخاصة بك، يمكنك إدارة بيانات الموقع من خلالها.
      </p>
      <ul>
        <li>يمكنك إضافة رحل جديدة</li>
        <li>إضافة منشور عن رحل سابقة</li>
        <li>إضافة منتجات وفئات للمتجر</li>
        <li>عرض الطلبات</li>
        <li> عرض المستخدمين على الموقع</li>
        <li> عرض المشاركين في الرحل</li>
      </ul>
    </div>
  );
}
