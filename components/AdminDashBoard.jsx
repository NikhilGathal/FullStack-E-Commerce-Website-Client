import React, { useEffect, useState } from 'react'
import './OrderList.css'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'

function AdminDashBoard() {
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const isAdminLog = localStorage.getItem('isadminlog') === 'true'
  useEffect(() => {
    if (!isAdminLog) {
      navigate('/')
    }
  }, [isAdminLog])

  if (!isAdminLog) {
    return null // ✅ Prevents rendering if admin is not logged in
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/orders/allUsersWithOrders'
        )
        if (response.ok) {
          const data = await response.json()

          setOrders(data)
        } else {
          console.error('Failed to fetch orders:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    fetchOrders()
  }, [])

  const hasOrders = orders.length > 0

  // Function to format date to "6 January 2025 at 04:37:23 pm"
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })
  }

  const groupedOrders = orders.reduce((acc, order) => {
    const {
      id,
      username,
      email,
      address,
      phone,
      products,
      order_Id,
      orderDate,
      rating, // ✅ include rating from backend
    } = order

    if (!acc[id]) {
      acc[id] = {
        username,
        email,
        address,
        phone,
        items: [],
        totalPrice: 0,
        order_Id,
        orderDate,
        rating, // ✅ store it
      }
    }
    products.forEach((item) => {
      const totalPrice = item.productPrice * item.quantity
      acc[id].items.push({
        title: item.productName,
        quantity: item.quantity,
        productId: item.productId,
        Price: item.productPrice,
      })
      acc[id].totalPrice += totalPrice
    })
    return acc
  }, {})

  return (
    <div className={`order-container ${dark ? 'dark' : ''}`}>
      {isLoading ? (
        <div className="admin a">
          <h1>Loading Order Details...</h1>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin a">
          <h1>No Orders Yet</h1>
        </div>
      ) : (
        <>
          <h1 className="ordhead">Order Details</h1>
          <div className={`order-grid ${dark ? 'dark' : ''}`}>
            <div className="grid-header">
              <div className="amp u header-item">Username</div>
              <div className="amp us header-item">User Details</div>
              <div className="amp o header-item">Orders Details</div>
              <div className="amp t header-item">Total Price</div>
              <div className="header-item amp">User Experience</div>{' '}
              {/* ⭐ Added */}
            </div>
            <div className="grid-body">
              {Object.keys(groupedOrders).map((orderId, index) => {
                const {
                  username,
                  email,
                  address,
                  phone,
                  items,
                  totalPrice,
                  order_Id,
                  orderDate,
                  rating,
                } = groupedOrders[orderId]

                if (!items || items.length === 0) {
                  return null
                }

                return (
                  <div key={orderId} className="grid-row">
                    <div className="amp grid-item username-column">
                      {username}
                      <p>OrderId: {order_Id}</p>
                      <p>Order Date: {formatDate(orderDate)}</p>
                    </div>
                    <div className="amp grid-item user-details-column">
                      {email || phone || address ? (
                        <div>
                          {email && <p>Email: {email}</p>}
                          {phone && <p>Phone: {phone}</p>}
                          {address && <p>Address: {address}</p>}
                        </div>
                      ) : (
                        <p>No user details available</p>
                      )}
                    </div>
                    <div className="grid-item orders-column ord">
                      {items.map((item, index) => (
                        <div className="ord" key={index}>
                          <Link to={`/${item.id}`}>
                            <span className="amp userord">
                              Product: {item.title}
                            </span>
                          </Link>

                          <span className="amp">
                            Product ID: {item.productId}
                          </span>
                          <span className="amp">Quantity: {item.quantity}</span>
                          <span className="amp">
                            Price: ${item.Price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="amp grid-item total-price-column">
                      ${totalPrice.toFixed(2)}
                    </div>
                    <div className="amp grid-item rating-column">
                      {rating > 0 ? (
                        <span className='stars'
                          style={{
                            color: dark ? 'gold' : '#ff6340',
                            
                          }}
                        >
                          {'★'.repeat(rating)}
                          {'☆'.repeat(5 - rating)}   {' '}
                        </span>
                      ) : (
                        <span style={{ color: 'grey' }}>No rating</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashBoard
