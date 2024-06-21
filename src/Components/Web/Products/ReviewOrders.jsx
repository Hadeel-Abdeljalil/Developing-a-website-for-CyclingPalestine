import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import { UserContext } from '../Context/FeatureUser';
import Input from '../../Shared/Input';
import * as Yup from 'yup';
import Popup from 'reactjs-popup';
import "./Products.css"

export default function ReviewOrders({ productId }) {
    const { userToken, userData } = useContext(UserContext);
    const [comments, setComments] = useState([]);

    const initialValues = {
        comment: '',
        rating: '',
    };

    const validationSchema = Yup.object({
        comment: Yup.string().required('comment is required'),
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
                { comment: values.comment, rating: formik.values.rating },
                { headers: { Authorization: `Rufaidah__${token}` } }
            );

            if (data.message === 'success') {
                resetForm();
                location.reload()
                setComments(prevComments => [...prevComments, { comment: values.comment, _id: data.commentId }]);
            }
        } catch (error) {
            if (error.response.data.message == "already reviewed this product") {
                toast.warning("لقد قمت بالفعل بمراجعة هذا المنتج", toastConfig)
            } else {
                toast.error('حدث خطأ أثناء إضافة تعليقك', toastConfig);
            }
            console.log(error)
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
            id: 'comment',
            name: 'comment',
            title: 'comment',
            placeholder: 'أكتب تعليق',
            value: formik.values.comment,
        },
        {
            type: 'number',
            id: 'rating',
            name: 'rating',
            title: 'Rating',
            placeholder: ' تقييمك من 0-5',
            value: formik.values.rating,
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

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}product/${productId}/review`);
            setComments(data.reviews)
            return data.reviews || [];
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

    const handleDeleteComment = async (reviewId) => {
        console.log(reviewId)
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}product/${productId}/review/${reviewId}`,
                { headers: { Authorization: `Rufaidah__${userToken}` } }
            );
            if (data.message === "success") {
                location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleEditComment = async (reviewId)=>{
        try{
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}product/${productId}/review/${reviewId}`,
                { headers: { Authorization: `Rufaidah__${userToken}` } }
            );
            console.log(data)
            if (data.message === "success") {
                location.reload()
            }
            }catch(error){
                console.log(error)
        }
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
                            {formik.errors.comment && formik.touched.comment ? (
                                <div className="error">{formik.errors.comment}</div>
                            ) : null}
                        </div>
                    ) : (
                        <div>يرجى تسجيل الدخول لإضافة تعليق</div>
                    )}
                </form>
                <div className="comments-section">
                    {comments.map(comment => (
                        <div key={comment._id} className="text-end d-flex dir">
                            <img src={comment?.userId?.image?.secure_url || '/images/profile.jpeg'} alt="user" className="rounded-circle comment-image ms-1 " />
                            <div>
                                <div className='d-flex'>
                                    <p className="p-0 m-0 mb-1">{comment?.userId?.userName ? comment?.userId?.userName : ""}</p>
                                    <p>
                                        {Array.from({ length: comment.rating }, (_, index) => (
                                            <svg
                                                height="800px"
                                                width="800px"
                                                version="1.1"
                                                id="Capa_1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                viewBox="0 0 47.94 47.94"
                                                xmlSpace="preserve"
                                                key={index}
                                            >
                                                <path
                                                    fill="#ED8A19"
                                                    d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
                                                />
                                            </svg>
                                        ))}
                                    </p>
                                </div>
                                <div className='d-flex comment-text'>
                                    <p className="bg-body-tertiary mx-2 p-3 rounded-4">{comment.comment}</p>
                                    {comment?.userId?._id === userData._id && (
                                       <Popup trigger={<p className='d-flex align-items-center pointer'>...</p>}>
                                       <ul className='list-unstyled bg-white shadow p-1 rounded-2 '>
                                        {/* <Popup trigger={<li className='pointer p-1' onClick={() => handleEditComment(comment._id)}>تعديل</li>}
                                        >
                                        </Popup> */}
                                           <li className='pointer p-1' onClick={() => handleDeleteComment(comment._id)}>حذف</li>
                                       </ul>
                                   </Popup>
                                   
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}