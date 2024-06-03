import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../Web/Context/FeatureUser.jsx';
import { BsBicycle, BsCheck } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'


export default function Orders() {
  const { userToken } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}order/getAll`, {
        headers: { Authorization: `Rufaidah__${userToken}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userToken]);

  const handleChangeStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}order/changeStatus/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Rufaidah__${userToken}`,
          },
        }
      );

    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <p>جارٍ التحميل...</p>;
  }

  if (error) {
    return <p>خطأ: {error.message}</p>;
  }

  return (
    <div>
      <h1>الطلبات</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>الزبون</th>
            <th>العنوان</th>
            <th>رقم الهاتف</th>
            <th>المبلغ</th>
            <th>نوع الدفع</th>
            <th>الحالة</th>
            <th>تغيير الحالة</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.address}</td>
              <td>{order.address}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.amount}</td>
              <td>{order.paymentType}</td>
              <td>{order.status}</td>
              <td>
                <div className="btn-group">

                  {order.status !== 'confirmed' && (
                    <button
                      className="btn btn-secondary mx-2 border rounded-2 bg-success"
                      onClick={() => handleChangeStatus(order._id, 'confirmed')}
                    >
                      <BsCheck />
                    </button>
                  )}
                  {order.status !== 'pending' && (
                    <button
                      className="btn btn-secondary mx-2 border rounded-2 bg-info"
                      onClick={() => handleChangeStatus(order._id, 'onway')}
                    >
                      <BsBicycle />
                    </button>
                  )}
                  <button
                    className="btn btn-secondary bg-danger border rounded-2"
                    onClick={() => handleChangeStatus(order._id, 'cancelled')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
