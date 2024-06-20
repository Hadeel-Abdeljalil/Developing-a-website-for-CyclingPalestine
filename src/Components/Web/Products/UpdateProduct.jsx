import React, { useContext, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserContext } from '../Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function UpdateProduct({ item }) {
    const { userToken } = useContext(UserContext);
    const [product, setProduct] = useState(null);
    const [loading, setIsLoading] = useState(false);

    const mainImageInputRef = useRef(null);
    const subImagesInputRef = useRef(null);

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

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true)

            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}product/getDetails/${item}`, {
                    headers: {
                        Authorization: `Rufaidah__${userToken}`,
                    },
                });
                setProduct(data.product);
                setIsLoading(false)

            } catch (error) {
                console.error(error);
                toast.error("فشل في جلب تفاصيل المنتج", toastConfig);
                setIsLoading(false)

            }
        };

        fetchProduct();
    }, [item, userToken]);

    const formik = useFormik({
        initialValues: {
            name: product?.name || '',
            price: product?.price || '',
            description: product?.description || '',
            discount: product?.discount || '',
            stock: product?.stock || '',
            mainImage: null,
            subImages: [],
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsLoading(true)

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
                    formData.append('name', values.name);
                    formData.append('price', values.price);
                    formData.append('description', values.description);
                    formData.append('stock', values.stock);
                    formData.append('discount', values.discount);

                    if (values.mainImage) {
                        formData.append('mainImage', values.mainImage);
                    }

                    if (values.subImages.length > 0) {
                        for (let i = 0; i < values.subImages.length; i++) {
                            formData.append('subImages', values.subImages[i]);
                        }
                    }

                    const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}product/update/${item}`, formData, {
                        headers: {
                            Authorization: `Rufaidah__${userToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (data.message === 'success') {
                        toast.success("تم تعديل المنتج بنجاح", toastConfig);
                        location.reload();
                    } else {
                        toast.error("فشل في تعديل المنتج", toastConfig);
                    }
                }
                setIsLoading(false)

            } catch (error) {
                console.error(error);
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "حدث خطأ ما", toastConfig);
                } else {
                    toast.error("حدث خطأ ما", toastConfig);
                }
                setIsLoading(false)

            }
        },
    });

    const handleMainImageClick = () => {
        mainImageInputRef.current.click();
    };

    const handleSubImagesClick = () => {
        subImagesInputRef.current.click();
    };

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage' && files.length > 0) {
            const mainImageFile = files[0];
            formik.setFieldValue('mainImage', mainImageFile);
        } else if (name === 'subImages' && files.length > 0) {
            const subImagesFiles = Array.from(files);
            formik.setFieldValue('subImages', subImagesFiles);
        }
    };

    return product ? (
        <form className='border shadow bg-white p-3 py-5 dir mt-5' onSubmit={formik.handleSubmit}>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>اسم المنتج:</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>الكمية :</label>
                <input
                    type="number"
                    className="form-control"
                    name="discount"
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>الخصم :</label>
                <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>السعر:</label>
                <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>الوصف:</label>
                <textarea
                    className="form-control"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>اختر الصورة الرئيسية:</label>
                <input
                    type="file"
                    className="form-control"
                    name="mainImage"
                    ref={mainImageInputRef}
                    onChange={handleChange}
                />
                <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleMainImageClick}>
                    اختر  
                </button>
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>اختر الصور الفرعية:</label>
                <input
                    type="file"
                    className="form-control"
                    name="subImages"
                    ref={subImagesInputRef}
                    multiple
                    onChange={handleChange}
                />
                <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleSubImagesClick}>
                    اختر  
                </button>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <button type="submit" className="btn btn-outline-dark">
                    تعديل المنتج
                </button>
            </div>
        </form>
    ) : (
        <p>Loading...</p>
    );
}
