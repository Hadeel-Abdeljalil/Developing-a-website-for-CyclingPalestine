import React from 'react'
import Input from '../../Shared/Input'
import { useFormik } from 'formik'
import { forgotPasswordSchema, registerSchema } from '../Validation/validation';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../Home/media.css'
import { useNavigate } from 'react-router-dom';
export default function ForgotPassword() {
    const initialValues = {
        email: '',
        password: '',
        code: '',
    };
    const navigate = useNavigate();
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
    const onSubmit = async users => {
        const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}auth/forgotPassword`, users);
        if (data.message == 'success') {

            toast.success(`تم تغيير كلمة السر بنجاح`, toastConfig);
            navigate('/')
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit,
        validationSchema: forgotPasswordSchema
    })

    const inputs = [
        {
            type: 'email',
            id: 'email',
            name: 'email',
            title: 'User Email',
            placeholder: 'البريد الإلكتروني',
            value: formik.values.email,
        },
        {
            type: 'password',
            id: 'password',
            name: 'password',
            title: 'User Password',
            placeholder: 'كلمة المرور',
            value: formik.values.password,
        },
        {
            type: 'text',
            id: 'code',
            name: 'code',
            title: 'Code',
            placeholder: 'أدخل الكود',
            value: formik.values.code,
        },
    ]


    const renderInputs = inputs.map((input, index) =>
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
    )

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center">
            <div className="sign-width sign-in-form text-center m-5 ">
                <form onSubmit={formik.handleSubmit} >
                    <div className="d-flex align-items-center flex-column">
                        <h3 className="my-1">التسجيل باستخدام البريد أو الهاتف</h3>
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
