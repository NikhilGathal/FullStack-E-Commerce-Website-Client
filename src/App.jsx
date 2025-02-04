import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

import './App.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { loadCartItemsFromLocal } from '../store/slices/cartSlice'
import { useDispatch } from 'react-redux'
import { loadWishItem } from '../store/slices/wishListSlice'

export default function App() {
  const dispatch = useDispatch()

  const [issign, setissign] = useState(false)
  // const [dark ,isdark] = useState(false)
  const [userlogin, setuserlogin] = useState(JSON.parse(localStorage.getItem("userlogin"))|| false)
  console.log('app comp ' + userlogin);

  const [dark, isdark] = useState(
    JSON.parse(localStorage.getItem('isdarkmode'))
  )

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedIsAdmin = localStorage.getItem('isAdmin')
    return storedIsAdmin === 'true' // Check if stored value is 'true'
  })
  // localStorage.setItem('isAdmin' , isAdmin)
  // console.log('value for isadmin ' ,isAdmin);
  const [checkuserlogin, setcheckuserlogin] = useState(false)
  // console.log(checkuserlogin);
  
  // console.log(checkuserlogin+  ' rerendering ');

  const [uname1, setUsername] = useState(localStorage.getItem('username') || '')
  // console.log("uname is " +   uname1);

  useEffect(() => {
    const fetchUserIdAndCart = async () => {
      try {
        // Step 1: Retrieve the username from localStorage
        const username = localStorage.getItem('username')
        const cartKey = 'cartItems' // Key for localStorage

        if (isAdmin) {
          console.log('Admin is logged in')
          return;
        }

        if (!username && !isAdmin) {
          console.log('No user is logged in. Fetching cart from localStorage.')
          // Fetch cart items from localStorage for guest user
          const storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
          dispatch(loadCartItemsFromLocal(storedCart))
          return
        }

        // console.log('Logged in user:', username);

        // Step 2: Fetch user details by username to get the userId
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`
        )

        if (!userResponse.ok) {
          console.error('User not found')
          return
        }

        const user = await userResponse.json() // Assuming the response contains user details including ID
        // console.log('Fetched user:', user);

        // Step 3: Fetch cart items using the userId
        const cartResponse = await fetch(
          `http://localhost:8080/api/cart?userId=${user.id}`
        )

        if (cartResponse.ok) {
          const cartData = await cartResponse.json()
          // console.log('Fetched cart from database:', cartData);

          // Map cart items to the desired format
          const formattedCartData = cartData.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            title: item.product.title,
            price: item.product.price,
            description: item.product.description,
            category: item.product.category,
            image: item.product.image,
            rating: item.product.rating.rate,
          }))

          // Dispatch cart items to the Redux store
          dispatch(loadCartItemsFromLocal(formattedCartData))
        } else {
          console.error('Failed to fetch cart items from backend')
        }
      } catch (error) {
        console.error('Error fetching user/cart:', error)
      }
    }

    fetchUserIdAndCart()
  }, [dispatch, checkuserlogin])

  useEffect(() => {
    const fetchUserIdAndWishlist = async () => {
      try {
        // Step 1: Retrieve the username from localStorage
        const username = localStorage.getItem('username')
        const wishlistKey = 'wishItems' // Key for localStorage

        if (isAdmin) {
          return
        }

        if (!username && !isAdmin) {
          // console.log(
          //   'No user is logged in. Fetching wishlist from localStorage.'
          // )

          // Fetch wishlist items from localStorage for guest user
          const storedWishlist =
            JSON.parse(localStorage.getItem(wishlistKey)) || []
          dispatch(loadWishItem(storedWishlist))
          return
        }

        // console.log('Logged in user:', username);

        // Step 2: Fetch user details by username to get the userId
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`
        )

        if (!userResponse.ok) {
          console.error('User not found')
          return
        }

        const user = await userResponse.json() // Assuming the response contains user details including ID
        // console.log('Fetched user:', user);

        // Step 3: Fetch wishlist items using the userId
        const wishlistResponse = await fetch(
          `http://localhost:8080/api/wishlist/wishlist?userId=${user.id}`
        )

        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json()
          // console.log('Fetched wishlist from database:', wishlistData);

          // Map wishlist items to the desired format
          const formattedWishlistData = wishlistData.map((item) => ({
            productId: item.product.id,
            title: item.product.title,
            price: item.product.price,
            description: item.product.description,
            category: item.product.category,
            image: item.product.image,
            rating: item.product.rating.rate,
          }))

          // Dispatch wishlist items to the Redux store
          dispatch(loadWishItem(formattedWishlistData))
        } else {
          console.error('Failed to fetch wishlist items from backend')
        }
      } catch (error) {
        console.error('Error fetching user/wishlist:', error)
      }
    }

    fetchUserIdAndWishlist()
  }, [dispatch, checkuserlogin])

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
      debug: true,
    })
    AOS.refresh()

    return () => {
      document.body.classList.remove('dark')
    }
  }, [dark])

  return (
    <>
      <div className={`app-container ${dark ? 'dark' : ''}`}>
        <Header
          issign={issign}
          setissign={setissign}
          dark={dark}
          isdark={isdark}
          setuserlogin={setuserlogin}
          setIsAdmin={setIsAdmin}
          uname1={uname1}
          setUsername={setUsername}
          isAdmin={isAdmin}
          checkuserlogin={checkuserlogin}
          setcheckuserlogin={setcheckuserlogin}
          userlogin={userlogin}
        />
        <Outlet
          context={[
            setissign,
            dark,
            isdark,
            issign,
            userlogin,
            uname1,
            setUsername,
          ]}
        />
      </div>
    </>
  )
}
