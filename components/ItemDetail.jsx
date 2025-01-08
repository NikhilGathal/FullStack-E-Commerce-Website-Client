

import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import './ItemDetail.css'
import { useDispatch } from 'react-redux'
import { addCartItem } from '../store/slices/cartSlice'
import { addWishItem } from '../store/slices/wishListSlice'
import Footer from './Footer'

const ItemDetail = () => {
  const dispatch = useDispatch()
  let { productId } = useParams() // Get the itemId from the URL
  productId = +productId // Convert productId to a number
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [, dark] = useOutletContext()
 const[pdt ,setpdt] = useState([])
 const [userId, setUserId] = useState(null)

  // useEffect(() => {
  //   // Fetch item details from localStorage
  //   const fetchItemFromLocalStorage = () => {
  //     try {

  //       fetch('http://localhost:8080/api/products')
  //       .then((res) => res.json())
  //       .then((data) => {
  //         // console.log(data);
          
  //         setpdt(data)
  //         console.log(pdt);
          
  //       })
  //         // JSON.parse(localStorage.getItem('productsList')) || []
  //       const product = pdt.find((p) => p.id === productId) // Find the product by ID
  //       if (!product) {
  //         throw new Error('Product not found')
  //       }
  //       setItem(product) // Set the product as the state
  //       setLoading(false) // Set loading to false
  //     } catch (err) {
  //       setError(err.message) // Handle error
  //       setLoading(false) // Set loading to false
  //     }
  //   }

  //   fetchItemFromLocalStorage()
  // }, [productId])

  useEffect(() => {
    // Fetch item details from the backend API
    const fetchItemFromLocalStorage = () => {
      try {
        fetch('http://localhost:8080/api/products')
          .then((res) => res.json())
          .then((data) => {
            // Update pdt state with fetched data
            setpdt(data);
          });

      } catch (err) {
        setError(err.message); // Handle error
        setLoading(false); // Set loading to false
      }
    };

    fetchItemFromLocalStorage();
  }, []); // Only run once on mount

  useEffect(() => {
    // console.log(pdt);
    
    if (pdt.length > 0) {
      const product = pdt.find((p) => p.id === productId); // Find the product by ID
      if (!product) {
        throw new Error('Product not found');
      }
      setItem(product); // Set the product as the state
      setLoading(false); // Set loading to false
    }
  }, [pdt, productId]); // Runs when pdt is updated

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Step 1: Retrieve the username from localStorage
        const username = localStorage.getItem('username');
        if (!username) {
          console.warn('Username not found in localStorage');
          return; // Early return if username is not found, so the rest of the code doesn't run
        }
  
        // Step 2: Fetch user details by username to get the userId
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`
        );
  
        if (!userResponse.ok) {
          console.error('User not found');
          return;
        }
  
        const user = await userResponse.json(); // Assuming the response contains user details including ID
        setUserId(user.id); // Set userId in state
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const username = localStorage.getItem('username');
    if (username) {
      fetchUserId(); // Only call fetchUserId if username exists
    }
  }, []);

    // Add to cart function
    const addToCart = async (productId, quantity = 1) => {
      const cartKey = 'cartItems' // Key for localStorage
  
      if (!userId) {
        // User is not logged in; manage cart in localStorage
        let storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
        const existingProductIndex = storedCart.findIndex(
          (item) => item.productId === productId
        )
  
        if (existingProductIndex !== -1) {
          storedCart[existingProductIndex].quantity += quantity // Update quantity
        } else {
          storedCart.push({ productId, quantity }) // Add new product
        }
  
        // Save updated cart to localStorage
        localStorage.setItem(cartKey, JSON.stringify(storedCart))
  
        // Dispatch to update Redux store
        dispatch(addCartItem({ productId}))
        console.log('Added item to localStorage cart:', storedCart)
      } else {
        // console.log(userId)
        try {
          // Step 1: Add item to the cart on the backend
          const response = await fetch(
            `http://localhost:8080/api/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`,
            {
              method: 'POST',
            }
          )
          if (response.ok) {
            // Step 2: Dispatch the action after successful addition
            dispatch(addCartItem({ productId }))
          } else {
            console.error('Failed to add item to cart')
          }
        } catch (error) {
          console.error('Error adding item to cart:', error)
        }
      }
    }
    // Handle add to wishlist
    const handleAddToWishList = async () => {
      const wishKey = 'wishItems'; // Use username-based key or a default key
    
      if (!userId) {
        // User is not logged in; manage wishlist in localStorage
        let storedWish = JSON.parse(localStorage.getItem(wishKey)) || [];
        const existingProductIndex = storedWish.findIndex(
          (item) => item.productId === productId
        );
    
        if (existingProductIndex === -1) {
          storedWish.push({ productId, quantity: 1 }); // Add new product
        } else {
          console.log('Product already in wishlist.');
        }
    
        // Save updated wishlist to localStorage
        localStorage.setItem(wishKey, JSON.stringify(storedWish));
    
        // Dispatch to update Redux store
        dispatch(addWishItem({ productId }));
        console.log('Added item to localStorage wishlist:', storedWish);
      } else {
        console.log(userId);
        try {
          // Step 1: Add item to the wishlist on the backend
          const wishlistItem = { userId, productId, quantity: 1 }; // Construct the item to send
    
          const response = await fetch(`http://localhost:8080/api/wishlist/add?userId=${userId}&productId=${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Send JSON data
            },
            body: JSON.stringify(wishlistItem), // Send the wishlist item object as the request body
          });
    
          if (response.ok) {
            // Step 2: Dispatch the action after successful addition
            dispatch(addWishItem({ productId }));
          } else {
            console.error('Failed to add item to wishlist');
          }
        } catch (error) {
          console.error('Error adding item to wishlist:', error);
        }
      }
    };

  if (loading)
    return (
      <>
        {' '}
        <div className="error-msg">Loading...</div> <Footer dark={dark} />{' '}
      </>
    )
  if (error)
    return (
      <>
        {' '}
        <div className="error-msg">Error: {error}</div> <Footer dark={dark} />{' '}
      </>
    )

  return (
    <>
      <div className={`item-detail-container ${dark ? 'dark' : ''}`}>
        <div className="item-image">
          <img src={item.image} alt={item.title} />
        </div>
        <div className="item-info">
          <h1>{item.title}</h1>
          <p className="item-price">
            ${item.price ? parseFloat(item.price).toFixed(2) : 'N/A'}
          </p>
          <p className="item-description">{item.description}</p>
          <p className="item-category">Category: {item.category}</p>
          <div className="item-rating">
            <span>
              Rating: {item.rating.rate} / 5 ({item.rating.count} reviews)
            </span>
          </div>
          <div className="item-button">
          <button onClick={() => addToCart(productId, 1)}>Add to Cart</button>
          <button onClick={handleAddToWishList}>Add to WishList</button>
          </div>
        </div>
      </div>
      <Footer dark={dark} />
    </>
  )
}

export default ItemDetail
