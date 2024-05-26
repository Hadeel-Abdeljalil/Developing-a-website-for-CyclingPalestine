import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './Users.css';


export default function Users() {
  const { userToken, userData } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const getUsers = async (page = 1) => {
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
      if (user._id === userData._id) {
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleSelect = (e) => {
    setSelectedRole(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedRole === 'All' || user.role === selectedRole)
  );

  return (
    <div>
    <div className='d-flex justify-content-between mb-4'>
  <h1 className=''>المستخدمين</h1>
  {/* Search and Role Select */}
  <div className='d-flex align-items-center w-50'>
    <input
      type="text"
      placeholder="ابحث عن مستخدم بالاسم..."
      value={searchQuery}
      onChange={handleSearch}
      className='mx-1 border border-secondary rounded shadow-bottom input '
    />
    <select
      value={selectedRole}
      onChange={handleRoleSelect}
      className='bg-white text-dark border border-secondary rounded shadow-bottom input'
    >
      <option value="All">الكل</option>
      <option value="Admin">أدمن</option>
      <option value="User">مستخدم</option>
    </select>
  </div>
</div>


      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>البريد</th>
            <th>الحالة</th>
            <th>الدور</th>
            <th>حظر</th>
            <th>إضافة أدمن</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
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
