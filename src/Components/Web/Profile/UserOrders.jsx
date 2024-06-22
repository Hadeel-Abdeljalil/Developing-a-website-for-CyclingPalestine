import React, { useContext } from 'react'
import { UserContext } from '../Context/FeatureUser'
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

export default function UserOrders() {
    const { getUserOrdersContext } = useContext(UserContext);

    const getUserOrders = async () => {
        const res = await getUserOrdersContext();
        console.log(res)
        return res.orders;
    }
    const { data, isLoading } = useQuery('order-content', getUserOrders);

    if (isLoading) {
        return <div className="loading vh-100 w-100 d-flex justify-content-center align-items-center bg-white">
            <span className="loader"></span>
        </div>
    }
    let counter = 0;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className=" border rounded-2 mt-5 shadowx">
            <div className=" m-5">
                <h2 className='mb-5'>طلباتي</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th className='text-center'>#</th>
                            <th className='text-center '>المنتجات</th>
                            <th className='text-center'>العنوان</th>
                            <th className='text-center'>الدفع</th>
                            <th className='text-center'> الموعد</th>
                            <th className='text-center bg-warning-subtle'>الحالة</th>
                            <th className='text-center'>السعر النهائي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length ? data.map((order) =>
                            <React.Fragment key={order._id}>
                                <tr>
                                    <td className='text-center'>{counter++}</td>
                                    <td className='text-center '> <ul>
                                        {order.products.map((product) => (
                                            <li>{product.productName}/
                                                <span className='text-danger '>الكمية(<span className='text-dark'>{product.quantity}</span>)</span>
                                            </li>
                                        ))}
                                    </ul></td>
                                    <td className='text-center'>{order.address}</td>
                                    <td className='text-center'>{order.paymentType}</td>
                                    <td className='text-center px-4'>{formatDate(order.createdAt)}</td>
                                    <td className='text-center bg-warning-subtle'>{order.status}</td>
                                    <td className='text-center '>{order.amount}شيكل</td>
                                </tr>
                            </React.Fragment>
                        ) : <h2>لا يوجد طلبات</h2>}

                    </tbody>
                </table>
            </div>
        </div>
    )
}
