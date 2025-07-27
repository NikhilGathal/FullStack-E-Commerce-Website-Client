import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  removeCartItem,
} from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'

export default function CartItem({
  productId,
  title,
  rating,
  price,
  imageUrl,
  quantity,
}) {
  const dispatch = useDispatch()
  let cartKey = 'cartItems'
  const [userId, setUserId] = useState(null)

  const [productStock, setProductStock] = useState(null)
  //  console.log('rerendered' +  productStock);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}`
        )
        if (response.ok) {
          const data = await response.json()
          setProductStock(data.rating?.count || 0)
        } else {
          console.error('Failed to fetch product stock')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProductCount()
  }, [productId])

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Step 1: Retrieve the username from localStorage
        const username = localStorage.getItem('username')
        if (!username) {
          console.warn('Username not found in localStorage')
          return // Early return if username is not found, so the rest of the code doesn't run
        }

        // Step 2: Fetch user details by username to get the userId
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`
        )

        if (!userResponse.ok) {
          console.error('User not found')
          return
        }

        const user = await userResponse.json() // Assuming the response contains user details including ID
        setUserId(user.id) // Set userId in state
      } catch (error) {
        console.error('Error:', error)
      }
    }

    const username = localStorage.getItem('username')
    if (username) {
      fetchUserId() // Only call fetchUserId if username exists
    }
  }, []) // Empty dependency array ensures this effect runs only once

  const handleRemove = async () => {
    const cartKey = 'cartItems'
    console.log(userId)

    if (userId) {
      try {
        // Step 1: Fetch the quantity of the item from the backend cart
        const res = await fetch(
          `http://localhost:8080/api/cart/item?userId=${userId}&productId=${productId}`
        )
        if (!res.ok) {
          alert('Failed to fetch cart item. Please try again later.')
          return
        }
        const cartItem = await res.json()
        const removedQuantity = cartItem.quantity || 0 // Step 2: Increase the product stock in the database

        // const stockUpdateRes = await fetch(
        //   `http://localhost:8080/api/products/stock/${productId}/${removedQuantity}`,
        //   {
        //     method: 'PUT',
        //   }
        // )
        // if (!stockUpdateRes.ok) {
        //   alert('Failed to update product stock. Please try again later.')
        //   return
        // }

        // setProductStock((prev) => Math.max(prev + removedQuantity, 0)) // Step 3: Remove the item from the user's cart

        const response = await fetch(
          `http://localhost:8080/api/cart/remove?userId=${userId}&productId=${productId}`,
          { method: 'DELETE' }
        )

        if (response.ok) {
          const result = await response.text()
          if (result === 'Product removed from cart') {
            dispatch(removeCartItem({ productId }))
            console.log('Item removed and stock restored successfully.')
          } else {
            alert('Unexpected response: ' + result)
          }
        } else {
          alert('Failed to remove item from cart. Please try again later.')
        }
      } catch (error) {
        console.error('Error removing item from cart:', error)
      }
    } else {
      // 🔹 For guest/localStorage users (fallback)
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
      const itemToRemove = storedCart.find(
        (item) => item.productId === productId
      )
      const removedQuantity = itemToRemove ? itemToRemove.quantity : 0

      const stockUpdateRes = await fetch(
        `http://localhost:8080/api/products/stock/${productId}/${removedQuantity}`,
        {
          method: 'PUT',
        }
      )
      if (!stockUpdateRes.ok) {
        alert('Failed to update product stock. Please try again later.')
        return
      }

      const updatedCart = storedCart.filter(
        (item) => item.productId !== productId
      )
      localStorage.setItem(cartKey, JSON.stringify(updatedCart))

      dispatch(removeCartItem({ productId }))
      console.log('Removed from localStorage cart and updated stock.')
    }
  }

  const handleDecreaseQuantity = async () => {
    const cartKey = 'cartItems'

    if (userId) {
      try {
        // Step 1: Decrease quantity in backend cart
        const response = await fetch(
          `http://localhost:8080/api/cart/decrease?userId=${userId}&productId=${productId}`,
          {
            method: 'PUT',
          }
        )

        if (!response.ok) {
          console.error('Failed to decrease quantity in cart')
          alert('Failed to update cart. Please try again.')
          return
        }

        const data = await response.text()
        console.log('Response:', data)

        if (data !== 'Quantity decreased') {
          alert('Unexpected response while updating cart.')
          return
        }

        // Step 2: Update UI state
        dispatch(decreaseCartItemQuantity({ productId }))

        // Step 3: Increase stock in DB
        // const res = await fetch(
        //   `http://localhost:8080/api/products/stock/${productId}/+1`,
        //   {
        //     method: 'PUT',
        //   }
        // );

        // if (!res.ok) {
        //   console.error('Failed to update stock in DB');
        //   alert('Failed to update product stock. Try again later.');
        //   return;
        // }

        // setProductStock((prev) => Math.max(prev + 1, 0));
      } catch (error) {
        console.error('Error decreasing quantity:', error)
        alert('Something went wrong. Try again later.')
        return
      }
    } else {
      // 🔹 Guest user (localStorage)
      let storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
      const existingProductIndex = storedCart.findIndex(
        (item) => item.productId === productId
      )

      if (existingProductIndex !== -1) {
        storedCart[existingProductIndex].quantity -= 1
        if (storedCart[existingProductIndex].quantity <= 0) {
          storedCart.splice(existingProductIndex, 1)
        }
      }

      localStorage.setItem(cartKey, JSON.stringify(storedCart))
      dispatch(decreaseCartItemQuantity({ productId }))
      console.log('Decreased quantity in localStorage cart:', storedCart)
    }
  }

  const handleIncreaseQuantity = async () => {
    const cartKey = 'cartItems'

    if (userId) {
      try {
        // 🔹 Step 1: Increase cart quantity
        const response = await fetch(
          `http://localhost:8080/api/cart/increase?userId=${userId}&productId=${productId}`,
          { method: 'PUT' }
        )

        if (!response.ok) {
          alert('Failed to increase item quantity in cart.')
          return // ⛔ Stop further execution
        }

        const data = await response.text()
        console.log('Response:', data)

        if (data !== 'Quantity increased') {
          alert('Unexpected response from server.')
          return // ⛔ Stop if not expected response
        }

        dispatch(increaseCartItemQuantity({ productId }))

        // 🔹 Step 2: Decrease stock
        // const res = await fetch(
        //   `http://localhost:8080/api/products/stock/${productId}/-1`,
        //   { method: 'PUT' }
        // );

        // if (!res.ok) {
        //   alert('Failed to decrease stock in DB.');
        //   return; // ⛔ Don't update UI
        // }

        // setProductStock((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error('Error increasing quantity:', error)
        alert('Something went wrong. Please try again later.')
        return // ✅ Always return in catch
      }
    } else {
      // 🔹 Guest user: update localStorage
      let storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
      const existingProductIndex = storedCart.findIndex(
        (item) => item.productId === productId
      )

      if (existingProductIndex !== -1) {
        storedCart[existingProductIndex].quantity += 1
      } else {
        storedCart.push({ productId, quantity: 1 })
      }

      localStorage.setItem(cartKey, JSON.stringify(storedCart))
      dispatch(increaseCartItemQuantity({ productId }))
      console.log('Increased quantity in localStorage cart:', storedCart)
    }
  }

  return (
    <div className="cart-item-container">
      <div className="cart-item">
        <Link to={`/${productId}`}>
          <img src={imageUrl} alt={title} />
        </Link>
        <div>
          <Link to={`/${productId}`}>
            <h3> {title}</h3>
          </Link>
          <h3 className='validmsg'>
            {productStock === 0 ? (
              <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>
                Out of stock
              </p>
            ) : quantity > productStock ? (
              <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>
                Added more quantity than available!
              </p>
            ) : quantity === productStock ? (
              <p
                style={{
                  color: 'orange',
                  fontSize: '0.9rem',
                  marginTop: '5px',
                }}
              >
                Reached max available stock
              </p>
            ) : null}
          </h3>

          <p>{rating} ★ ★ ★ ★</p>
        </div>
      </div>

      <div className="">${price}</div>

      <div className="quantity-controls">
        <button
          onClick={handleDecreaseQuantity}
          disabled={productStock === 0}
          style={{
            backgroundColor: productStock === 0 ? '#ccc' : '',
            cursor: productStock === 0 ? 'not-allowed' : 'pointer',
          }}
          title={productStock === 0 ? 'Out of stock' : 'Decrease quantity'}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={handleIncreaseQuantity}
          disabled={quantity >= productStock}
          style={{
            backgroundColor: quantity >= productStock ? '#ccc' : '',
            cursor: quantity >= productStock ? 'not-allowed' : 'pointer',
          }}
        >
          +
        </button>
      </div>

      <div className="item-total">${quantity * price}</div>

      <div>
        <button className="remove" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}
