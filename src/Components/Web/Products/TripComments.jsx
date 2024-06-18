import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import { UserContext } from '../Context/FeatureUser';
import Input from '../../Shared/Input';
import * as Yup from 'yup';
import Popup from 'reactjs-popup';

export default function TripComments({ postId }) {
    const { userToken, userData } = useContext(UserContext);
    const [comments, setComments] = useState([]);

    const validationSchema = Yup.object({ text: Yup.string().required('Text is required') });

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
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}post/comment/${postId}`,
                { text: values.text },
                { headers: { Authorization: `Rufaidah__${token}` } }
            );
            if (data.message === 'success') {
                resetForm();
                setComments(prev => [...prev, { text: values.text, _id: data.commentId }]);
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء إضافة تعليقك', toastConfig);
        }
    };

    const formik = useFormik({ initialValues: { text: '' }, validationSchema, onSubmit });

    const renderInputs = (
        <Input
            type="text"
            id="text"
            name="text"
            title="text"
            value={formik.values.text}
            errors={formik.errors}
            placeholder='أكتب تعليق'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched}
            autocomplete="text"
        />
    );

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}post/getDetails/${postId}`);
            return data.post.comments.reverse() || [];
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    const { data: initialComments, isLoading: isCommentsLoading } = useQuery('fetch-comments', fetchComments, {
        onSuccess: (data) => setComments(data),
    });

    if (isCommentsLoading) {
        return (
            <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
                <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
            </div>
        );
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}post/deleteComment/${commentId}`,
                { headers: { Authorization: `Rufaidah__${userToken}` } }
            );

            if (data.message === "comment deleted successfully") {
                location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='d-flex justify-content-end '>
            <div className='w-100 dir'>
                <form onSubmit={formik.handleSubmit}>
                    {userToken ? (
                        <div className='w-50'>
                            {renderInputs}
                            <div className='text-start'>
                                <button className="btn " type="submit">
                                    انشر تعليقك
                                </button>
                            </div>
                            {formik.errors.text && formik.touched.text ? (
                                <div className="error">{formik.errors.text}</div>
                            ) : null}
                        </div>
                    ) : (
                        <div className='dir'>يرجى تسجيل الدخول لإضافة تعليق</div>
                    )}
                </form>
                <div className="comment-container">
                    {comments?.length ? (
                        <div className="comment-list">
                            {comments.map((review, index) => (
                                <div key={index} className="text-end d-flex dir">
                                    <img src={review?.userImage?.secure_url || '/images/profile.jpeg'} alt="user" className="rounded-circle comment-image ms-1" />
                                    <div>
                                        <p className="p-0 m-0 mb-1">{review.userName}</p>
                                        <div className='d-flex comment-text'>
                                            <p className="bg-body-tertiary mx-2 p-3">{review.text}</p>
                                            {review.user_id === userData._id && (
                                                <Popup trigger={<p className='d-flex align-items-center del'>...</p>}>
                                                    <button className='border-0 bg-white d-block shadow bg-white p-2 rounded-2' onClick={() => handleDeleteComment(review._id)}>حذف</button>
                                                </Popup>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-comments">لا يوجد تعليقات</p>
                    )}
                </div>

            </div>
        </div>
    );
}
