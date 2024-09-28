import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet-async'
const CreateProduct = () => {
  const { shopId } = useParams();
  const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
  const parsedAuth = auth ? JSON.parse(auth) : null;
  const token = parsedAuth?.token;
  const navigate = useNavigate();
  const [productDetails, setProductsdetails] = useState({
    p_name: "",
    p_type: "",
    price: '',
    stock: "",
    description: '',
    category: '',
    product_image: null

  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductsdetails((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleImageChange = (e) => {
    setProductsdetails((prev) => ({
      ...prev,
      product_image: e.target.files[0]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('p_name', productDetails.p_name);
    form.append('p_type', productDetails.p_type);
    form.append('price', productDetails.price);
    form.append('category', productDetails.category);
    form.append('stock', productDetails.stock);
    form.append('description', productDetails.description)
    form.append('product_image', productDetails.product_image)
    const res = await axios.post(`http://localhost:8080/shop/${shopId}/newproducts`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    })
    if (res.status === 201) {
      navigate(`/shop/${shopId}/products`)
    }

  }
  return (
    <>
     <Helmet>
        <title>Create new Product | ChaiCro</title>
        <meta name="description" content="Products." />
        <meta name="keywords" content="Products,add" />
      </Helmet>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500">
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Create New Product</h2>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Product Name:</label>
          <input
            type="text"
            name="p_name"
            value={productDetails.p_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Product Type:</label>
          <input
            type="text"
            name="p_type"
            value={productDetails.p_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={productDetails.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Category:</label>
          <input
            type="text"
            name="category"
            value={productDetails.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Stock:</label>
          <input
            type="number"
            name="stock"
            value={productDetails.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-blue-700 font-medium mb-2">description:</label>
          <textarea
            type="text" rows={10} cols={10}
            name="description"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required value={productDetails.description}
          />
        </div>


        <div className="mb-6">
          <label className="block text-blue-700 font-medium mb-2">Product Image:</label>
          <input
            type="file"
            name="product_image"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
          Create Product
        </button>
      </form>
    </div>
    </>
  )
}

export default CreateProduct
