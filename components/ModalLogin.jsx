import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './ModalLogin.css'
import { Link, useNavigate } from 'react-router-dom'

export default function ModalLogin({
  islog,
  setislog,
  setusername,
  setuserlogin,
  setIsAdmin,
  setUsername,
  setcheckuserlogin,
  setissign,
  userlogin
}) {
  const existingAdmin = JSON.parse(localStorage.getItem('Admin')) || {}

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: '',
  })

  const [isForgotPassword, setIsForgotPassword] = useState(false) // Track forgot password state

  const navigate = useNavigate()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (isForgotPassword) {
      setNewPassword((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    } else {
      setLoginData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json() // Parse the JSON response
      // console.log(data);  // Debugging the response

      if (response.ok) {
        if (data.message === 'Login successful') {
          alert('Successfully logged in!')
          setusername(loginData.username)
          setUsername(loginData.username)
          setuserlogin(true)
          // localStorage.setItem("userlogin", JSON.stringify(true));
          setislog(false)
          setcheckuserlogin(true)
          setIsAdmin(data.admin)
          if (data.admin) {
            setislog(false)
            // localStorage.setItem('adminname', loginData.username) // Store admin username in localStorage
            localStorage.setItem('isAdmin', 'true') // Store 'true' as string in localStorage
            localStorage.setItem('username', loginData.username)
            setIsAdmin(true) // Update state to true
          } else {
            localStorage.setItem('username', loginData.username)
          }
          navigate('/')
        } else {
          alert(data.message)
        }
      } else {
        // Handle failed request like 401 Unauthorized
        alert('Failed request. Please try again later.')
      }
    } catch (error) {
      console.error('Error occurred during login:', error)
      alert('An error occurred. Please try again later.')
    }

    setLoginData({ username: '', password: '' })
  }

  const handleForgotPassword = async () => {
    // Check if the username field is empty
    if (!loginData.username.trim()) {
      alert('Please enter a valid username to reset the password.')
      return // Prevent further execution if the username is empty
    }
    // Make an API call to check if the username exists in the database
    const response = await fetch(
      `http://localhost:8080/api/users/forgot-password?username=${loginData.username}`
    )
    if (response.ok) {
      const message = await response.text()
      // Check if the response indicates that the username exists
      if (message === 'User found') {
        setIsForgotPassword(true) // Proceed to reset password for the user
      } else {
        alert('Username does not exist!') // If the username is not found in the database
        setLoginData({ username: '', password: '' }) // Reset login data
      }
    } else {
      alert('Failed to send reset link. Please try again later.')
    }
  }

  const handleSaveNewPassword = () => {
    // Check if any password field is empty
    if (!newPassword.password.trim() || !newPassword.confirmPassword.trim()) {
      alert('Please enter valid password in both fields.')
      return // Prevent further execution if any password field is empty
    }

    // Check if both passwords match
    if (newPassword.password !== newPassword.confirmPassword) {
      alert('Both passwords should match!')
      setNewPassword({ password: '', confirmPassword: '' })
      return // Prevent further execution if passwords do not match
    }

    // If both passwords match and are valid, proceed with API call
    fetch(
      'http://localhost:8080/api/users/reset-password?username=' +
        loginData.username +
        '&newPassword=' +
        newPassword.password,
      {
        method: 'POST',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        alert(data.message) // Show success or failure message
        if (data.message === 'Password reset successfully.') {
          // Reset UI and state if the password reset is successful
          setIsForgotPassword(false)
          setLoginData({ username: '', password: '' })
          setNewPassword({ password: '', confirmPassword: '' })
        }
      })
      .catch((error) => {
        alert('An error occurred while resetting the password')
        console.error('Error:', error)
      })
  }
  const m = () => {
    setislog(false)
    setIsForgotPassword(false)
  }

  useEffect(() => {
    localStorage.setItem("userlogin", JSON.stringify(userlogin));
  }, [userlogin]);

  return createPortal(
    <div onClick={m} className={`modal-overlay-log ${islog ? '' : 'hidden'}`}>
      <div onClick={(e) => e.stopPropagation()} className="modal-box-log">
        <div className="modal-heading">
          {isForgotPassword ? 'Reset Password' : 'LogIn'}
        </div>
        <div className="modal-form">
          {isForgotPassword ? (
            <>
              <input
                placeholder="Enter New Password"
                className="modal-input"
                type="password"
                name="password"
                value={newPassword.password}
                onChange={handleChange}
              />
              <input
                placeholder="Re-Enter New Password"
                className="modal-input"
                type="password"
                name="confirmPassword"
                value={newPassword.confirmPassword}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                placeholder="Username"
                className="modal-input"
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleChange}
              />
              <input
                placeholder="Password"
                className="modal-input"
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
              <div className="already">
                {' '}
                <p>If you dont have Account ?</p>
                <Link>
                  <h1
                    onClick={(e) => {
                    
                      setissign(true)
                      setislog(false)
                    }}
                    className=".H"
                  >
                    Sign In
                  </h1>
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="modal1-buttons">
          {isForgotPassword ? (
            <button onClick={handleSaveNewPassword} className="forgot-button">
              Save
            </button>
          ) : (
            <>
              <button onClick={handleLogin} className="login1-button">
                LogIn
              </button>
              <button onClick={() => setislog(false)} className="cancel1-button">
                Cancel
              </button>

              <button onClick={handleForgotPassword} className="forgot-button">
                Forgot Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('portal')
  )
}
