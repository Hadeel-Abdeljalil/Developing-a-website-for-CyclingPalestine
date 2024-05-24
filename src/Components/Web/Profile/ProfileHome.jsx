import React, { useContext } from 'react'
import { UserContext } from '../Context/FeatureUser.jsx';

export default function ProfileHome() {
    const { userData } = useContext(UserContext);

    // Check if userData is not null or undefined before accessing its properties
    // You can use optional chaining (?.) to safely access nested properties
    const userName = userData?.userName;
  
    return (
      <div className='m-5'>
        {/* Render userName if it exists, otherwise render a fallback */}
        مرحبًا بعودتك, {userName || 'User'} 👋
      </div>
    );
  }