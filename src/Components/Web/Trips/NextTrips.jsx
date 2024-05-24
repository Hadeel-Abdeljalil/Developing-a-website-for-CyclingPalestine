import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Data } from './Data.jsx';
import './Trips.css';
import { BsHeart } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function NextTrips() {
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 5; 

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);
  };

  const formatDate = (dateStr) => {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const filteredTrips = Data.filter((item) => {
    const formattedDate = formatDate(item.date);
    const matchesDate = searchDate === '' || formattedDate === searchDate;
    const matchesName = searchName.toLowerCase() === '' || item.name.toLowerCase().includes(searchName.toLowerCase());
    return matchesDate && matchesName;
  });

  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);
  const currentTrips = filteredTrips.slice((currentPage - 1) * tripsPerPage, currentPage * tripsPerPage);

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
              <Link
               key={item.id}
               to={`/trip/${item.id}`}
                className='row border rounded-2 border-2 color p-3 mt-3'>
                <div className='col-lg-3'>
                  <img className='w-100 h-100 rounded-2' src={item.image} alt="" />
                </div>
                <div className='col-lg-5 d-flex flex-column justify-content-between'>
                  <h2>{item.name}</h2>
                  <p>{item.text}</p>
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
                  <p>{item.date}</p>
                  <Link to='/tripView' className='btn bg-color text-white w-50 rounded-2 p-2'>شاهد</Link>
                </div>
              </Link>
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
