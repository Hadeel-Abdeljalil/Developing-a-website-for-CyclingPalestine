import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/FeatureUser';
import { CartContext } from '../Context/FeatureCart';
import { useQuery } from 'react-query';
import { BsCartPlus, BsEye, BsHeart } from 'react-icons/bs';
import './Order.css';

export default function Order() {
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        couponCode: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const { getCartContext, clearCartContext } = useContext(CartContext);
    const { userToken } = useContext(UserContext);
    const navigate = useNavigate();

    const clearCart = async () => {
        try {
            await clearCartContext();
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const getCart = async () => {
        const res = await getCartContext();
        return res;
    };

    const toastConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');

        // Construct payload
        const payload = {
            phone: formData.phone,
            address: formData.address,
            ...(formData.couponCode && { couponCode: formData.couponCode }), // Include couponCode only if it's not empty
        };

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}order/create`,
                payload,
                { headers: { Authorization: `Rufaidah__${token}` } }
            );
            if (data.message === 'success') {
                clearCart();
                toast.success('تم تأكيد الطلب بنجاح', toastConfig);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تأكيد الطلب';
            if (errorMessage === 'coupon not found!') {
                toast.error('الكوبون الذي قمت بإدخاله غير موجود !', toastConfig);
            } else if (errorMessage === 'validation error') {
                toast.error('يجب أن يكون كود الكوبون 3 رموز على الأقل !', toastConfig);
            } else {
                toast.error(errorMessage, toastConfig);
            }
        }
    };

    const { data, isLoading } = useQuery('cart-content-order', getCart);

    if (isLoading) {
        return (
            <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
                <img src="/images/xxx.gif" alt="loading" className="img-fluid" style={{ width: '200px' }} />
            </div>
        );
    }
    return (
        <div className='container my-5 pt-5'>
            <h2 className='dir'>أكمل الطلب</h2>
            <div className="row justify-content-center align-items-center pb-5">
                {data?.finalProductsList?.length ? data.finalProductsList.map((product) =>
                    <div
                        className="col-lg-3 ps-0 mb-3"
                        style={{ width: '17rem', position: 'relative' }}
                        key={product._id}
                    >
                        <div className="image-container position-relative">
                            <img
                                className="w-100 h-100 product-image"
                                src={product.mainImage.secure_url}
                                alt={product.name}
                            />
                            <div className="icon-container position-absolute bottom-0 start-50 mb-3 d-flex justify-content-center d-icon">
                                <Link className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 mx-3">
                                    <BsHeart className='icon-animation' />
                                </Link>
                                <Link className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 me-5">
                                    <BsEye className='icon-animation' />
                                </Link>
                            </div>
                        </div>
                        <p className='text-center'>{product.name}</p>
                        <p className='text-center text-secondary'>الكمية: {product.quantity}</p>
                    </div>
                ) : <h2>هناك خطأ</h2>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className='d-flex justify-content-center w-100'>
                    <div className='dir w-50'>
                        <div className='dir d-flex justify-content-center text-center m-3'>
                            <div>
                                <h1>الرجاء إدخال المعلومات التالية</h1>
                                <div>
                                    <input
                                        type='phone'
                                        id='phone'
                                        className='input-style mt-2'
                                        name='phone'
                                        placeholder='رقم الهاتف'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-flex">
                                    <input
                                        type='text'
                                        id='address'
                                        className='input-style mt-2'
                                        name='address'
                                        placeholder='العنوان'
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center pt-4'>
                            <div className="row dir w-75">
                                <h2>هل تمتلك كوبون؟</h2>
                                <p>أضف الرمز الخاص بك للحصول على خصم فوري على عربة التسوق</p>
                                <div className="coupon-form">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={25}
                                        viewBox="0 0 24 25"
                                        fill="none"
                                    >
                                        <path
                                            d="M21.0181 15.3356L20.7727 16.0444H20.7727L21.0181 15.3356ZM21.0181 9.66437L21.2635 10.3731V10.3731L21.0181 9.66437ZM2.98189 15.3356L3.22727 16.0444H3.22727L2.98189 15.3356ZM2.98189 9.66437L2.73652 10.3731L2.73652 10.3731L2.98189 9.66437ZM15.5303 10.0303C15.8232 9.73744 15.8232 9.26256 15.5303 8.96967C15.2374 8.67678 14.7626 8.67678 14.4697 8.96967L15.5303 10.0303ZM8.46967 14.9697C8.17678 15.2626 8.17678 15.7374 8.46967 16.0303C8.76256 16.3232 9.23744 16.3232 9.53033 16.0303L8.46967 14.9697ZM6 20.75C4.20507 20.75 2.75 19.2949 2.75 17.5H1.25C1.25 20.1234 3.37665 22.25 6 22.25V20.75ZM21.25 17.5C21.25 19.2949 19.7949 20.75 18 20.75V22.25C20.6234 22.25 22.75 20.1234 22.75 17.5H21.25ZM18 4.25C19.7949 4.25 21.25 5.70507 21.25 7.5H22.75C22.75 4.87665 20.6234 2.75 18 2.75V4.25ZM6 2.75C3.37665 2.75 1.25 4.87665 1.25 7.5H2.75C2.75 5.70507 4.20507 4.25 6 4.25V2.75ZM21.2635 14.6269C20.3815 14.3216 19.75 13.4836 19.75 12.5H18.25C18.25 14.1424 19.3054 15.5363 20.7727 16.0444L21.2635 14.6269ZM19.75 12.5C19.75 11.5164 20.3815 10.6784 21.2635 10.3731L20.7727 8.95565C19.3054 9.46367 18.25 10.8576 18.25 12.5H19.75ZM4.25 12.5C4.25 13.4836 3.61845 14.3216 2.73652 14.6269L3.22727 16.0444C4.69461 15.5363 5.75 14.1424 5.75 12.5H4.25ZM2.73652 10.3731C3.61845 10.6784 4.25 11.5164 4.25 12.5H5.75C5.75 10.8576 4.69462 9.46367 3.22727 8.95565L2.73652 10.3731ZM22.75 8.5V7.5H21.25V8.5H22.75ZM21.25 16.5V17.5H22.75V16.5H21.25ZM1.25 16.5V17.5H2.75V16.5H1.25ZM2.75 8.5V7.5H1.25V8.5H2.75ZM18 20.75H6V22.25H18V20.75ZM18 2.75H6V4.25H18V2.75ZM2.73652 14.6269C2.05785 14.8619 1.25 15.4975 1.25 16.5H2.75C2.75 16.4441 2.77081 16.3708 2.85172 16.2813C2.9366 16.1873 3.06974 16.0989 3.22727 16.0444L2.73652 14.6269ZM21.2635 10.3731C21.9422 10.1381 22.75 9.50246 22.75 8.5H21.25C21.25 8.55587 21.2292 8.62917 21.1483 8.71871C21.0634 8.81265 20.9303 8.90111 20.7727 8.95565L21.2635 10.3731ZM3.22727 8.95565C3.06974 8.90111 2.9366 8.81265 2.85172 8.71871C2.77081 8.62917 2.75 8.55587 2.75 8.5H1.25C1.25 9.50246 2.05785 10.1381 2.73652 10.3731L3.22727 8.95565ZM20.7727 16.0444C20.9303 16.0989 21.0634 16.1873 21.1483 16.2813C21.2292 16.3708 21.25 16.4441 21.25 16.5H22.75C22.75 15.4975 21.9422 14.8619 21.2635 14.6269L20.7727 16.0444ZM9.25 9.5C9.25 9.63807 9.13807 9.75 9 9.75V11.25C9.9665 11.25 10.75 10.4665 10.75 9.5H9.25ZM9 9.75C8.86193 9.75 8.75 9.63807 8.75 9.5H7.25C7.25 10.4665 8.0335 11.25 9 11.25V9.75ZM8.75 9.5C8.75 9.36193 8.86193 9.25 9 9.25V7.75C8.0335 7.75 7.25 8.5335 7.25 9.5H8.75ZM9 9.25C9.13807 9.25 9.25 9.36193 9.25 9.5H10.75C10.75 8.5335 9.9665 7.75 9 7.75V9.25ZM15.25 15.5C15.25 15.6381 15.1381 15.75 15 15.75V17.25C15.9665 17.25 16.75 16.4665 16.75 15.5H15.25ZM15 15.75C14.8619 15.75 14.75 15.6381 14.75 15.5H13.25C13.25 16.4665 14.0335 17.25 15 17.25V15.75ZM14.75 15.5C14.75 15.3619 14.8619 15.25 15 15.25V13.75C14.0335 13.75 13.25 14.5335 13.25 15.5H14.75ZM15 15.25C15.1381 15.25 15.25 15.3619 15.25 15.5H16.75C16.75 14.5335 15.9665 13.75 15 13.75V15.25ZM14.4697 8.96967L8.46967 14.9697L9.53033 16.0303L15.5303 10.0303L14.4697 8.96967Z"
                                            fill="#6C7275"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="couponCode"
                                        value={formData.couponCode}
                                        onChange={handleChange}
                                    />
                                    <button type="button" className='opacity-75'>أرسل</button>
                                </div>
                            </div>
                        </div>
                        <div className="text-start pt-5">
                            <button className="btn btn-outline-dark" type="submit">تأكيد الطلب</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
