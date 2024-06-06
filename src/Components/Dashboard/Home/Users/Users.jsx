import  React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { toast } from 'react-toastify';
import { TablePagination, tablePaginationClasses as classes } from '@mui/base/TablePagination';
import './Users.css';

export default function Users() {
  const { userToken, userData } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getUsers();
  }, [userToken]);

  const getUsers = async (page = 1) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}user/getAll?page=${page}`, {
        headers: { Authorization: `Rufaidah__${userToken}` }
      });
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleBlockToggle = (userId) => {
    setUsers(users.map(user =>
      user._id === userId ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' } : user
    ));
  };

  const handelAdminChange = async (user) => {
    try {
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


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const displayedUsers = rowsPerPage > 0
    ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredUsers;

  const emptyRows = rowsPerPage - displayedUsers.length;

  return (
    <Root sx={{ maxWidth: '100%' }}>
      <div className='d-flex justify-content-between mb-4'>
        <h1 className=''>المستخدمين</h1>
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


      <table aria-label="custom pagination table" className="users-table">
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
          {displayedUsers.map((user, index) => (
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
                  <button className='text-dark bg-transparent p-2 ' onClick={() => handelAdminChange(user)}>اضافة أدمن</button>
                ) : (
                  <button className='bg-danger px-3' onClick={() => handelAdminChange(user)}>ازالة أدمن</button>
                )}
              </td>
            </tr>
          ))}
   
        </tbody>
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'الكل', value: -1 }]}
              colSpan={7}
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </Root>
  );
}


const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${theme.palette.mode === 'dark' ? "#303740" : "#DAE2ED"};
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: ${theme.palette.mode === 'dark' ? "1C2025" : '#fff'};
  }
  `,
);

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;
