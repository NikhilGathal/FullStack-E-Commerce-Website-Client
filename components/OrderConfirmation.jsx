import React from 'react'
import emailjs from 'emailjs-com'
import { Link, useLocation } from 'react-router-dom'

const OrderConfirmation = () => {
  const location = useLocation()
  const { username, cartItems, totalPrice } = location.state || {}

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
      const orderDate = new Date()
      const order_id = `OD${Date.now()}`

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
        .toFixed(2);

      const emailParams = {
        username,
        useremail: email,
        user_phone: phone,
        user_address: address,
        order_date: orderDate.toLocaleDateString(),
        order_id,
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
        subject: `New Order Received: ${order_id}`,
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

  React.useEffect(() => {
    sendOrderEmail()
  }, [])

  return (
    <>
    <div className="order-confirm">
    <h1>Order Confirmation</h1>
    <p>Thank you for your order, {username}!</p>
    <p>We have sent the order details to your email.</p>
  </div>
  <div className='ord'>
  <Link to="/">
          <button>Return to Shop</button>
        </Link>
  </div>
</>
  )
}

export default OrderConfirmation
