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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
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

  if (isPlacingOrder) {
    return (
      <div className="admin">
        <h1 style={{ textAlign: 'center' }}>Processing your order...</h1>
      </div>
    )
  }

  return (
    <>
      {cartItems.length ? (
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
                  onClick={async () => {
                    const username = localStorage.getItem('username')
                    const admin = localStorage.getItem('adminname')
                    const order_Id = 'OD' + Date.now()

                    if (!admin) {
                      alert('Sign up as admin first before placing an order.')
                      return
                    }

                    if (!username) {
                      alert('Please login first to place an order')
                      return
                    }

                    try {
                      let allInStock = true

                      for (const item of cartItems) {
                        const response = await fetch(
                          `http://localhost:8080/api/products/${item.id}`
                        )
                        if (!response.ok) {
                          throw new Error(
                            `Failed to fetch stock for ${item.title}`
                          )
                        }

                        const product = await response.json()
                        const available = product.rating?.count || 0

                        if (available === 0) {
                          alert(
                            `"${item.title}" is out of stock. Please remove it from the cart before placing the order.`
                          )
                          allInStock = false
                          break
                        }

                        if (available < item.quantity) {
                          alert(
                            `"${item.title}" has only ${available} in stock. You added ${item.quantity}. Please update your cart then try to place order.`
                          )
                          allInStock = false
                          break
                        }
                      }

                      if (!allInStock) {
                        // setIsPlacingOrder(false)
                        return
                      }

                      setIsPlacingOrder(true)

                      for (const item of cartItems) {
                        const delta = -item.quantity
                        await fetch(
                          `http://localhost:8080/api/products/stock/${item.id}/${delta}`,
                          {
                            method: 'PUT',
                          }
                        )
                      }

                      const response = await fetch(
                        'http://localhost:8080/api/orders/place',
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            username,
                            order_Id,
                          }),
                        }
                      )

                      const result = await response.text()

                      if (result === 'Order placed successfully!') {
                        // dispatch(removeallCartItem())

                        // ✅ Wait 3 seconds before navigating
                        setTimeout(() => {
                          setIsPlacingOrder(false)
                          navigate('/OrderConfirmation', {
                            state: {
                              username,
                              cartItems,
                              totalPrice,
                              order_Id,
                            },
                              
                          })
                          dispatch(removeallCartItem())
                        }, 3000) // 3000ms = 3 seconds
                      } else {
                        alert(result || 'Failed to place order. Try again.')
                      }
                    } catch (error) {
                      console.error('Error placing order:', error)
                      alert('Error placing order. Please try again.')
                    }
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
