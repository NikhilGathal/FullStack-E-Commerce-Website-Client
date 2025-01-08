import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct } from '../store/slices/productsSlice'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import './AddNewProduct.css'

const UpdateProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [, dark] = useOutletContext()
  const [product, setProduct] = useState(null)

  // Get the product from the Redux store by id

  // using localstorage
  // const product = useSelector((state) => state.products.list.find(p => p.id === parseInt(id)))

  // using database

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data)
      })
      .catch((error) => {
        // setMessage('Error fetching product: ' + error.message);
        console.error(error)
      })
  }
  // Set initial state for the form fields
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newRating, setNewRating] = useState(1)

  useEffect(() => {
    // If product is found, set the form fields with its data
    if (product) {
      setNewTitle(product.title)
      setNewPrice(product.price)
      setNewCategory(product.category)
      setNewDescription(product.description)
      setNewImage(product.image)
      setNewRating(product.rating ? product.rating.rate : 1) // Safeguard if rating doesn't exist
    }
  }, [product])

  const handleSave = () => {
    // Simple validation to check if any field is empty
    if (
      !newTitle ||
      !newPrice ||
      !newCategory ||
      !newDescription ||
      !newImage
    ) {
      alert('Please fill all the fields before saving.')
      return // Don't proceed if any field is empty
    }

    if (newRating <= 0) {
      alert('Rating must be greater than 0.')
      return // Don't proceed if rating is invalid
    }

    if (newPrice <= 0) {
      alert('Price must be greater than 0.')
      return // Don't proceed if rating is invalid
    }

    // Dispatch the update action with the new values and the existing product id
    // if (product) {
    //   dispatch(updateProduct({
    //     id: product.id,
    //     title: newTitle,
    //     price: newPrice,
    //     category: newCategory,
    //     description: newDescription,
    //     image: newImage,
    //     rating: { rate: newRating }
    //   }))
    //   navigate('/Home') // Redirect after update
    // }
    const updatedProduct = {
      id: product.id,
      title: newTitle,
      price: newPrice,
      category: newCategory,
      description: newDescription,
      image: newImage,
      rating: { rate: newRating },
    }

    fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        // setMessage('Product updated successfully: ' + data.name);
        setProduct(data)
        dispatch(updateProduct(data))
      })
      .catch((error) => {
        // setMessage('Error updating product: ' + error.message);
        console.error(error)
      })

    
    navigate('/Home')
  }

  // Handle case when product doesn't exist
  if (!product) {
    return <div>Loading or Product not found</div>
  }

  return (
    <div className={`mode1  ${dark ? 'dark' : ''} `}>
      <h2 className="update-head">Update Product</h2>
      <div className="update-product-container">
        <div className="update-product-container-content">
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label>Price:</label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label>Category:</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter product category"
            />
          </div>

          <div>
            <label>Description:</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label>Image URL:</label>
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Enter product image URL"
            />
          </div>

          <div>
            <label>Rating:</label>
            <input
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              min="1"
              max="5"
            />
          </div>

          <button className="save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
