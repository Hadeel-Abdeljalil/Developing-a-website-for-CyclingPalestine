import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/FeatureUser.jsx';
import './Trips.css';
import { BsHeart } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

export default function PrevTrips() {
  const { loading, userData } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;

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
              <div className='col-lg-5 dir2 d-flex flex-column justify-content-between'>
                <p></p>
              <Link to={`/trip/${item._id}`}>  <button
                        className='btn bg-color text-white w-50 rounded-2 p-2'
                        >
                    شاهد      
                </button></Link>
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
