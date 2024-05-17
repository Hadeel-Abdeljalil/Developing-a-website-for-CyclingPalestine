import React, { useContext } from 'react'
import Input from '../../Shared/Input'
import { useFormik } from 'formik'
import { SendCodeSchema } from '../Validation/validation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/FeatureUser';
import '../Home/media.css'

export default function SendCode() {
    const initialValues = {
        email: '',
        
    };
    const navigate = useNavigate();
    const onSubmit = async users => {
        const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}auth/sendcode`, users);
        if (data.message == 'success') {
            toast.success(`تم إرسال الكود بنجاح`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            navigate('/forgotPassword')
        }
    }
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit,
        validationSchema: SendCodeSchema
    })
    const inputs = [
        {
            type: 'email',
            id: 'email',
            name: 'email',
            title: 'User Email',
            placeholder: 'أدخل البريد الإلكتروني',
            value: formik.values.email,
        },
        
    ]
    const renderInputs = inputs.map((input, index) =>
        <Input type={input.type}
            id={input.id}
            name={input.name}
            title={input.title}
            placeholder={input.placeholder}
            key={index}
            errors={formik.errors}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched}
        />
    )
    return (
        <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="sign-width sign-in-form text-center m-5 border border-2 rounded-2">
            <form onSubmit={formik.handleSubmit} >
                <div className="d-flex align-items-center flex-column my-5">
                    <h3 className="my-1 mb-4">  أدخل البريد الإلكتروني </h3>
                    <div className="text-end d-flex align-items-center flex-column input-width media-input-style ">
                        {renderInputs}
                        <div className="form-group">
                            <button className="button" type="submit">تأكيد</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    )
}
