

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

  useEffect(() => {
    // Fetch item details from localStorage
    const fetchItemFromLocalStorage = () => {
      try {
        const productsList =
          JSON.parse(localStorage.getItem('productsList')) || []
        const product = productsList.find((p) => p.id === productId) // Find the product by ID

        if (!product) {
          throw new Error('Product not found')
        }
        setItem(product) // Set the product as the state
        setLoading(false) // Set loading to false
      } catch (err) {
        setError(err.message) // Handle error
        setLoading(false) // Set loading to false
      }
    }

    fetchItemFromLocalStorage()
  }, [productId])

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
            <button
              onClick={() => {
                const username = localStorage.getItem('username')
                const cartKey = username ? `${username}cart` : 'cartItems'
                let storedCart = JSON.parse(localStorage.getItem(cartKey)) || []

                // Check if the product already exists in the cart
                const existingProductIndex = storedCart.findIndex(
                  (cartItem) => cartItem.productId === productId
                )
                if (existingProductIndex !== -1) {
                  // If it exists, increment the quantity
                  storedCart[existingProductIndex].quantity += 1
                } else {
                  // If it doesn't exist, add a new object with productId and quantity
                  storedCart.push({ productId, quantity: 1 })
                }
                // Save the updated cart back to localStorage
                localStorage.setItem(cartKey, JSON.stringify(storedCart))
                // Dispatch the action to add to cart in Redux
                dispatch(addCartItem({ productId }))
              }}
            >
              Add to cart
            </button>
            <button
              onClick={() => {
                const username = localStorage.getItem('username')
                const wishKey = username ? `${username}wish` : 'wishItems'
                let storedWish = JSON.parse(localStorage.getItem(wishKey)) || []
                const existingProductIndex = storedWish.findIndex(
                  (wishItem) => wishItem.productId === productId
                )
                if (existingProductIndex !== -1) {
                  console.log('Product already in wishlist.')
                } else {
                  storedWish.push({ productId, quantity: 1 })
                }

                // Save the updated wishlist back to localStorage
                localStorage.setItem(wishKey, JSON.stringify(storedWish))

                // Dispatch the action to add to wishlist in Redux
                dispatch(addWishItem({ productId }))
              }}
            >
              Add to wishlist
            </button>
          </div>
        </div>
      </div>
      <Footer dark={dark} />
    </>
  )
}

export default ItemDetail
