import React, { useContext, useRef, useState } from 'react';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserContext } from '../Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function UpdatePost({ item}) {
    const { userToken } = useContext(UserContext);
    const mainImageInputRef = useRef(null);

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

    const onSubmit = async (values) => {
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
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description);

                if (values.mainImage instanceof File) {
                    formData.append('mainImage', values.mainImage);
                } else {
                    formData.append('mainImage', JSON.stringify(values.mainImage));
                }

                const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}post/update/${item._id}`, formData, {
                    headers: { 
                        Authorization: `Rufaidah__${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (data.message === 'success') {
                    toast.success("تم تعديل الرحلة بنجاح", toastConfig);
                    location.reload();
                } else {
                    toast.error("فشل في تعديل الرحلة", toastConfig);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("حدث خطأ ما", toastConfig);
        }
    }

    const formik = useFormik({
        initialValues: {
            title: item.title || '',
            description: item.description || '',
            mainImage: item.mainImage || null,
        },
        onSubmit,
    });

    const handleMainImageClick = () => {
        mainImageInputRef.current.click();
    };

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage' && files.length > 0) {
            const mainImageFile = files[0];
            formik.setFieldValue('mainImage', mainImageFile);
        }
    };

    return (
        <form className='border shadow bg-white p-3 py-5 dir' onSubmit={formik.handleSubmit}>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>اسم المسار:</label>
                <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>الوصف :</label>
                <textarea
                    className="form-control "
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>اختر الصورة:</label>
                <input
                    type="file"
                    className="form-control"
                    name="mainImage"
                    ref={mainImageInputRef}
                    onChange={handleChange}
                    required
                />
                <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleMainImageClick}>
                    اختر الصورة
                </button>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <button type="submit" className="btn btn-outline-dark">
                    تعديل مسار
                </button>
            </div>
        </form>
    );
}
