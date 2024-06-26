import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { BsBicycle, BsBox, BsBox2, BsCheck, BsGift } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TablePagination, tablePaginationClasses as classes } from '@mui/base/TablePagination';
import { styled } from '@mui/system';
import '.././Users/Users.css'
import Swal from 'sweetalert2';
import { DeliveryDiningRounded } from '@mui/icons-material';

export default function Orders() {
  const { userToken } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}order/getAll`, {
        headers: { Authorization: `Rufaidah__${userToken}` }
      });
      setOrders(response.data.orders.reverse());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchOrders();
  }, [userToken]);

  const handleChangeStatus = async (orderId, status) => {
    try {
      const confirmation = await Swal.fire({
        title: "<div class='pt-3'>هل أنت متأكد؟</div>",
        confirmButtonText: "<span class=''>نعم</span>",
        cancelButtonText: "<span class='mb-3'>لا</span>",
        showCancelButton: true,
        showCloseButton: true,
        customClass: {
          confirmButton: 'btn bg-white border border-success text-dark',
          cancelButton: 'btn bg-white border text-dark'
        },
      });
      if (confirmation.isConfirmed) {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}order/changeStatus/${orderId}`,
          { status },
          {
            headers: { Authorization: `Rufaidah__${userToken}` }
          }
        );
        console.log(response)
        // Update the order status locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error("Error:", error.response.data);
      setError(error);
    }

  };

  if (loading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
      </div>

    );
  }

  if (error) {
    return <p>خطأ: {error.message}</p>;
  }

  return (
    <Root>
      <h1 className='mb-3 text-end'>الطلبات</h1>
      <table className="table table-bordered users-table">
        <thead>
          <tr>
            <th className='text-center'>الزبون</th>
            <th className='text-center'>العنوان</th>
            <th className='text-center'>رقم الهاتف</th>
            <th className='text-center'>المنتجات</th>
            <th className='text-center'>المبلغ</th>
            <th className='text-center'>نوع الدفع</th>
            <th className='text-center'>الحالة</th>
            <th className='text-center'>تغيير الحالة</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
            <tr key={order._id}>
              <td className='text-center'>{order.userId?.userName ? order.userId?.userName : ''}</td>
              <td className='text-center'>{order.address}</td>
              <td className='text-center'>{order.phoneNumber}</td>
              <td className='text-center'> <ul>
                {order.products.map((product) => (
                  <li>{product.productName}/
                    <span className='text-danger '>الكمية(<span className='text-dark'>{product.quantity}</span>)</span>
                  </li>
                ))}
              </ul></td>
              <td className='text-center'>{order.amount}</td>
              <td className='text-center'>{order.paymentType}</td>
              <td className='text-center'>{order.status}</td>
              <td className='text-center'>
                <div className="btn-group">
                  {order.status === 'pending' && order.status !== 'cancelled' && (
                    <button
                      className="btn btn-secondary border rounded-2 bg-success"
                      onClick={() => handleChangeStatus(order._id, 'confirmed')}
                    >
                      <BsCheck />
                    </button>
                  )}
                  {order.status === 'confirmed' && order.status !== 'cancelled' && (
                    <button
                      className="btn btn-secondary border rounded-2 bg-info"
                      onClick={() => handleChangeStatus(order._id, 'onway')}
                    >
                      <BsBicycle />
                    </button>
                  )}
                  {order.status === 'onway' && order.status !== 'cancelled' && (
                    <button
                      className="btn btn-secondary border rounded-2 bg-warning"
                      onClick={() => handleChangeStatus(order._id, 'delivered')}
                    >
                      <BsGift/>
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (

                    <button
                    
                      className="btn btn-secondary bg-danger border rounded-2"
                      onClick={() => handleChangeStatus(order._id, 'cancelled')}
                    >
                    <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>

              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'الكل', value: -1 }]}
              colSpan={8}
              count={orders.length}
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
