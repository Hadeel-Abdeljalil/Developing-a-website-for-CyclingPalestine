import React, { useContext } from 'react'
import { UserContext } from '../Context/FeatureUser'
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

export default function UserOrders() {
    const { getUserOrdersContext } = useContext(UserContext);

    const getUserOrders = async () => {
        const res = await getUserOrdersContext();
        return res.orders;
    }
    const { data, isLoading } = useQuery('order-content', getUserOrders);

    if (isLoading) {
        return <div className="loading vh-100 w-100 d-flex justify-content-center align-items-center bg-white">
            <span className="loader"></span>
        </div>
    }
    let counter = 0;

    return (
        <div className=" border rounded-2 mt-5 shadowx">
            <div className=" m-5">
                <h2 className='mb-5'>طلباتي</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">العنوان</th>
                            <th scope="col"> نوع الدفع</th>
                            <th scope="col"> موعد الطلب</th>
                            <th scope="col">الحالة</th>
                            <th scope="col">السعر النهائي</th>
                            <th scope="col">اسم الكوبون</th>
                            <th scope="col">تفاصيل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length ? data.map((order) =>
                            <React.Fragment key={order._id}>
                                <tr>
                                    <td>{counter++}</td>
                                    <td>{order.address}</td>
                                    <td>{order.paymentType}</td>
                                    <td>{order.createdAt}</td>
                                    <td>{order.status}</td>
                                    <td>{order.finalPrice}شيكل</td>
                                    <td>{order.couponName}</td>
                                    <td><Link to='orderDetails'></Link></td>

                                </tr>
                            </React.Fragment>
                        ) : <h2>No orders</h2>}

                    </tbody>
                </table>
            </div>
        </div>
    )
}
