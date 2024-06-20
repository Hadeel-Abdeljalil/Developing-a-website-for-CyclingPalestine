import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../Context/FeatureCart';
import { UserContext } from '../Context/FeatureUser';
import SwiperReviews from './SwiperReviews';
import TripComments from './TripComments';
import InnerImageZoom from 'react-inner-image-zoom';
import { BiCart } from 'react-icons/bi';
import './Products.css';
import { BsHeart } from 'react-icons/bs';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';
import UpdateProduct from './UpdateProduct.jsx';
import Swal from 'sweetalert2';

export default function Products() {
  const { productId } = useParams();
  const {userData}=useContext(UserContext);
  const { addToCartContext } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOpacity, setImageOpacity] = useState({}); // Store opacity for each image
  const role = userData?.role;
  const navigate = useNavigate();

  let ratCount = 0;
  let ratsNum = 0;
  let AvgRating = 0;
  const { userToken, getUserOrdersContext } = useContext(UserContext);

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
  const getProduct = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}product/getDetails/${productId}`);
    return data.product;
  };

  const addToCart = async (productId) => {
    const res = await addToCartContext(productId);
    return res;
  };

  const avgRat = () => {
    data.reviews.map((review) => {
      ratCount += review.rating;
      ratsNum++;
    });
    AvgRating = ratCount / ratsNum;
    return Math.round(AvgRating);
  };

  const { data, isLoading, isError, refetch } = useQuery(["productDetails", productId], getProduct);

  useEffect(() => {
    refetch();
  }, [productId, refetch]);

  useEffect(() => {
    if (data) {
      setProduct(data);
      setSelectedImage(data.mainImage.secure_url);

      // Set opacity for each image initially
      const initialOpacity = {};
      data.subImages.forEach((_, index) => {
        initialOpacity[index] = 0.5; // Initial opacity for unselected images
      });
      setImageOpacity(initialOpacity);
    }
  }, [data]);

  const handleImageClick = (imageUrl, index) => {
    setSelectedImage(imageUrl);

    const updatedOpacity = {};
    Object.keys(imageOpacity).forEach((key) => {
      if (key === index.toString()) {
        updatedOpacity['main'] = 0.5; // خاصة بالصورة الرئيسية
      }
      if (key === index.toString()) {
        updatedOpacity[key] = key === index.toString() ? 1 : 0.5; // Set opacity to 1 for the clicked image and 0.5 for the main image
      } else {
        updatedOpacity[key] = 0.5; // Set opacity to 0.5 for other images
      }
    });
    setImageOpacity(updatedOpacity);
  };

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  if (isError) {
    return <div>خطأ في جلب البيانات</div>;
  }

  if (isLoading || !product) {
    return (
      <div className="loading bg-transfer w-100 d-flex justify-content-center align-items-center z-3">
        <span className="loader"></span>
      </div>
    );
  }
  const deleteProduct = async (productId)=>{
    try{
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
      const {data} = await axios.delete(`${import.meta.env.VITE_API_URL}product/delete/${productId}`,
        { headers: { Authorization: `Rufaidah__${userToken}` } });
      console.log(data)
      if(data.message =="product successfully deleted",toastConfig){
        navigate(-1);
        toast.success("تم حذف المنتج ")
      }

    }}catch(error){
      console.log(error)
    }
  }

  return (
    <div className="container pt-5 mt-5 pb-5 mb-5">
      <div className="row justify-content-center align-items-center pt-5">
        <div className="col-lg-10">
          <div className='pb-5 d-flex'>
            <div className='dir col-lg-6 pe-5'>
            <h2 className="fw-bold">{data.name}</h2>

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
                        <div className='  position-absolute '>
                        <UpdateProduct 
                           item={productId}
                         />
                        </div>
                        </Popup>
                        <button
                          className='btn bg-white text-danger btn-outline-danger w-50 me-1 rounded-2 p-2 shadow'
                          onClick={() => deleteProduct(productId)}>
                          حذف
                        </button></div>
                    ) : ""
                  }
              <div className='pe-4 pt-3 d-flex'>
                <p>
                  السعر: <span className="text-decoration-line-through opacity-50">{product.price} ₪</span>
                </p>
                <p className='pe-2 text-danger'>{product.finalPrice} ₪ </p>
              </div>
              <div className='pe-4'>
                <p>{product.stock}</p>
                <p>{product.stock > 0 ? <span className='text-white bg-color rounded-5 p-3'>متوفر</span> : <span className='text-white bg-danger rounded-5 p-3'>غير متوفر</span>}</p>
              </div>
              <div className='pe-4'>
                <p>{product.description}</p>
              </div>
              <div className='pe-2'>
                <p className='mb-0'>في حال لديك ملاحظات خاصة للبائع</p>
                <textarea className='mt-0 w-100 textarea'></textarea>
              </div>

              <div className='d-flex justify-content-center'>
                <div className='d-flex justify-content-center'>
                  <button
                    className="btn text-white bg-dark d-flex align-items-center dir add-button"
                    onClick={() => addToCart(data._id)}
                    hidden={!userToken}
                  >
                    <span className="ps-2 pb-1">
                      <BiCart />
                    </span>
                    أضف إلى عربة التسوق
                  </button>
                </div>
                <div className="heart-icon pe-3 pt-2">
                  <BsHeart />
                </div>
              </div>
            </div>
            <div className='col-lg-6 d-flex'>
              <div className=' p-image'>
                <InnerImageZoom
                  src={selectedImage}
                  zoomSrc={selectedImage}
                  zoomType="hover"
                  zoomScale={1.5}
                  className='shadow-lg '
                />
              </div>
              <div>
                {product.subImages && product.subImages.length > 0 && (
                  <>
                    <div className='mt-2 ms-2'>
                      <img
                        src={product.mainImage.secure_url}
                        alt={`main image`}
                        className={`sub-image`}
                        style={{ opacity: imageOpacity["main"] }}
                        onClick={() => handleImageClick(product.mainImage.secure_url, "main")}
                      />
                    </div>
                    {product.subImages.map((subImage, index) => (
                      <div key={index} className='mt-2 ms-2'>
                        <img
                          src={subImage.secure_url}
                          alt={`sub image ${index}`}
                          className={`sub-image`}
                          style={{ opacity: imageOpacity[index] }}
                          onClick={() => handleImageClick(subImage.secure_url, index)}
                        />
                      </div>
                    ))}
                  </>
                )}
                {!product.subImages || product.subImages.length === 0 && (
                  <div>Sub images not found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h2 className="text-center py-4 fw-bolder">
        ما مدى رضاك عن منتجنا؟
      </h2>
      <div className=' d-flex justify-content-center'>
        <div className='mt-5 w-50 '>
          <h1 className='dir'>التعليقات</h1>
          <TripComments productId={productId} />
        </div>
      </div>
    </div>
  );
}
