import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const Products = () => {
  const { productId } = useParams();
  const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
  const parsedAuth = auth ? JSON.parse(auth) : null;
  const token = parsedAuth?.token;
  const userId = parsedAuth?.userId
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const getProduct = async () => {
      const res = await axios.get(`http://localhost:8080/shop/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const { data } = res;
      setProduct(data);
    }
    getProduct();
  }, [token, productId]);

  const addCart = async () => {
    const result = await axios.post(`http://localhost:8080/cart/${userId}/${productId}/add`, {},{
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    console.log(result);
    
  }
  return (
    <>
      <Helmet>
        <title>{`${product?.p_name}`} | ChaiCro</title>
        <meta name="description" content="Products." />
        <meta name="keywords" content="Products" />
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-start p-4 md:p-10 bg-gradient-to-r from-gray-100 via-purple-200 to-gray-100 min-h-screen">
        {/* Image section */}
        <div className="md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
          <img
            className="w-full max-w-xs md:max-w-md rounded-xl shadow-2xl transition-transform duration-500 transform hover:scale-105 hover:rotate-2"
            src={product?.p_image}
            alt={product?.p_name}
          />
        </div>

        {/* Product details section */}
        <div className="md:w-2/3 md:pl-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
            {product?.p_name}
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-700 mb-4">
            {product?.p_type}
          </h2>
          <p className="text-lg md:text-xl text-gray-800 mb-6">
            {product?.description}
          </p>

          {/* Price section */}
          <div className="text-green-600 text-2xl md:text-4xl font-bold mb-6">
            ₹{product?.price}
          </div>

          {/* Buttons with 3D hover effect */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
             onClick={addCart}>
              Add to Cart
            </button>
            <button
              className="bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
