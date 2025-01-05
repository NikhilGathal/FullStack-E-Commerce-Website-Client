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

// import Hero from '../components/Hero'
// import Testimonial from '../components/Testimonials'


// import Testimonials from '../components/Testimonials'
// import Hero from '../components/Hero'
// import Testimonials from '../components/Testimonials'

export default function Home() {
  const [query, setquery] = useState('')
  const [query1, setquery1] = useState('')
  const productsList = useSelector(getAllProducts)
  const [filteredProducts, setFilteredProducts] = useState([]);
  // console.log(productsList);

  // console.log(productsList[0]);

  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  // console.log(userlogin);
  // console.log(issign);

  const dispatch = useDispatch()

  // useEffect(() => {
  //   if (query1) {
  //     fetch(`https://fakestoreapi.com/products/category/${query1}`)
  //       .then((res) => res.json())
  //       .then((data) => dispatch(updateAllProducts(data)))
  //   }

  //   const delayDebounceFn = setTimeout(() => {
  //     if (query.length > 2) {
  //       // Only fetch if query is longer than 2 characters
  //       fetch(`https://fakestoreapi.com/products/category/${query}`)
  //         .then((res) => res.json())
  //         .then((data) => {
  //           // console.log(data);
  //           if (data.length === 0) {
  //             dispatch(fetchProductsError('No products found')) // Dispatch error if no products found
  //           } else {
  //             dispatch(updateAllProducts(data))
  //             setquery('')
  //             // Update products if data exists
  //           }
  //         })
  //         .catch(() => {
  //           dispatch(fetchProductsError('Error fetching products')) // Dispatch error if fetch fails
  //         })
  //     }
  //   }, 300) // 300ms debounce

  //   return () => clearTimeout(delayDebounceFn) // Cleanup the timeout on query change
  // }, [query, dispatch, query1])

  //   // If there's a selected category from SelectMenu (`query1`), fetch products for that category.
  //   if (query1) {
  //     fetch(`https://fakestoreapi.com/products/category/${query1}`)
  //       .then((res) => res.json())
  //       .then((data) => dispatch(updateAllProducts(data)))
  //       .catch(() => {
  //         dispatch(fetchProductsError('Error fetching products for selected category'));
  //       });
  //   } else if (query.length > 2) {
  //     // Only fetch if query is longer than 2 characters for search input.
  //     const delayDebounceFn = setTimeout(() => {
  //       fetch(`https://fakestoreapi.com/products/category/${query}`)
  //         .then((res) => res.json())
  //         .then((data) => {
  //           if (data.length === 0) {
  //             dispatch(fetchProductsError('No products found'));
  //           } else {
  //             dispatch(updateAllProducts(data));
  //             setquery(''); // Clear the input after fetching data.
  //           }
  //         })
  //         .catch(() => {
  //           dispatch(fetchProductsError('Error fetching products'));
  //         });
  //     }, 300); // 300ms debounce

  //     return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on query change.
  //   } else {
  //     // If the query is cleared, fetch all products.
  //     dispatch(fetchProductdata());
  //   }
  // }, [query, query1, dispatch]);

  // const [showModal, setShowModal] = useState(false)

  // useEffect(() => {
  //   // Check if the modal has already been shown before
  //   const hasShownModal = localStorage.getItem('hasShownModal')

  //   // If the modal hasn't been shown, set a timeout to show it after 4 seconds
  //   if (!hasShownModal) {
  //     // console.log('Timer');
  //     const timer = setTimeout(() => {
  //       setShowModal(true)
  //       !showModal && setissign(true) // Show modal after 4 seconds
  //       localStorage.setItem('hasShownModal', 'true') // Set flag in localStorage
  //     }, 4000)

  //     // Clean up the timer in case the component unmounts
  //     return () => clearTimeout(timer)
  //   }
  // }, [])


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        // Filter the products based on the search query
        const filtered = productsList.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        // If query is cleared or too short, display all products
        setFilteredProducts(productsList);
      }
    }, 300); // 300ms debounce delay
  
    // Cleanup the timeout on query change
    return () => clearTimeout(delayDebounceFn);
  }, [query, productsList]);
  

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
                rating={rating.rate}
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
