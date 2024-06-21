import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import { UserContext } from '../Context/FeatureUser';
import Input from '../../Shared/Input';
import * as Yup from 'yup';

export default function ReviewOrders({ productId }) {
    const { getUserOrdersContext, userToken } = useContext(UserContext);
    const [comments, setComments] = useState([]);

    const initialValues = {
        text: '',
    };

    const validationSchema = Yup.object({
        text: Yup.string().required('Text is required'),
    });

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

    const onSubmit = async (values, { resetForm }) => {
        const token = localStorage.getItem('userToken');
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}product/${productId}/review`, 
                { text: values.text },
                { headers: { Authorization: `Rufaidah__${token}` } }
            );
            if (data.message === 'success') {
                resetForm();
                setComments(prevComments => [...prevComments, { text: values.text, _id: data.commentId }]);
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء إضافة تعليقك', toastConfig);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const inputs = [
        {
            type: 'text',
            id: 'text',
            name: 'text',
            title: 'text',
            placeholder: 'أكتب تعليق',
            value: formik.values.text,
        },
    ];

    const renderInputs = inputs.map((input, index) => (
        <Input
            key={index}
            type={input.type}
            id={input.id}
            name={input.name}
            title={input.title}
            value={input.value}
            errors={formik.errors}
            placeholder={input.placeholder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched}
            autocomplete={input.name}
        />
    ));

    const getUserOrders = async () => {
        try {
            const res = await getUserOrdersContext();
            return res.orders || [];
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return [];
        }
    };

    const { data: orders, isLoading: isOrdersLoading } = useQuery('get-user-orders', getUserOrders);

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`https://cycling-palestine.onrender.com/post/comments/${productId}`);
            return data.comments || [];
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    const { data: initialComments, isLoading: isCommentsLoading } = useQuery('fetch-comments', fetchComments, {
        onSuccess: (data) => setComments(data),
    });

    if (isOrdersLoading || isCommentsLoading) {
        return (
            <div className="loading bg-transfer w-100 d-flex justify-content-center align-items-center z-3">
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <div className='d-flex justify-content-end '>
            <div className='w-100'>
                <form onSubmit={formik.handleSubmit}>
                    {userToken ? (
                        <div>
                            {renderInputs}
                            <div>
                                <button className="btn" type="submit">
                                    انشر تعليقك
                                </button>
                            </div>
                            {formik.errors.text && formik.touched.text ? (
                                <div className="error">{formik.errors.text}</div>
                            ) : null}
                        </div>
                    ) : (
                        <div>يرجى تسجيل الدخول لإضافة تعليق</div>
                    )}
                </form>
                <div className="comments-section">
                    {comments.map(comment => (
                        <div key={comment._id} className="comment">
                            {comment.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}