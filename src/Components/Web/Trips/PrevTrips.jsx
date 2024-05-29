import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/FeatureUser.jsx';
import './Trips.css';
import { BsHeart } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import UpdateTrip from './UpdateTrip.jsx';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function PrevTrips() {
  const { loading, userData,userToken } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;
  const role=userData?.role;

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}post/`);
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading bg-white w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <span className="loader"></span>
      </div>
    );
  }

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

  const deletePost = async (postId) => {
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
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}post/delete/${postId}`,
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );
        console.log(data)
        if (data.message == 'success') {
          toast.success("تم حذف الرحلة بنجاح", toastConfig);
          location.reload()
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  const totalPages = Math.ceil(posts.length / tripsPerPage);
  const sortedTrips = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentTrips = sortedTrips.slice((currentPage - 1) * tripsPerPage, currentPage * tripsPerPage);

  return (
    <div className='container'>
      <div className="d-flex justify-content-center ">
        <Stack spacing={3}>
          <Pagination
            count={totalPages}
            variant="outlined"
            shape="rounded"
            color="standard"
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Stack>
      </div>

      <div className='dir mb-3 mt-2'>
        <div className='container-fluid flex-column justify-content-center w-75'>
          {currentTrips.map((item) => (
            <div
              key={item.id}
              className='row border rounded-2 border-2 color p-3 mt-3'
            >
              <div className='col-lg-3'>
                <img
                  className='fixed-image rounded-2'
                  src={item.image ? item.image : '/images/back.jpg'}
                  alt={item.title}
                />
              </div>
              <div className='col-lg-4 d-flex flex-column justify-content-between'>
                <h2>{item.title}</h2>
                <div className='d-flex'>
                  <div className='text-danger p-2 mx-1'>
                    <BsHeart />
                  </div>
                  <div className='p-2 color'>|</div>
                  <div className=' p-2 mx-1'>
                    <FaComment />
                  </div>
                </div>
              </div>
              <div className='col-lg-5  dir2 d-flex flex-column justify-content-between'>
                <p></p>

                <div>
                  {
                    role == "Admin" ? (
                      <div className='d-flex mb-2  w-50'>
                        <Popup
                          trigger={<button
                            className='btn bg-white text-info btn-outline-info w-50 me-1 rounded-2 p-2 mx-1'     
                          >
                            تعديل
                          </button>}
                          position='center center'
                        >
                          <UpdateTrip
                          item={item}
                          postId={item._id}/>
                        </Popup>
                        <button
                          className='btn bg-white text-danger btn-outline-danger w-50 me-1 rounded-2 p-2 '
                          onClick={() => deletePost(item._id)}>
                          حذف
                        </button></div>
                    ) : ""
                  }

                  <div>
                 
                      <button
                        className='btn bg-color text-white w-50 rounded-2 p-2'
                        >
                         شاهد
                      </button>
                    
                     
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center mb-5">
        <Stack spacing={3}>
          <Pagination
            count={totalPages}
            variant="outlined"
            shape="rounded"
            color="standard"
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Stack>
      </div>
    </div>
  );
}
