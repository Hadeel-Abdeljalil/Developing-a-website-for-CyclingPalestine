import React, { useContext } from 'react';
import { BsCart3, BsHeart, BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import CategoriesNav from './CategoriesNav.jsx';

import './Store.css';
import './StoreMedia.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../Context/FeatureUser.jsx';
import { CartContext } from '../Context/FeatureCart.jsx';


export default function StoreNav() {
    let { userToken, setUserToken, userData, setUserData } = useContext(UserContext);
    let { count } = useContext(CartContext);

    const logOut = () => {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setUserData(null);
        navigate('/');
    }

    return (
        <section className='store '>
            <div className='container '>
                <div className='row d-flex container-fluid  shadow-bottom '>
                    <div className='col-lg-10 department-store pe-5 pt-3 '>
                        <CategoriesNav />
                    </div>
                   
                </div>
            </div>
        </section>
    );
}
