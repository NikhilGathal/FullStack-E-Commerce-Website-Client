import React, { useState, useEffect } from 'react'
import CartItem from '../components/CartItem'
import empty from '../assets/empty.png'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllCartItems,
  getCartError,
  loadCartItemsFromLocal,
  removeallCartItem,
} from '../store/slices/cartSlice'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'

export default function Cart() {
  const existingAdmin = JSON.parse(localStorage.getItem('Admin')) || {}
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  const error = useSelector(getCartError)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const cartItems = useSelector(getAllCartItems)
  // console.log(cartItems);

  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)

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

  useEffect(() => {
    const fetchCartItems = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    }
    fetchCartItems()
  }, [])

  const totalPrice = cartItems
    .reduce((sum, order) => sum + order.price * order.quantity, 0)
    .toFixed(2)

  if (isLoading) {
    return (
      <div className="admin">
      <h1>Loading Cart Items...</h1>
    </div>
    )
  }

  return (
    <>
      {isLoading ? (
        <h1 style={{ textAlign: 'center' }}>Loading Cart items...</h1>
      ) : cartItems.length ? (
        <main className={`cart-container ${dark ? 'dark' : ''}`}>
          <div className="cart-container">
            <h2 className="item-wish">Cart Items</h2>
            <div className="cart-items-container">
              <div className="cart-header cart-item-container">
                <div className="cart-item">Item</div>
                <div className="">Price</div>
                <div className="quantity">Quantity</div>
                <div className="total">Total</div>
                <div className="remove">Remove</div>
              </div>
              {cartItems.map(
                ({ id, title, rating, price, image, quantity }) => (
                  <CartItem
                    key={id}
                    productId={id}
                    title={title}
                    price={price}
                    quantity={quantity}
                    imageUrl={image}
                    rating={rating.rate}
                  />
                )
              )}
              <div className="cart-header cart-item-container">
                <button
                  onClick={() => {
                    const order_Id = 'OD' + Date.now()
                    const username = localStorage.getItem('username')
                    const admin = localStorage.getItem('adminname')

                    // Condition 1: Check if Admin exists in localStorage
                    if (!admin) {
                      alert(
                        'Sign up as admin first before placing an order. After that, log in as a normal user to place an order.'
                      )
                      return
                    }

                    // Condition 2: Check if user is logged in
                    if (!username) {
                      alert('Please login first to place an order')
                      return
                    }

                    const requestBody = {
                      username: username,
                      order_Id: order_Id,
                    }

                    fetch('http://localhost:8080/api/orders/place', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(requestBody),
                    })
                      .then((response) => response.text()) // Parse the response as text since it's just a message
                      .then((data) => {
                        if (data === 'Order placed successfully!') {
                          // Clear cart and navigate to the order confirmation page
                          dispatch(removeallCartItem())
                          navigate('/OrderConfirmation', {
                            state: {
                              username,
                              cartItems,
                              totalPrice,
                              order_Id, // Ensure totalPrice is calculated properly
                            },
                          })
                        } else {
                          alert(data.message || 'Failed to place the order')
                        }
                      })
                      .catch((error) => {
                        console.error('Error placing order:', error)
                        alert('An error occurred while placing the order.')
                      })
                  }}
                  className="place"
                >
                  Place Order
                </button>
                <div></div>
                <div></div>
                <div className="sum-total">${totalPrice}</div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className="empty-cart">
          <img src={empty} />
          <h1>Your Cart is Empty</h1>
          <Link to="/Home">
            <button>Return to Shop</button>
          </Link>
        </div>
      )}
    </>
  )
}
