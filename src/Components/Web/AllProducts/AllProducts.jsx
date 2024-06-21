import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';
import Categories from '../Categories/Categories';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BsHeart, BsCartPlus, BsEye } from 'react-icons/bs';
import { CartContext } from '../Context/FeatureCart.jsx';
import './AllProducts.css';

export default function AllProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('price');
  const [ltePrice, setLtePrice] = useState(5000);
  const [gtePrice, setGtePrice] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { addToCartContext } = useContext(CartContext);
  const productsPerPage = 12;
  const typedElement = useRef(null);

  // Fetch products based on filters
  const fetchProducts = async () => {
    const params = {
      status: 'Active',
      page: currentPage,
      sort,
      search,
      'price[lte]': ltePrice,
      'price[gte]': gtePrice,
    };

    if (categoryFilter !== 'all') {
      params.categoryId = categoryFilter;
    }

    const endpoint = categoryFilter === 'all'
      ? `${import.meta.env.VITE_API_URL}product/getAll`
      : `${import.meta.env.VITE_API_URL}product/getActive`;

    try {
      const { data } = await axios.get(endpoint, { params });
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}category/getActive`);
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, sort, categoryFilter, ltePrice, gtePrice, search]);

  // Reset to first page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [sort, categoryFilter, ltePrice, gtePrice, search]);

  // Initialize Typed.js
  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["معدات", "دراجات جديدة", "دراجات مستعملة", "تأجير دراجات"],
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="pb-5 mt-5">
      <div className="h-50 w-100">
        <div className="imageStore text-white d-flex align-items-center justify-content-center shadow">
          <div className="w-50">
            <h1 className="fw-bold font-style dir me-5 pe-5">
              كل ما تحتاج لرحلتك الأمثل <span ref={typedElement} className="auto-type"></span>
            </h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="container-fluid">
          <div className="pb-4 container-fluid pt-5">
            <h1 className="text-center">منتجاتنا</h1>
            <hr />
          </div>

          <div>
            <div className="d-flex gap-2 justify-content-center">

              <div className="dropdown">
                <button className="btn btn-dark text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  ترتيب حسب
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => setSort('name')}>الاسم</button></li>
                  <li><button className="dropdown-item" onClick={() => setSort('price')}>السعر</button></li>
                  <li><button className="dropdown-item" onClick={() => setSort('rating')}>الأعلى تقييم</button></li>
                </ul>
              </div>

              <div className="dropdown">
                <button className="btn btn-dark text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  تصفية حسب السعر
                </button>
                <ul className="dropdown-menu p-4">
                  <div className="text-center">من:</div>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="First Number"
                    onChange={(e) => setGtePrice(Number(e.target.value))}
                  />
                  <div className="text-center">إلى:</div>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Last Number"
                    onChange={(e) => setLtePrice(Number(e.target.value))}
                  />
                </ul>
              </div>

              <select className="form-select bg-color form-select-sm w-25" onChange={(e) => setCategoryFilter(e.target.value)}>
                <option className="dir" value="all">التصفية حسب الفئة</option>
                {categories.map(category => (
                  <option className="dir" key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <Categories />

            <div className='d-flex justify-content-center'>
              <input
                type="text"
                className='my-5 mx-1 border border-secondary rounded shadow-bottom input w-50'
                placeholder="أكتب اسم المنتج"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mb-4">
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

          <div className="row gap-3 justify-content-center">
            {products.length > 0 ? (
              products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map(product => (
                <div className="col-lg-3 ps-0 mb-3" style={{ width: '17rem', position: 'relative' }} key={product._id}>
                  <Link to={`/products/${product._id}`}>
                    <div className="image-container position-relative">
                      <img
                        className="w-100 h-100 product-image"
                        src={product.mainImage.secure_url}
                        alt="Card image cap"
                      />
                      <div className="icon-container position-absolute bottom-0 start-50 mb-3 d-flex justify-content-center d-icon">
                        <button
                          onClick={(e) => { e.preventDefault(); addToCartContext(product._id); }}
                          className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 border-0"
                        >
                          <BsCartPlus className="icon-animation" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); /* handle add to wishlist */ }}
                          className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 mx-3 border-0"
                        >
                          <BsHeart className="icon-animation" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); /* handle view details */ }}
                          className="icon-card rounded-circle text-dark bg-white d-flex card-icon justify-content-center align-items-center w-100 h-100 col-lg-3 me-5 border-0"
                        >
                          <BsEye className="icon-animation" />
                        </button>
                      </div>
                    </div>
                  </Link>
                  <p className="text-center text-dark">{product.name}</p>
                  <p className="text-center text-secondary dir">{product.price} شيكل</p>
                </div>
              ))
            ) : <h2 className="dir">لا يوجد منتجات</h2>}
          </div>
        </div>

        <div className="d-flex justify-content-center">
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

        <div className="x">
          <div className="row d-flex justify-content-center align-items-center p-2">
            <ul className="d-flex h-100 justify-content-around p-2 pt-4 col-lg-5">
              <li className="mb-1"><Link to="/">الرئيسية</Link></li>
              <li><Link to="mailto:cyclingpalestine@gmail.com">cyclingpalestine@gmail.com</Link></li>
              <li><Link to="tel:+970568642671">+970-568642671</Link></li>
            </ul>
            <ul className="d-flex justify-content-around p-2 pt-4 col-lg-5">
              <li><Link to="">سياسة الخصوصية</Link></li>
              <li><Link to="">سياسة الشحن</Link></li>
              <li><Link to="">سياسة الإسترجاع والإستبدال</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
