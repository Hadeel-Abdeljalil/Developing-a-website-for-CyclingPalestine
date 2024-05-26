import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/FeatureUser.jsx';
import './Trips.css';
import { BsHeart } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Popup from 'reactjs-popup';

export default function NextTrips() {
  const { loading, userToken } = useContext(UserContext);
  const [tracks, setTracks] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 5;
  const [isPatecipate,setIsPartecipate] =useState(false);

  useEffect(() => {
    const getTracks = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}track/allTracks`);
        setTracks(data.tracks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getTracks();
  }, []);

  if (loading) {
    return (
      <div className="loading bg-white position-fixed vh-100 w-100 d-flex justify-content-center align-items-center z-3">
        <span className="loader"></span>
      </div>
    );
  }

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);
  };

  const filteredTrips = tracks.filter((item) => {
    const matchesDate = searchDate === '' || item.date === searchDate;
    const matchesName = searchName.toLowerCase() === '' || item.trackName.toLowerCase().includes(searchName.toLowerCase());
    return matchesDate && matchesName;
  });

  const formatDate = (dateStr) => {
    // Extract the date part from the ISO string (YYYY-MM-DD)
    return dateStr.split('T')[0];
  };

  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);
  const currentTrips = filteredTrips.slice((currentPage - 1) * tripsPerPage, currentPage * tripsPerPage);

  const handelparticipating = async (trackId) => {
    try {
      const response = await axios.post( `${import.meta.env.VITE_API_URL}track/${trackId}/participating`, {}, 
        { headers: { Authorization: `Rufaidah__${userToken}` } }
      );
      console.log(response.data);
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };
  
  return (
    <div className='container '>
      <div className='d-flex justify-content-end pe-5 me-5'>
        <div className='d-flex justify-content-end w-50'>
          <input
            type="date"
            id="searchDate"
            className='my-5 mx-1 border border-secondary rounded shadow-bottom input'
            placeholder="التاريخ"
            onChange={handleDateChange}
          />
          <input
            type="search"
            id="searchName"
            className='my-5 mx-1 border border-secondary rounded shadow-bottom input'
            placeholder="مكان الرحلة /  الإسم"
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>
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
          {
            currentTrips.map((item) => (
              <div
                key={item.id}
                to={`/trip/${item.id}`}
                className='row border rounded-2 border-2 color p-3 mt-3'
              >
                <div className='col-lg-3'>
                  <img className='fixed-image rounded-2' src={item.image ? item.image : '/images/back.jpg'} alt={item.trackName} />
                </div>
                <div className='col-lg-5 d-flex flex-column justify-content-between'>
                  <div className='d-flex'>
                    <h2>{item.trackName}</h2>
                    <p className='text-dark pt-2 pe-3'> {item.difficulty_level}</p>
                  </div>
                  <div>
                    <div className='d-flex'>
                      <p className='text-dark'>عدد المشاركين({item.number_of_participants})</p>
                      <div className=''>
                        <Popup
                          trigger={<Link className='small me-3 color'>عرض المزيد</Link>}
                          position="center center"
                        >
                          <div className='border shadow bg-white p-3 rounded-3'>
                          <h2>{item.trackName}</h2>
                          <div
                            className=' dir'
                            style={{ width: '50vw', padding: '20px' }}
                          >
                            <p><strong>مستوى الصعوبة:</strong> {item.difficulty_level}</p>
                            <p><strong>المسافة:</strong> {item.distance} km</p>
                            <p><strong>نقطة البداية:</strong> {item.start_point}</p>
                            <p><strong>نقطة النهاية:</strong> {item.end_point}</p>
                            <p><strong>تاريخ الإنشاء:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                            <p><strong>تاريخ التحديث:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
                            <p><strong>تاريخ:</strong> {new Date(item.date).toLocaleString()}</p>
                            <p><strong>عدد المشاركين:</strong> {item.number_of_participants}</p>
                            <p><strong>الحد الأقصى للمشاركين:</strong> {item.maxParticipants}</p>
                            <p><strong>وصف:</strong> {item.description}</p>
                          </div>
                          </div>
                          
                        </Popup>
                      </div>
                    </div>
                  </div>
                  <div className='d-flex'>
                    <div className='text-danger p-2 mx-1'>
                      <BsHeart />
                    </div>
                    <div className='p-2 color'>|</div>
                    <div className='color p-2 mx-1'>
                      <FaComment />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 dir2 d-flex flex-column justify-content-between'>
                  <p>{formatDate(item.date)}</p>
                  <button to='/tripView' className='btn bg-color text-white w-50 rounded-2 p-2' onClick={()=>handelparticipating(item._id)}>شارك</button>
                </div>
              </div>
            ))
          }
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
