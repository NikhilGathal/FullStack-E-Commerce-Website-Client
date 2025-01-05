

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import './ModalSign.css'
import { Link } from 'react-router-dom'

export default function ModalSign({ issign, setissign, setsignname ,setislog}) {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    address: '',
    isAdmin: false, // New state for checking admin
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle checkbox change for Admin selection
  const handleAdminChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      isAdmin: e.target.checked,
    }))
  }

  
  const handleSignIn = async () => {
    const errorMessages = []
  
    // Validate fields
    if (!userData.username.trim()) errorMessages.push('Username is required.')
    if (!userData.password.trim()) errorMessages.push('Password is required.')
    if (!userData.phone.trim()) errorMessages.push('Phone number is required.')
    if (!userData.email.trim()) errorMessages.push('Email is required.')
    if (!userData.address.trim()) errorMessages.push('Address is required.')
  
    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'))
      return
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          phone: userData.phone,
          email: userData.email,
          address: userData.address,
          isAdmin: userData.isAdmin ? 1 : 0,
        }),
      })
  
      
      const result = await response.json()
  
      if (response.ok) {
        alert('Sign Up successful! Please proceed to login.')

        if (userData.isAdmin) {
          localStorage.setItem('adminname', userData.username)
        }

        setsignname(true)
        setissign(false)
        resetForm()
      } else {
        // Check the error response to display the correct error message
        if (result.email) {
          alert('Email already exists. Please choose another email.')
        } else if (result.username) {
          alert('Username already exists. Please choose another username.')
        } else if (result.isAdmin === 1) {
          alert('Admin already exists. Only one admin is allowed. Please Sign in as normal User')
        } else {
          alert(result.message || 'Sign Up failed. Please try again.')
        }
      }
    } catch (error) {
      alert('Error during sign-up. Please try again later.')
      console.error('Sign-up error:', error)
    }
  }

  // Function to reset the form
  const resetForm = () => {
    setUserData({
      username: '',
      password: '',
      phone: '',
      email: '',
      address: '',
      isAdmin: false,
    })
  }

  return createPortal(
    <div
      onClick={() => setissign(false)}
      className={`modal-overlay ${issign ? '' : 'hidden'}`}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal-box">
        <div className="modal-heading">Sign Up</div>
        <div className="modal-form">
          <input
            placeholder="Username"
            className="modal-input"
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
          <input
            placeholder="Password"
            className="modal-input"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          <input
            placeholder="Phone no"
            className="modal-input"
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
          />
          <input
            placeholder="Email"
            className="modal-input"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          <textarea
            placeholder="Address"
            className="modal-input"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />

          {/* Admin checkbox */}
          <div className="signup-role-container">
            <input
            className='check'
              type="checkbox"
              name="isAdmin"
              checked={userData.isAdmin}
              onChange={handleAdminChange}
            />
            <label>Sign up as Admin</label>
          </div>
          <div className='already'>
            {' '}
            <p>If you have Account ?</p>
          <Link>
          <h1 
           onClick={(e) => {
            setissign(false)
            setislog(true)
          }}
            className='.H'>Login</h1>         
          </Link>
          </div>


        </div>
        <div className="modal-buttons">
          <button onClick={() => setissign(false)} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSignIn} className="signin-button">
            Sign Up
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('portal')
  )
}
