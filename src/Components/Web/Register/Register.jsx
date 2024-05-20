import React from 'react';
import { useFormik } from 'formik';
import { registerSchema } from '../Validation/validation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Home/media.css';
import Input from '../../Shared/Input.jsx';

export default function Register() {
    const initialValues = {
        userName: '',
        email: '',
        password: '',
        cPassword: '',
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

    const onSubmit = async (users) => {
        try {
            const payload = {
                userName: users.userName,
                email: users.email,
                password: users.password,
                cPassword: users.cPassword,
            };
    
            const { data } = await axios.post(`https://ecommerce-node4-five.vercel.app/auth/signup`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (data.message === 'success') {
                formik.resetForm();
                toast.success('تم إنشاء الحساب بنجاح', toastConfig);
            } else {
                toast.error('حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.', toastConfig);
                console.error('Server Response:', data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios Error:', error.response?.data || error.message);
                if (error.response?.data?.validationError) {
                    console.error('Validation Errors:', error.response.data.validationError);
                    toast.error(`Validation Error: ${error.response.data.validationError.map(err => err.details.map(detail => detail.message).join(', ')).join(', ')}`, toastConfig);
                } else {
                    toast.error(`Error: ${error.response?.data?.message || error.message}`, toastConfig);
                }
            } else {
                console.error('Unexpected Error:', error);
                toast.error('حدث خطأ أثناء الاتصال بالخادم. الرجاء المحاولة مرة أخرى.', toastConfig);
            }
        }
    };
    

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit,
        validationSchema: registerSchema,
    });

    const inputs = [
        {
            type: 'text',
            id: 'userName',
            name: 'userName',
            title: 'User Name',
            placeholder: 'اسم المستخدم',
            value: formik.values.userName,
            autoComplete: 'new-username' // Unique autoComplete value
        },
        {
            type: 'email',
            id: 'email',
            name: 'email',
            title: 'User Email',
            placeholder: 'البريد الإلكتروني',
            value: formik.values.email,
            autoComplete: 'new-email' // Unique autoComplete value
        },
        {
            type: 'password',
            id: 'password',
            name: 'password',
            title: 'User Password',
            placeholder: 'كلمة المرور',
            value: formik.values.password,
            autoComplete: 'new-password' // Unique autoComplete value
        },
        {
            type: 'password',
            id: 'cPassword',
            name: 'cPassword',
            title: 'Confirm Password',
            placeholder: 'تأكيد كلمة المرور',
            value: formik.values.cPassword,
            autoComplete: 'new-confirm-password' // Unique autoComplete value
        }
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
            autoComplete={input.autoComplete}
        />
    ));


    return (
        <div className="vh-100 d-flex">
            <div className="sign-img-shadow flex-grow-1">
                <div className="sign-img w-100 float-start vh-100"></div>
            </div>

            <div className="sign-width sign-in-form text-center m-5">
                <img src="/images/bicycle.png" alt="bicycle logo" />

                <h1 className="mb-5">أنشئ حسابك</h1>
                <div className="social-icons">
                    <FontAwesomeIcon icon={faGooglePlusG} className="icon m-1 mb-0" />
                    <FontAwesomeIcon icon={faFacebookF} className="icon m-1 mb-0" />
                </div>

                <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="d-flex align-items-center flex-column">
                        <p className="my-1">التسجيل باستخدام البريد أو الهاتف</p>
                        <div className="text-end d-flex align-items-center flex-column input-width media-input-style">
                            {renderInputs}
                            <div className="form-group">
                                <button className="button" type="submit" disabled={!formik.isValid}>إنشاء حساب</button>
                            </div>
                        </div>
                    </div>

                    <div className="register-links">
                        <p>
                            <a href="/login">تسجيل دخول</a>
                        </p>
                        <p>هل تمتلك حساب؟</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
