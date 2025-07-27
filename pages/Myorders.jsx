import React, { useEffect, useState } from 'react'
import Myordersitem from '../components/Myordersitem'
import { Link, useOutletContext } from 'react-router-dom'
import emailjs from 'emailjs-com'
import { useNavigate } from 'react-router-dom'
function Myorders() {
  const [myOrders, setMyOrders] = useState([])
  const navigate = useNavigate()
  const [isCancelling, setIsCancelling] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const username = localStorage.getItem('username')
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  // console.log(myOrders)
  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!username) {
        console.log('User not logged in')
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
        return
      }

      try {
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`
        )
        if (!userResponse.ok) {
          console.error('Failed to fetch user details. User not found.')
          return
        }
        const user = await userResponse.json()

        const ordersResponse = await fetch(
          `http://localhost:8080/api/orders/user/${user.id}`
        )
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders')
        }

        const orders = await ordersResponse.json()
        if (orders && orders.length > 0) {
          setMyOrders(orders)
          // console.log(orders)
        } else {
          // console.log('No orders found for the user')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    fetchMyOrders()
  }, [username])

  useEffect(() => {
    if (!username) {
      navigate('/') // redirect if not logged in
    }
  }, [username])
  if (!username) {
    return null // Don't render anything until redirect is done
  }

  const handleCancelOrder = async (orderId, orderItems) => {
    console.log(orderId)

    const confirm = window.confirm(
      'Are you sure you want to cancel this order?'
    )
    if (!confirm) return

    setIsCancelling(true)
    const emailSentKey = `cancelEmailSent_${orderId}`
    if (localStorage.getItem(emailSentKey)) {
      console.log('Email for this cancelled order already sent.')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/cancel/${orderId}`,
        {
          method: 'DELETE',
        }
      )

      if (res.ok) {
        

        // await sendCancelOrderEmail
        // ({
        //   username,
        //   order_Id: orderId,
        //   cartItems: orderItems,
        // }) // ✅ Mark email as sent

        localStorage.setItem(emailSentKey, 'true') // ✅ Remove cancelled order from state

        setMyOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        )

        setTimeout(() => {
          setIsCancelling(false)
          navigate('/OrderCancelConfirm', {
            state: { username },
          })
        }, 2500)
      } else {
        setTimeout(() => {
          setIsCancelling(false)
          alert('Failed to cancel the order. Please try after some time')
        }, 2000)
      }
    } catch (err) {
      console.error('Cancel order failed:', err)
    }
  }

  const sendCancelOrderEmail = async ({ username, cartItems, order_Id }) => {
    if (!username || !cartItems || !order_Id) {
      console.error('Invalid cancellation data')
      return
    }

    const fetchDetailsFromDB = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${username}`
        )
        if (response.ok) {
          return await response.json()
        } else {
          console.error('Failed to fetch details for:', username)
          return null
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
        return null
      }
    }

    const userDetails = await fetchDetailsFromDB(username)
    const adminUsername = localStorage.getItem('adminname')
    const adminDetails = await fetchDetailsFromDB(adminUsername)

    if (!userDetails || !adminDetails) {
      console.error('User or admin details not found for email')
      return
    }

    const { email, phone, address } = userDetails

    const products = cartItems.map((item) => ({
      product_name: item.product.title,
      quantity: item.quantity,
      product_price: parseFloat(item.product.price).toFixed(2),
      total_price: (item.quantity * parseFloat(item.product.price)).toFixed(2),
    }))

    const productDetailsString = products
      .map(
        (item) =>
          `Product: ${item.product_name}\nQty: ${item.quantity}\nPrice: $${item.product_price}\nTotal Amount: $${item.total_price}\n`
      )
      .join('\n')

    const completeTotal = products
      .reduce((sum, item) => sum + parseFloat(item.total_price), 0)
      .toFixed(2)

    const emailParams = {
      username,
      useremail: email,
      user_phone: phone,
      user_address: address,
      order_Id,
      productDetails: productDetailsString,
    } // ✅ Send email to user

    emailjs
      .send(
        'service_1he3ion',
        'template_ol5hoqk', // Replace with your actual template ID for user
        emailParams,
        'pr4jd_3t8afuSTqrN' // Your EmailJS public key
      )
      .then((res) => {
        console.log('Cancellation email sent to user successfully', res)
      })
      .catch((err) => {
        console.error('Failed to send cancellation email to user:', err)
      }) // ✅ Send email to admin

    const adminEmailParams = {
      ...emailParams,
      admin_email: adminDetails.email,
      subject: `Order Cancelled: ${order_Id}`,
      Name: 'Shopee',
    }

    emailjs
      .send(
        'service_1he3ion',
        'template_fcgtpi2', // Replace with your actual template ID for admin
        adminEmailParams,
        'pr4jd_3t8afuSTqrN'
      )
      .then((res) => {
        console.log('Cancellation email sent to admin successfully', res)
      })
      .catch((err) => {
        console.error('Failed to send cancellation email to admin:', err)
      })
  }

  if (isCancelling) {
    return (
      <div className="admin">
        <h1 style={{ textAlign: 'center' }}>Cancelling your order...</h1>
      </div>
    )
  }

  return (
    <div className={`order-container`}>
      {isLoading ? (
        <div className="admin">
          <h1>Loading Order Details...</h1>
        </div>
      ) : myOrders.length === 0 ? (
        <div className="admin retu">
          <h1>No Orders Yet</h1>
          <Link to="/Home">
            <button>Return to Shop</button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="ordhead">My Orders</h1>
          <div className={`order-grid ${dark ? 'dark' : ''}`}>
            <div className="grid-header">
              <div className="amp u header-item">Order ID</div>
              <div className="amp us header-item">Order Date</div>
              <div className="amp o header-item">Order Details</div>
              <div className="amp t header-item">Total Price</div>
              <div className="amp header-item">Cancel</div> 
            </div>
            <div className="grid-body">
              {myOrders.map((order, orderIndex) => (
                <div key={order.id} className="grid-row">
                  <div className="amp grid-item username-column">
                    {order.orderId}
                  </div>
                  <div className="amp grid-item user-details-column">
                    {new Date(order.orderDate).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true,
                    })}
                  </div>

                  <div className="grid-item orders-column">
                    {order.orderItems.map((orderItem, itemIndex) => (
                      <div
                        className="ord"
                        key={`${order.id}-${orderItem.product.id}-${itemIndex}`}
                      >
                        <Link to={`/${orderItem.product.id}`}>
                          <span className="userord amp">
                            Product: {orderItem.product.title}
                          </span>
                        </Link>
                        <span className="amp">
                          Quantity: {orderItem.quantity}
                        </span>
                        <span className="amp">
                          Price: ${orderItem.product.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="amp grid-item total-price-column">
                    ${order.orderTotal.toFixed(2)}
                  </div>
                  <div className="amp grid-item cancel-button-column">
                    <button
                      className="cancel-btn"
                      onClick={() =>
                        handleCancelOrder(order.orderId, order.orderItems)
                      }
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Myorders
