import axios from 'axios';
import { useQuery } from 'react-query';
import Swiper from '../Swiper/Swiper';
// import { useContext } from 'react';
// import { CartContext } from '../Context/FeatureCart';
//import React, { useEffect, useState } from 'react'

export default function Categories() {

  
  const getCategories = async ()=>{
     const {data} = await axios.get(`${import.meta.env.VITE_API_URL}category/getActive`);
     return data.categories;
    }
  // const handleCategoryChange = (categoryName) => {
  //   setSelectedCategory(categoryName);
  //   onCategoryChange(categoryName);
  // };

  const {data,isLoading} = useQuery('web-category',getCategories);
  // const cartContext = useContext(CartContext);

  if(isLoading){
    return <div className="loading bg-transfer w-100 d-flex justify-content-center align-items-center z-3">
    <span className="loader"></span>
</div>
}


  return (
    <div className='container'>
      <Swiper data = {data}/>
    </div>
  )
}
