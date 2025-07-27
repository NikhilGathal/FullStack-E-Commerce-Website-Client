import React, { useEffect, useState } from 'react'
import emailjs from 'emailjs-com'
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom'
const OrderConfirmation = () => {
  const navigate = useNavigate()
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  const [selected, setSelected] = useState(0)
  const [count, setCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const location = useLocation()
  const [issub, setissub] = useState(false)
  const { username, cartItems, totalPrice, order_Id } = location.state || {}
  const user = localStorage.getItem('userlogin') === 'true'

  useEffect(() => {
    if (!user) {
      navigate('/') // redirect if not logged in
    }
  }, [user])

  if (!user) {
    return null // Don't render anything until redirect is done
  }
  // Fetch details (common for user and admin)
  const fetchDetailsFromDB = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${username}`
      )
      if (response.ok) {
        const userDetails = await response.json()
        return userDetails
      } else {
        console.error('Failed to fetch details for:', username)
        return null
      }
    } catch (error) {
      console.error('Error fetching details:', error)
      return null
    }
  }

  const sendOrderEmail = async () => {
    if (!username || !cartItems) {
      console.error('Invalid order data')
      return
    }

    const userDetails = await fetchDetailsFromDB(username)
    const adminUsername = localStorage.getItem('adminname')
    const adminDetails = await fetchDetailsFromDB(adminUsername)

    if (userDetails && adminDetails) {
      const { email, phone, address } = userDetails
      const date = new Date()
      const formattedDate = date.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      })
      // const order_id = `OD${Date.now()}`

      const products = cartItems.map((item) => ({
        product_name: item.title,
        quantity: item.quantity,
        product_price: parseFloat(item.price).toFixed(2),
        total_price: (parseFloat(item.price) * item.quantity).toFixed(2),
      }))

      const productDetailsString = products
        .map(
          (item) =>
            `Product: ${item.product_name}\nQty: ${item.quantity}\nPrice: $${item.product_price}\nTotal Amount: $${item.total_price}\n\n`
        )
        .join('')

      const completeTotal = products
        .reduce((sum, item) => sum + parseFloat(item.total_price), 0)
        .toFixed(2)

      const emailParams = {
        username,
        useremail: email,
        user_phone: phone,
        user_address: address,
        formattedDate,
        order_Id,
        productDetails: productDetailsString,
        totalOrderPrice: parseFloat(totalPrice || 0).toFixed(2),
        completeTotal,
      }

      // Send email to user
      emailjs
        .send(
          'service_xdyg5f6', // Service ID
          'template_9w8s44b', // Template ID
          emailParams,
          'e1rMsTvTE-ncRNQc2' // Public key
        )
        .then((response) => {
          console.log('Email sent to user successfully', response)
        })
        .catch((error) => {
          console.error('Error sending email to user', error)
        })

      // Send email to admin
      const adminEmailParams = {
        ...emailParams,
        admin_email: adminDetails.email,
        subject: `New Order Received: ${order_Id}`,
        Name: 'Shopee',
      }

      emailjs
        .send(
          'service_xdyg5f6', // Service ID
          'template_6x3qvh3', // Template ID
          adminEmailParams,
          'e1rMsTvTE-ncRNQc2' // Public key
        )
        .then((response) => {
          console.log('Email sent to admin successfully', response)
        })
        .catch((error) => {
          console.error('Error sending email to admin', error)
        })
    } else {
      console.error('User or admin details not found')
    }
  }

  useEffect(() => {
    const hasSentEmail = localStorage.getItem(`emailSentForOrder_${order_Id}`)

    if (!hasSentEmail && username && cartItems) {
      sendOrderEmail()
      localStorage.setItem(`emailSentForOrder_${order_Id}`, 'true') // ✅ Set flag
    }
  }, [])

  useEffect(() => {
    if (order_Id) {
      const savedRating = localStorage.getItem(`rating_${order_Id}`)
      if (savedRating) {
        setCount(Number(savedRating))
        setSelected(savedRating)
        setSubmitted(true)
      } else {
        setSubmitted(false)
      } // ✅ Allow UI to render (whether rating is found or not)

      setissub(true)
    }
  }, [order_Id])

  const handleStarClick = (val) => {
    if (!submitted) {
      setSelected(val)
    }
  }

  const handleSubmitRating = async (val) => {
    if (!order_Id) return

    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/rating/${order_Id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating: val }),
        }
      )

      if (res.ok) {
        setCount(val)
        setSubmitted(true)
        localStorage.setItem(`rating_${order_Id}`, val)
        console.log('Rating updated successfully')
      } else {
        console.error(
          'Failed to update rating — Server responded with error status'
        )
        alert('Failed to submit rating. Please try again.')
      }
    } catch (err) {
      console.error('Network or server error:', err)
      alert('Something went wrong while submitting your rating.')
    }
  }

  return (
    <>
      <div className="order-confirm">
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, {username}!</p>
        <p>We have sent the order details to your email.</p>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          {issub &&
            (!submitted ? (
              <>
                <h2>Rate your experience</h2>
                <div style={{ marginTop: '10px' }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <span
                      className="staro"
                      key={val}
                      onClick={() => handleStarClick(val)}
                      style={{
                        color:
                          (submitted ? count : selected) >= val
                            ? dark
                              ? 'gold'
                              : '#ff6340'
                            : 'grey',

                        cursor: 'pointer',
                      }}
                    >
                      {(submitted ? count : selected) >= val ? '★' : '☆'}
                    </span>
                  ))}
                </div>

                <button
                  className="ordc"
                  onClick={() => handleSubmitRating(selected)}
                  style={{
                    marginTop: '15px',

                    cursor: selected > 0 ? 'pointer' : 'not-allowed',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    border: '2px solid black',
                  }}
                  disabled={selected === 0}
                >
                  {' '}
                  Submit Rating
                </button>
              </>
            ) : (
              <p style={{ fontSize: '24px', marginTop: '20px' }}>
                ✅ Thanks for rating us {count} star{count > 1 ? 's' : ''}!
              </p>
            ))}
        </div>
      </div>
      <div className="ord">
        <Link to="/Home">
          <button className="ordc">Continue shopping</button>
        </Link>
      </div>
    </>
  )
}
export default OrderConfirmation
