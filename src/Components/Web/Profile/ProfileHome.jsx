import React, { useContext } from 'react';
import { UserContext } from '../Context/FeatureUser.jsx';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { HashLink } from 'react-router-hash-link';

export default function ProfileHome() {
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
                مرحبًا بك في ركوب الدراجات في فلسطين! هذه هي صفحة ملفك الشخصي حيث يمكنك إدارة معلوماتك.
            </p>
            <p>
                 يمكنك هنا تغيير معلوماتك الشخصية مثل الاسم وصورة ملفك الشخصي وكلمة المرور...            </p>
           
            <p>
                إذا كنت تحتاج إلى مساعدة، لا تتردد في <HashLink className='color' smooth to="/#contact-us">الاتصال بنا</HashLink>.
            </p>
        </div>
    );
}
