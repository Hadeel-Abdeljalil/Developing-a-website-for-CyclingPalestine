import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { BsCartPlus, BsEye, BsHeart } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import { CartContext } from '../Context/FeatureCart.jsx';
import StoreNav from '../Cart/StoreNav.jsx';


export default function CategoriesDetails() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState([]);
  const { addToCartContext } = useContext(CartContext);


  const getCategoryDetails = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}product/getActive?status=Active&categoryId=${categoryId}`);
      console.log(data)
      return data.products;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category");
    }
  };
  const addToCart = async (productId) => {
    const res = await addToCartContext(productId);
    return res;
  };
  const { data, isLoading, isError, refetch } = useQuery(["categoryDetails", categoryId], getCategoryDetails);

  useEffect(() => {
    refetch();
  }, [categoryId, refetch]);

  useEffect(() => {
    if (data) {
      setCategory(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
      </div>

    );
  }

  if (isError) {
    return <div>خطأ في جلب البيانات</div>;
  }
  return (
    <div className='mt-5'>
      <div className='imageStore text-white d-flex align-items-center justify-content-center  '>
      </div>
      <div className='shadow'>
        <StoreNav />
      </div>
      <div className='container pt-5 mt-5 pb-5 '>
        <div className='row d-flex justify-content-around '>
          {category.length ? (
            category.map((product) => (
              <Link
                className="col-lg-3 ps-0 mb-3"
                to={`/products/${product._id}`}
                style={{ width: '17rem', position: 'relative' }}
                key={product._id}
              >
                <div className="image-container position-relative">
                  <img
                    className="w-100 h-100 product-image"
                    src={product.mainImage.secure_url}
                    alt="Card image cap"
                  />
                  <div className="icon-container position-absolute bottom-0 start-50 mb-3  d-flex justify-content-center d-icon ">

                    <Link className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 ">
                      <BsCartPlus onClick={() => addToCart(product._id)} className='icon-animation' />
                    </Link>
                    <Link className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 mx-3">
                      <BsHeart className='icon-animation' />
                    </Link>
                    <Link className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 me-5">
                      <BsEye className='icon-animation' />
                    </Link>
                  </div>
                </div>

                <p className='text-center'>{product.name}</p>
                <p className='text-center text-secondary dir'> {product.price} شيكل</p>

              </Link>
            ))
          ) : (
            <h2 className="dir">لا يوجد منتجات</h2>
          )}
        </div>


      </div>
    </div>
  )
}
