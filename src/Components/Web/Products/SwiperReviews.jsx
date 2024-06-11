import React from 'react';
import './SwiperProduct.css';
import Popup from 'reactjs-popup';

export default function ({ data }) {
  const handleDeleteComment = (commentId) => {
    // Implement your delete comment logic here
    console.log(`Deleting comment with id: ${commentId}`);
  };

  return (
    <div className="comment-container">
      {data.comments?.length ? (
        <div className="comment-list">
          {data.comments.map((review) => (
            <div key={review._id} className=" text-end d-flex dir">
              <img src={review.userImage.secure_url} alt="user" className="rounded-circle comment-image ms-1" />
              <div className="">
                <p className="p-0 m-0 mb-1">{review.userName}</p>
                <div className='d-flex comment-text'>
                  <p className=" bg-body-tertiary mx-2 p-3">{review.text}</p>
                  <Popup
                    trigger={<p className='d-flex align-items-center del'>...</p>}
                  >
                    <div className='shadow bg-white p-2 rounded-2 '>
                      <button className='border-0 bg-white d-block pb-1'>تعديل</button>
                      <button className='border-0 bg-white d-block'>حذف</button>
                    </div>
                  </Popup>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-comments">لا يوجد تعليقات</p>
      )}
    </div>
  );
}
