import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getAllProducts,
  updateAllProducts,
  addProduct,
} from '../store/slices/productsSlice'
import Product from './Product'

function CarouselPage() {
  const dispatch = useDispatch()
  const { carousel } = useParams()
  const [loading, setLoading] = useState(true)
  const [sortPriceOrder, setSortPriceOrder] = useState('')
  const [sortRatingOrder, setSortRatingOrder] = useState('')
  const productsList = useSelector(getAllProducts)
  const [Error, setError] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([]) // State for filtered products

  // Check if products exist in localStorage
  useEffect(() => {
    setLoading(true)

    // If products are already in localStorage, load them from there
    const storedProducts = JSON.parse(localStorage.getItem('productsList'))

    if (storedProducts) {
      // If products exist in localStorage, dispatch them to Redux
      dispatch(updateAllProducts(storedProducts))
      setFilteredProducts(storedProducts) // Set filtered products to the loaded ones
      setLoading(false)
    } else {
      console.log('check carousal ');
      
      // Fetch products from the API if not found in localStorage
      fetch(`https://fakestoreapi.com/products/category/${carousel}`)
        .then((res) => res.json())
        .then((data) => {
          // Dispatch the fetched data to Redux and store it in localStorage
          dispatch(updateAllProducts(data))
          localStorage.setItem('productsList', JSON.stringify(data))
          setFilteredProducts(data) // Set the filtered products to the fetched data
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          setError('Something went wrong!')
          setLoading(false)
        })
    }
  }, [carousel, dispatch])

  // Handle adding a new product to Redux
  const addProductHandler = (newProduct) => {
    dispatch(addProduct(newProduct)) // Dispatch action to add the new product
    const updatedProductsList = [...productsList, newProduct]
    localStorage.setItem('productsList', JSON.stringify(updatedProductsList)) // Update localStorage
  }

  // Filter products based on the selected category and apply sorting
  useEffect(() => {
    if (productsList.length > 0) {
      // Filter products by category using exact match
      const filtered = productsList.filter(
        (product) => product.category.toLowerCase() === carousel.toLowerCase() // Exact match for category
      )

      // Apply sorting
      const sorted = filtered.sort((a, b) => {
        if (sortPriceOrder === 'lowToHigh') return a.price - b.price
        if (sortPriceOrder === 'highToLow') return b.price - a.price

        if (sortRatingOrder === 'lowToHigh')
          return a.rating.rate - b.rating.rate
        if (sortRatingOrder === 'highToLow')
          return b.rating.rate - a.rating.rate

        return 0
      })

      setFilteredProducts(sorted) // Update filtered products
    }
  }, [productsList, carousel, sortPriceOrder, sortRatingOrder])

  if (loading) {
    return (
      <h1 className="Load" style={{ textAlign: 'center' }}>
        Loading...
      </h1>
    )
  }

  if (Error) {
    return (
      <h1 className="home-error S" style={{ textAlign: 'center' }}>
        {Error}
      </h1>
    )
  }

  return (
    <>
      <div className="search-filter-container filter extra">
        <select
          id="sortPriceOrder"
          value={sortPriceOrder}
          onChange={(e) => {
            setSortPriceOrder(e.target.value)
            setSortRatingOrder('') // Reset rating order when price sorting is selected
          }}
        >
          <option value="">Sort by Price</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>

        <select
          id="sortRatingOrder"
          value={sortRatingOrder}
          onChange={(e) => {
            setSortRatingOrder(e.target.value)
            setSortPriceOrder('') // Reset price order when rating sorting is selected
          }}
        >
          <option value="">Sort by Rating</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>
      </div>

      <div className="products-container pdt">
        {filteredProducts.map(({ id, title, rating, price, image }) => (
          <Product
            key={id}
            productId={id}
            title={title}
            rating={rating.rate}
            price={price}
            imageUrl={image}
          />
        ))}
      </div>
    </>
  )
}

export default CarouselPage
