import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios'; // Import Axios for making HTTP requests

export default function Contacts() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to backend server
      await axios.post(`${import.meta.env.VITE_API_URL}sendEmail`, { email, name, message });
      alert('تم إرسال الرسالة بنجاح');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('فشل في إرسال الرسالة. الرجاء معاودة المحاولة في وقت لاحق.');
    }
  };

  return (
    <>
      <section className="contact-us text-center p-5" id="contact-us">
        <div className="d-flex pt-5 justify-content-center">
          <div className="title text-start position-relative mb-3">
            <h2 className="mt-2 fw-bold text-white border-bottom pb-3">!ابقى على تواصل</h2>
          </div>
        </div>
        <div className="container">
          <p className="py-4 dir text-white fw-bold">يسعدنا أن نستمع لآرائكم ومقترحاتكم، فلا تترددوا في إرسال ملاحظاتكم ومشاركتنا أفكاركم. شكرًا لثقتكم بنا ولمشاركتكم في رحلتنا على البسكليت!</p>
          <form className="w-75 m-auto" onSubmit={handleSubmit}>
            <div className="row">
              <div className="mb-3  col-md-6">
                <input type="email" className="form-control bg-transparent border-0 border-bottom  dir text-white " placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3 col-md-6">
                <input type="text" className="form-control bg-transparent border-0 border-bottom  dir text-white" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="mb-3">
              <input type="text" className="form-control bg-transparent border-0 border-bottom dir text-white" placeholder="العنوان" data-listener-added_63a69070="true" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="mb-3">
              <textarea className="form-control bg-transparent border-0 border-bottom rounded-0 dir text-white" placeholder="رسالتك.." id="floatingTextare" style={{ height: 100 }} data-gramm="false" wt-ignore-input="true" defaultValue={""} />
            </div>
            {/* Submit button */}
            <button type="submit" className="text-decoration-none d-inline-block rounded-pill bg-white ">
              <div className='d-flex justify-align-content-center'>
                <span className=" px-3 py-2">أرسل</span>
                <FontAwesomeIcon icon={faEnvelope} className="p-3 bg-dark text-white eye-icon rounded-pill " />
              </div>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
