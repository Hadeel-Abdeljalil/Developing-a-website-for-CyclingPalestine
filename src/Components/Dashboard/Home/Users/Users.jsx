import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import './Users.css';
import { toast } from 'react-toastify';

export default function Users() {
  const { userToken, userId: currentAdminId } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  const getUsers = async (page = 1) => {  // Default page to 1 if not provided
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

  const handelAdminChange = async (user) => {
    try {
      // Prevent the current admin from changing their own role
      if (user._id === currentAdminId) {
        toast.warn("لا يمكن للمسؤولين تغيير دورهم.");
        return;
      }
  
      const newRole = user.role === 'User' ? 'Admin' : 'User';
      const apiEndpoint = user.role === 'User' 
        ? `${import.meta.env.VITE_API_URL}user/addAdmin/${user._id}` 
        : `${import.meta.env.VITE_API_URL}user/removeAdmin/${user._id}`;
  
      const response = await axios.patch(apiEndpoint, {}, {
        headers: { Authorization: `Rufaidah__${userToken}` }
      });
  
      console.log('Admin change response:', response.data); // Log response data for debugging
      setUsers(users.map(u =>
        u._id === user._id ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Error changing admin status:', error);
    }
  };
  

  return (
    <div>
      <h1 className='mb-4'>المستخدمين</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الحالة</th>
            <th>الدور</th>
            <th>حظر</th>
            <th>إضافة أدمن</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>
                {user.status === 'Active' ? (
                  <button className='text-dark bg-transparent' onClick={() => handleBlockToggle(user._id)}>حظر</button>
                ) : (
                  <button className='bg-dark' onClick={() => handleBlockToggle(user._id)}>الغاء الحظر</button>
                )}
              </td>
              <td>
                {user.role === 'User' ? (
                  <button className='text-dark bg-transparent p-2' onClick={() => handelAdminChange(user)}>اضافة أدمن</button>
                ) : (
                  <button className='bg-danger px-3' onClick={() => handelAdminChange(user)}>ازالة أدمن</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
