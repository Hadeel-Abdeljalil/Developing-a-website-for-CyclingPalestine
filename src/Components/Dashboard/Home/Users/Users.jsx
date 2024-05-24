import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import './Users.css'; 

export default function Users() {
  const { userToken } = useContext(UserContext);
  const [users, setUsers] = useState([]);
 

  const getUsers = async (page) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}user/getAll?page=${page}`, {
        headers: { Authorization: `Rufaidah__${userToken}` }
      });
      console.log('Response data:', response.data); // Log response data for debugging
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [userToken]);

  const handleBlockToggle = (userId) => {
    setUsers(users.map(user =>
      user._id === userId ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' } : user
    ));
  };
  

  return (
    <div>
      <h1>المستخدمين</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>البريد الالكتروني</th>
            <th>الحالة</th>
            <th>الدور</th>
            <th>حدث</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.email ? user.email : 'N/A'}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleBlockToggle(user._id)}>
                  {user.status === 'Active' ? 'حظر' : 'إلغاء الحظر'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
}
