import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeWishItem } from '../store/slices/wishListSlice'
import { Link } from 'react-router-dom';

export default function Wishitem({ productId, title, rating, price, imageUrl, quantity }) {
  const dispatch = useDispatch()

  let wishKey = 'wishItems';
  const [userId, setUserId] = useState(null)


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

  const handleRemove = () => {
    const username = localStorage.getItem('username');
    const wishKey = 'wishItems'; // Key for wishlist items in localStorage
  
    if (userId) {
      // User is logged in; make a request to remove the item from the backend
      fetch(
        `http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${productId}`, // Send userId and productId as query parameters
        {
          method: 'DELETE', // Use DELETE method to remove the item
        }
      )
        .then((response) => response.text()) // Use .text() to handle plain text response
        .then((data) => {
          console.log('Response:', data); // Log the response to check if it's plain text
          if (data === 'Product removed from wishlist') {
            // Dispatch action to Redux to remove the item from the wishlist
            dispatch(removeWishItem({ productId }));
          }
        })
        .catch((error) => {
          console.error('Error removing item from wishlist:', error);
        });
    } else {
      // User is not logged in; manage wishlist in localStorage
      let storedWishList = JSON.parse(localStorage.getItem(wishKey)) || [];
      storedWishList = storedWishList.filter((item) => item.productId !== productId);
  
      // Save updated wishlist to localStorage
      localStorage.setItem(wishKey, JSON.stringify(storedWishList));
  
      // Dispatch to update Redux store
      dispatch(removeWishItem({ productId }));
      console.log('Removed item from localStorage wishlist:', storedWishList);
    }
  };
  
  


  return (
    <div className="cart-item-container" key={productId}>
      <div className="cart-item">
      <Link to={`/${productId}`}> <img src={imageUrl} alt={title} />  </Link>  
        <div>
        <Link to={`/${productId}`}>  <h3>{title}</h3> </Link>  
          <p>{rating} ★ ★ ★ ★</p>
        </div>
      </div>

      <div className="">${price}</div>

      <div className="item-quantity">
        {/* <button onClick={() => dispatch(decreaseCartItemQuantity(productId))}></button> */}
        {/* <span>{quantity}</span> */}
        <button onClick={handleRemove}>Remove</button>
      </div>
      <div className="item-total"></div>
    </div>
  )
}
