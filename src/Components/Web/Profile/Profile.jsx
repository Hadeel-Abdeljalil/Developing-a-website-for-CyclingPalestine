import React, { useContext, useState } from 'react';
import { BsPerson, BsListCheck, BsHouse } from 'react-icons/bs';
import { UserContext } from '../Context/FeatureUser';
import { Link, Outlet } from 'react-router-dom';
import Navbar from './../Navbar/Navbar';
import './Profile.css';

export default function Profile() {
    const { userData, loading } = useContext(UserContext);
    const [activeItem, setActiveItem] = useState(null);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    if (loading) {
        return (
            <div className="loading bg-white position-fixed vh-100 w-100 d-flex justify-content-center align-items-center z-3">
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <div className='bg-secondary-bg-light-subtle  '>
            <Navbar />
            <div className="container-fluid">
                <div className="row dir pt-5 ">
                    <div className='mt-4  mb-5  vh-100 col-md-3 col-xl-2 px-sm-2  '>
                      <div className='position-fixed'>
                      <div className=' w-100 d-flex align-items-center'>
                            <div>
                                <img className='rounded-circle image-sidebar' src={userData.image ? userData.image : '/images/profile.jpeg'} />
                            </div>
                            <div>
                                <p className=" text-dark mb-0 mt-3 ">{userData.userName} </p>
                                <p className=" text-black-50  ">{userData.email} </p>
                            </div>
                        </div>
                        <div className="  mb-5  ">
                            <div className="d-flex flex-column align-items-start px-3 pt-2 text-white justify-content-center mb-5">

                                <div className="flex-column mb-sm-auto mb-0 justify-content-end align-items-sm-start list-unstyled w-100" id="menu">


                                    <li className={`rounded-end-1  mb-1  nav-item  sidebar-text ${activeItem === 'personalData' ? 'activesidebar' : ''}`} onClick={() => handleItemClick('personalData')}>
                                        <Link to='userInfo' className="nav-link align-middle ps-5 p-2">
                                            <BsPerson className="ms-1 d-none d-sm-inline " /> {/* Adding the user icon */}
                                            <span className="ms-1 d-none d-sm-inline">البيانات الشخصية</span>
                                        </Link>
                                    </li>

                                    <li className={`rounded-end-1  mb-1  nav-item  sidebar-text ${activeItem === 'orders' ? 'activesidebar' : ''}`} onClick={() => handleItemClick('orders')}>
                                        <Link to='orders' className="nav-link ps-5 align-middle w-100 p-2">
                                            <BsListCheck className="ms-1 d-none d-sm-inline " /> {/* Adding the clipboard list icon */}
                                            <span className="ms-1 d-none d-sm-inline">الطلبات</span>
                                        </Link>
                                    </li>

                                    <li className={`rounded-end-1  mb-1  nav-item sidebar-text ${activeItem === 'home' ? 'activesidebar' : ''}`} onClick={() => handleItemClick('home')}>
                                        <Link to='/' className="nav-link align-middle ps-5 p-2">
                                            <BsHouse className="ms-1 d-none d-sm-inline " /> {/* Adding the home icon */}
                                            <span className="ms-1 d-none d-sm-inline"> العودة الى الرئيسية</span>
                                        </Link>
                                    </li>
                                </div>
                                <hr />

                            </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-md-9 mt-5">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
