import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../Context/FeatureCart';
import { Link } from 'react-router-dom';
import './Cart.css';
import { toast } from 'react-toastify';

export default function Cart() {
  const {
    getCartContext,
    removeFromCartContext,
    clearCartContext,
    count,
    updateQuantityContext,
    createOrderContext
  } = useContext(CartContext);

  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const getCart = async () => {
    try {
      const res = await getCartContext();
      setProducts(res.finalProductsList || []);
      setTotal(res.total || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      const res = await removeFromCartContext(productId);
      if (res.message === "product removed") {
        toast.success("تم حذف المنتج بنجاح", toastConfig);
        getCart(); // Fetch updated cart after removal
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await clearCartContext();
      setProducts([]);
      setTotal(0);
      setLoading(false);
      toast.warn('تم تفريغ السلة', toastConfig);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId,productQ,product, quantity, operatorQ) => {
  if(productQ<product.stock || (productQ>=product.stock && operatorQ == "-" )){
    try {
      const res = await updateQuantityContext(productId, quantity, operatorQ);
      if (res.message === 'success') {
        await getCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }else{
    toast.warning("لا يمكنك زيادة الكمية أكثر من الكمية المتوفرة", toastConfig)
  }
  };

  if (isLoading) {
    return (
      <div className="loading bg-transfer w-100 vh-100 d-flex justify-content-center align-items-center z-3">
        <img src="/images/xxx.gif" alt="ss" className="img-fluid" style={{ width: '200px' }} />
      </div>
    );
  }

  return (
    <div className="cart pt-5 vh-100">
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="cart-items">
            <div className="products" id="products">
              <div className="item dir">
                <div className="product-info d-flex justify-content-start">
                  <h2>المنتج</h2>
                </div>
                <div className="quantity d-flex justify-content-center">
                  <h2>الكمية</h2>
                </div>
                <div className="price d-flex justify-content-center">
                  <h2>السعر</h2>
                </div>
                <div className="subtotal d-flex justify-content-center">
                  <h2>المجموع</h2>
                </div>
              </div>
              <div>
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className="item dir" key={product.productId}>
                      <div className="product-info">
                        <img src={product.mainImage.secure_url} className='' alt={product.name} />
                        <div className="product">
                          <h2>{product.name}</h2>
                          <Link to="#" onClick={() => removeFromCart(product.productId)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={25}
                              viewBox="0 0 24 25"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 5.79289C5.68342 5.40237 6.31658 5.40237 6.70711 5.79289L12 11.0858L17.2929 5.79289C17.6834 5.40237 18.3166 5.40237 18.7071 5.79289C19.0976 6.18342 19.0976 6.81658 18.7071 7.20711L13.4142 12.5L18.7071 17.7929C19.0976 18.1834 19.0976 18.8166 18.7071 19.2071C18.3166 19.5976 17.6834 19.5976 17.2929 19.2071L12 13.9142L6.70711 19.2071C6.31658 19.5976 5.68342 19.5976 5.29289 19.2071C4.90237 18.8166 4.90237 18.1834 5.29289 17.7929L10.5858 12.5L5.29289 7.20711C4.90237 6.81658 4.90237 6.18342 5.29289 5.79289Z"
                                fill="#6C7275"
                              />
                            </svg>
                            حذف
                          </Link>
                        </div>
                      </div>
                      <div className="quantity border border-dark rounded d-flex justify-content-center">
                        <button
                          className='ps-4'
                          onClick={() => {
                            if (product.quantity > 1) {
                              updateQuantity(product.productId,product.quantity,product, 1, "-");
                            }
                          }} disabled={product.quantity === 1}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={17}
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M3.22852 8.5H12.5618"
                              stroke="#121212"
                              strokeWidth="0.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          className='pe-4'
                          onClick={() => updateQuantity(product.productId,product.quantity,product, 1, "+")}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={17}
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.37565 3.83333C8.37565 3.62622 8.20776 3.45833 8.00065 3.45833C7.79354 3.45833 7.62565 3.62622 7.62565 3.83333V8.125H3.33398C3.12688 8.125 2.95898 8.29289 2.95898 8.5C2.95898 8.7071 3.12688 8.875 3.33398 8.875H7.62565V13.1667C7.62565 13.3738 7.79354 13.5417 8.00065 13.5417C8.20776 13.5417 8.37565 13.3738 8.37565 13.1667V8.875H12.6673C12.8744 8.875 13.0423 8.7071 13.0423 8.5C13.0423 8.29289 12.8744 8.125 12.6673 8.125H8.37565V3.83333Z"
                              fill="#121212"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="price d-flex justify-content-center">{product.finalPrice}</div>
                      <div className="subtotal d-flex justify-content-center">{product.totalPrice}</div>
                      
                    </div>
                  ))
                  
                ) : (
                  <div className='dir'>
                    <h2>السلة فارغة</h2>
                    <p>تصفح المنتجات لملء  سلة التسوق</p>
                    <Link to='/products' className='btn btn-outline-dark cart-product-link w-25'>المنتجات</Link>
                  </div>
                )}
              </div>
             {products.length>0 && <div className='d-flex w-50'>
                <div className=''>
                  <button className='btn btn-outline-danger border border-danger text-center mx-3' onClick={clearCart} disabled={count === 0}>تفريغ السلة</button>
                </div>
                <div className="">
                  <Link to='/order'><button className='btn btn-outline-info border border-info text-center mx-3'>إكمال الطلب</button></Link>
                </div>
              </div>}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
