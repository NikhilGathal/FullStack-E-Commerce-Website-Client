// src/pages/OrderCancelConfirm.jsx
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function OrderCancelConfirm() {
 const navigate = useNavigate()
  const user = localStorage.getItem('userlogin') === 'true'
    
      useEffect(() => {
        if (!user) {
          navigate('/') // redirect if not logged in
        }
      }, [user])
            if (!user) {
    return null // Don't render anything until redirect is done
  }
  const location = useLocation()
  const username = location.state?.username || 'User'
  return (
    <div className="order-confirm">
      <h1>Order Cancellation Confirmation</h1>
      <p>Hi {username}, your order has been successfully cancelled.</p>
      <p>We have sent the order cancellation details to your email.</p>

      <div className="ord">
        <Link to="/Home">
          <button>Continue Shopping</button>
        </Link>
      </div>
    </div>
  )
}
