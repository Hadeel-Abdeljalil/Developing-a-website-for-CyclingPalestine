import React, { useContext } from 'react';
import { UserContext } from '../../Web/Context/FeatureUser.jsx';

export default function Home() {
  const { userData } = useContext(UserContext);

  // Check if userData is not null or undefined before accessing its properties
  // You can use optional chaining (?.) to safely access nested properties
  const userName = userData?.userName;

  return (
    <>
      {/* Render userName if it exists, otherwise render a fallback */}
      مرحبًا بك, {userName || 'User'} 👋
    </>
  );
}
