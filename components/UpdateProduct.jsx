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

  const isAdminLog = localStorage.getItem('isadminlog') === 'true'
  useEffect(() => {
    if (!isAdminLog) {
      navigate('/')
    }
  }, [isAdminLog])

  if (!isAdminLog) {
    return null // ✅ Prevents rendering if admin is not logged in
  }
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
  const [newCount, setNewCount] = useState(1)

  useEffect(() => {
    // If product is found, set the form fields with its data

    if (product) {
      console.log(product.rating.count)
      setNewTitle(product.title)
      setNewPrice(product.price)
      setNewCategory(product.category)
      setNewDescription(product.description)
      setNewImage(product.image)
      setNewRating(product.rating ? product.rating.rate : 1)
      setNewCount(product.rating ? product.rating.count : 1) // Safeguard if rating doesn't exist
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

    const updatedProduct = {
      id: product.id,
      title: newTitle,
      price: newPrice,
      category: newCategory,
      description: newDescription,
      image: newImage,
      rating: { rate: newRating, count: newCount },
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
            <label className="bb">Title:</label>
            <input
              className="newpdt-inp"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="bb">Price:</label>
            <input
              className="newpdt-inp"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className="bb">Category:</label>
            <input
              className="newpdt-inp"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter product category"
            />
          </div>

          <div>
            <label className="bb">Description:</label>
            <textarea
              className="newpdt-inp"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="bb">Image URL:</label>
            <input
              className="newpdt-inp"
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Enter product image URL"
            />
          </div>

          <div>
            <label className="bb">Rating:</label>
            <input
              className="newpdt-inp"
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              min="1"
              max="5"
            />
          </div>

          <div>
            <label className="bb"> Stock(Quantity):</label>
            <input
              className="newpdt-inp"
              type="number"
              value={newCount}
              onChange={(e) => setNewCount(Number(e.target.value))}
              min="0"
              placeholder="Enter product stock count"
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
