import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct } from '../store/slices/productsSlice'
import { useNavigate, useOutletContext } from 'react-router-dom'
import './AddNewProduct.css'

const AddNewProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [, dark] = useOutletContext()

  // Accessing the current state of products from the Redux store
  const products = useSelector((state) => state.products.list)

  // Initialize the state for all fields
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newRating, setNewRating] = useState(1)

  const handleSave = async () => {
    // Validate the fields to ensure no field is empty
    if (!newTitle || !newPrice || !newCategory || !newDescription || !newImage) {
      alert('Please fill all the fields before adding.')
      return // Don't proceed if any field is empty
    }
  
    if (newRating <= 0) {
      alert('Rating must be greater than 0.')
      return // Don't proceed if rating is invalid
    }
  
    if (newPrice <= 0) {
      alert('Price must be greater than 0.')
      return // Don't proceed if price is invalid
    }
  
    try {
      // Step 1: Fetch the last product from the backend
      const response = await fetch('http://localhost:8080/api/products')
      const productsData = await response.json()
  
      if (response.ok) {
        // Step 2: Get the ID of the last product from the database
        const lastProduct = productsData[productsData.length - 1]
        const newProductId = lastProduct ? lastProduct.id + 1 : 1 // Handle case when no products exist
  
        // Step 3: Prepare the product data dynamically from the form inputs
        const newProduct = {
          id: newProductId, // New product ID based on the last product's ID
          title: newTitle,
          price: parseFloat(newPrice), // Convert the price to a number
          category: newCategory,
          description: newDescription,
          image: newImage,
          rating: { rate: newRating },
        }
  
        // Step 4: Save the new product to the backend
        const saveResponse = await fetch('http://localhost:8080/api/products/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        })
  
        if (saveResponse.ok) {
          // If the product is saved successfully, dispatch the Redux action and navigate
          dispatch(addProduct(newProduct)) // Optionally add to Redux state if needed
          navigate('/') // Redirect to the desired page after success
          alert('Product saved successfully!')
        } else {
          // Handle the error response from the backend
          const errorData = await saveResponse.json()
          alert(`Error saving product: ${errorData.message}`)
        }
      } else {
        // Handle error response when fetching products
        const errorData = await response.json()
        alert(`Error fetching products: ${errorData.message}`)
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error while saving product:', error)
      alert('There was an error saving the product.')
    }
  }
  

  return (
    <div className={`mode1  ${dark ? 'dark' : ''} `}>
      <h2 className="update-head">Add New Product</h2>
      <div className="update-product-container">
        <div className="update-product-container-content">
          <div>
            <label>Title:</label>
            <input
               placeholder='Enter Title'
              className='newpdt-inp'
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Price:</label>
            <input
              type="number"
              placeholder='Enter Price'
              className='newpdt-inp'
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>

          <div className="addnew">
            <label>Category:</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option className='newpdt-inp' hidden value="">Select Category</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>

          <div>
            <label>Description:</label>
            <textarea
             className='newpdt-inp'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label>Image URL:</label>
            <input
              type="text"
               className='newpdt-inp'
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Enter product image URL"
            />
          </div>

          <div>
            <label>Rating:</label>
            <input
              className='newpdt-inp'
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              min="1"
              max="5"
            />
          </div>

          <button className="save" onClick={handleSave}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddNewProduct
