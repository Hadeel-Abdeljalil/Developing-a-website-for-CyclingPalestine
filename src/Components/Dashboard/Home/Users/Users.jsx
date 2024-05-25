import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import './Users.css';
import { BsPlus } from 'react-icons/bs';

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
      <h1 className='mb-4'>المستخدمين</h1>

      <table className="users-table ">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>البريد الالكتروني</th>
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
              <td>{user.email ? user.email : 'N/A'}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>

              <td>
                  {user.status === 'Active' ? <button className='bg-danger' onClick={() => handleBlockToggle(user._id)}>حظر</button>
                   : <button className='bg-dark' onClick={() => handleBlockToggle(user._id)}>الغاء الحظر</button>}
              </td>
              <td>
               {
                user.role === "User"?(<button className='bg-dark p-2'>اضافة أدمن</button>)
                :(<button className='bg-danger px-3'>ازالة أدمن</button>)
               }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
