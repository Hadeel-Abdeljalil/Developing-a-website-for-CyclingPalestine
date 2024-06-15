import React, { useContext } from 'react';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserContext } from '../Context/FeatureUser.jsx';
import { toast } from 'react-toastify';

export default function UpdateTrip({ item,val1,val2 }) {
    const { userToken } = useContext(UserContext);

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
                const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}${val1}/update${val2}/${item._id}`, values, {
                    headers: { Authorization: `Rufaidah__${userToken}` }
                });
                console.log(data);
                if (data.message === 'success') {
                    toast.success("تم تعديل الرحلة بنجاح", toastConfig);
                    location.reload()
                } else {
                    toast.error("فشل في تعديل الرحلة", toastConfig);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("حدث خطأ ما", toastConfig);
        }
    }
    const formatDate = (dateString) => {
        // Clean up the date string to remove any unwanted characters
        const cleanedDateString = dateString.split('T')[0]; // Remove <URL> part

        // Attempt to parse the cleaned date string
        const dateObject = new Date(cleanedDateString);
        if (isNaN(dateObject.getTime())) {
            // If parsing fails, return an empty string 
            return '';
        }
        // Format the date in "yyyy-MM-dd" format
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObject.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const initialValues = {
        trackName: item.trackName || '',
        date: formatDate(item.date), // Convert date format
        distance: item.distance || '',
        start_point: item.start_point || '',
        end_point: item.end_point || '',
        difficulty_level: item.difficulty_level || '',
        description: item.description || '',
        maxParticipants: item.maxParticipants || '',
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
    });
    const today = new Date().toISOString().split('T')[0];
    return (
        <form className='border shadowx p-3 py-5 dir' onSubmit={formik.handleSubmit}>
            <div className="form-group justify-content-around mb-2 ">
                <label className='label-width' >اسم المسار:</label>
                <input
                    type="text"
                    className="form-control "
                    name="trackName"
                    value={formik.values.trackName}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            {
                val1 === 'track'?<div className="form-group justify-content-around mb-2">
                <label className='label-width'>التاريخ:</label>
                <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    min={today} // Set the min attribute to today's date
                    required
                />
            </div>:''
            }
            {/* Other form fields */}
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>المسافة:</label>
                <input
                    type="number"
                    className="form-control "
                    name="distance"
                    value={formik.values.distance}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>نقطة البداية:</label>
                <input
                    type="text"
                    className="form-control  "
                    name="start_point"
                    value={formik.values.start_point}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>نقطة النهاية:</label>
                <input
                    type="text"
                    className="form-control "
                    name="end_point"
                    value={formik.values.end_point}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>مستوى الصعوبة:</label>
                <input
                    type="text"
                    className="form-control "
                    name="difficulty_level"
                    value={formik.values.difficulty_level}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>الوصف:</label>
                <textarea
                    className="form-control "
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    required
                />
            </div>
            <div className="form-group justify-content-around mb-2">
                <label className='label-width'>الحد الأقصى للمشاركين:</label>
                <input
                    type="number"
                    className="form-control "
                    name="maxParticipants"
                    value={formik.values.maxParticipants}
                    onChange={formik.handleChange}
                    required
                />
            </div>

            <div className=' d-flex justify-content-end mt-3'>
                <button type="submit" className="btn btn-outline-dark">
                    تعديل مسار
                </button>
            </div>
        </form>
    );
}
