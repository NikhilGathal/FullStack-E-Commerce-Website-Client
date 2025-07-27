import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import SelectMenu from '../components/SelectMenu'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'
import {
  getAllProducts,
  getProductError,
  getProductLoadingState,
  updateAllProducts,
} from '../store/slices/productsSlice'
import { useOutletContext } from 'react-router-dom'
import ProductShimmer from '../components/ProductShimmer'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import ImageContainer from '../components/ImageContainer'
export default function Home() {
  const [query, setquery] = useState('')
  const [query1, setquery1] = useState('')
  const productsList = useSelector((state) => state.products.list)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  const dispatch = useDispatch()
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        // Filter the products based on the search query
        const filtered = productsList.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredProducts(filtered)
      } else {
        // If query is cleared or too short, display all products
        setFilteredProducts(productsList)
      }
    }, 300) // 300ms debounce delay

    // Cleanup the timeout on query change
    return () => clearTimeout(delayDebounceFn)
  }, [query, productsList])

  const isLoading = useSelector(getProductLoadingState)
  // const isLoading = 1
  const error = useSelector(getProductError)
  return (
    <>
      <main className={` ${dark ? 'dark' : ''}`}>
        <Carousel />
        <ImageContainer />
        <div className="search-filter-container">
          <SearchBar query={query} setquery={setquery} />
          <SelectMenu setquery1={setquery1} setquery={setquery} />
        </div>

        {/* Render loading message */}
        {/* {isLoading && <h1 className='home-error'>Loading...</h1>} */}

        {isLoading && <ProductShimmer />}

        {/* Render error message, but keep search and select menu visible */}
        {error && !isLoading && <h2 className="home-error">{error}</h2>}

        {/* Render the product list only if there are products */}
        {!isLoading && !error && productsList.length > 0 && (
          <div className="products-container">
            {filteredProducts.map(({ id, title, rating, price, image }) => (
              <Product
                key={id}
                productId={id}
                title={title}
                rating={rating}
                price={price}
                imageUrl={image}
              />
            ))}
          </div>
        )}
      </main>

      <Footer dark={dark} />
    </>
  )
}
