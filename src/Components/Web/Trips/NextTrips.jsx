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
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Trips from '../../Dashboard/Home/Trips/Trips.jsx';
import UpdateTrip from './UpdateTrip.jsx';
import Comment from './Comment.jsx';
import Likes from '../Likes/Likes.jsx';

export default function NextTrips() {
  const { userToken, userData } = useContext(UserContext);
  const [tracks, setTracks] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [details, setDetails] = useState(null)
  const [loading, setIsLoading] = useState(false);
  const tripsPerPage = 6;
  const role = userData?.role;

  useEffect(() => {
    const getTracks = async () => {
      try {
        setIsLoading(true)

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}track/allTracks?page=${currentPage}&limit=${tripsPerPage}`,
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );
        console.log(data)
        setTracks(data.tracks);
        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getTracks();
  }, [currentPage, tripsPerPage, userToken]);

  if (loading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
      </div>

    );
  }

  const getDetails = async (trackId) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}track/getDetails/${trackId}`);
      setDetails(data.track.participants)
    } catch (error) {
      console.log(error)
    }
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
    return dateStr.split('T')[0];
  };

  const cancelparticipating = async (trackId) => {
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
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}track/${trackId}/participating/cancel`, {
          headers: { Authorization: `Rufaidah__${userToken}` }
        });
        
        const data = response.data;
  
        if (data.message === 'You have successfully canceled your subscription to this track') {
          toast.success("تم الغاء المشاركة في هذا المسار", toastConfig);
          location.reload()
        } else {
          toast.error("حدث خطأ أثناء إلغاء المشاركة", toastConfig);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("غير مصرح، يرجى تسجيل الدخول مرة أخرى", toastConfig);
      } else {
        toast.error("حدث خطأ غير متوقع", toastConfig);
      }
      console.error(error);
    }
  };
  
  const handelparticipating = async (trackId) => {
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
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}track/${trackId}/participating`,
          {},
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );
        // console.log(response)
        console.log(userToken)
        if (response.data.message === 'success') {
          toast.success("تمت المشاركة بنجاح", toastConfig);
          location.reload();
        } 
      }
    } catch (error) {
      if(error.response.data?.message=="Your age is less than the permissible limit"){
        toast.warn("عمرك أقل من الحد المسموح به ", toastConfig);
      }else  if(error.response.data?.message=="Enter your date of birth in your profile plz"){
        toast.warn("أدخل تاريخ ميلادك في ملفك الشخصي من فضلك ", toastConfig);
      } else if (error.response.data?.message == 'Sorry! The track is full.') {
        toast.warn("نأسف!  العدد اكتمل.", toastConfig);
      }else if (error.response.data?.message == 'this track is finished') {
        toast.warn("تم الانتهاء من هذا المسار", toastConfig);
      } else if (error.response.data?.message == 'You have already participated in this track.') {
        toast.warn("انت مشارك بالفعل في هذا المسار", toastConfig);
      }
      console.error(error.response.data.message);
    }
  };


  const check = (item) => {  
    // Ensure item and participants array are defined before calling some
    if (item?.participants) {
      return item.participants.some(participant => participant?.user_id === userData?._id);
    }
    return false;
  };
  
  const deleteTrack = async (trackId) => {
    console.log(trackId)
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
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}track/delete/${trackId}`,
          { headers: { Authorization: `Rufaidah__${userToken}` } }
        );
        if (data.message == 'success') {
          toast.success("تم حذف الرحلة بنجاح", toastConfig);
        }
        location.reload();
      }

    } catch (error) {
      console.log(error)
    }
  }

  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);
  const sortedTrips = filteredTrips.sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentTrips = sortedTrips.slice((currentPage - 1) * tripsPerPage, currentPage * tripsPerPage);

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
          {currentTrips?.map((item) => (

            <div
              key={item.id}
              className='row border rounded-2 border-2 color p-3 mt-3 shadow'
            >
              <div className='col-lg-3'>
                <img
                  className='fixed-image rounded-2'
                  src={item.image ? item.image : '/images/main.jpg'}
                  alt={item.trackName}
                />
              </div>
              <div className='col-lg-4 d-flex flex-column justify-content-between'>
                <div className='d-flex'>
                  <h2>{item.trackName}</h2>
                  <p className='text-dark pt-2 pe-3'>{item.difficulty_level}</p>
                </div>
                <div >
                  <div className='d-flex'>
                    <div>
                      <Popup
                        trigger={<button className='text-dark border-0 bg-white'> المشاركين({item.number_of_participants})</button>}
                        onOpen={() => getDetails(item.id)}
                        position='center center'
                        className='custom-popup'
                      >
                        {
                          role === "Admin" ?
                            <div className='table-container dir'>
                              {details && details.length > 0 ? (
                                <table className='custom-table'>
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>الاسم</th>
                                      <th>الهاتف</th>
                                      <th>البريد الالكتروني</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {details.map((x, index) => (
                                      <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.name}</td>
                                        <td>{x.phone}</td>
                                        <td>{x.email}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div className='no-data'>لا توجد بيانات للعرض</div>
                              )}
                            </div>
                            : ''
                        }
                      </Popup>
                    </div>

                    <div>
                      <Popup
                        trigger={<Link className='small me-3 color'>عرض المزيد</Link>}
                        position='center center'
                        className='custom-popup'
                      >
                        <div className='border shadow bg-white p-3 rounded-3 custom-popup-content'>
                          <div className='w-100 d-flex justify-content-center'>
                            <h2 className='dir'>{item.trackName}</h2>
                          </div>
                          <div className='dir' style={{ width: '50vw', padding: '20px' }}>
                            <p><strong>مستوى الصعوبة:</strong> {item.difficulty_level}</p>
                            <p><strong>المسافة:</strong> {item.distance} km</p>
                            <p><strong>نقطة البداية:</strong> {item.start_point}</p>
                            <p><strong>نقطة النهاية:</strong> {item.end_point}</p>
                            <p><strong>تاريخ الإنشاء:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                            <p><strong>تاريخ التحديث:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
                            <p><strong>تاريخ:</strong> {new Date(item.date).toLocaleString()}</p>
                            <p><strong>عدد المشاركين:</strong> {item.number_of_participants}</p>
                            <p><strong>الحد الأقصى للمشاركين:</strong> {item.maxParticipants}</p>
                            <p className='w-100' style={{ wordWrap: 'break-word', maxWidth: '100%' }}>
                              <strong>وصف:</strong> {item.description}
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </div>

                  </div>
                </div>
                <div className='d-flex'>
                  <div className='text-danger  mx-1'>
                    <Likes tripId={item._id} val={"track"} />
                  </div>
                  <div className='p-2 color'>|</div>
                  <Popup
                    trigger={<div className='color p-2 mx-1'>
                      <FaComment />
                    </div>}
                    position='center center'
                  >
                    <Comment
                      item={item} val={"post"} />
                  </Popup>
                </div>
              </div>
              <div className='col-lg-5  dir2 d-flex flex-column justify-content-between'>
                <p>{formatDate(item.date)}</p>

                <div>
                  {
                    role == "Admin" ? (
                      <div className='d-flex mb-2  w-50'>
                        <Popup
                          trigger={<button
                            className='btn bg-white text-info btn-outline-info w-50 me-1 rounded-2 p-2 mx-1 shadow'
                          >
                            تعديل
                          </button>}
                          position='center center'
                        >
                          <UpdateTrip
                            item={item}
                            val1={'track'}
                            val2={"Track"} />
                        </Popup>
                        <button
                          className='btn bg-white text-danger btn-outline-danger w-50 me-1 rounded-2 p-2 shadow'
                          onClick={() => deleteTrack(item._id)}>
                          حذف
                        </button></div>
                    ) : ""
                  }

                  <div>
                    {check(item) ? (
                      <button
                        className='btn bg-color text-white w-50 rounded-2 p-2 shadow'
                        onClick={() => cancelparticipating(item._id)}>
                        الغاء الاشتراك
                      </button>
                    )
                      :
                      (<button
                        className='btn bg-color text-white w-50 rounded-2 p-2 shadow'
                        onClick={() => handelparticipating(item._id)}>
                        شارك
                      </button>
                      )}
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