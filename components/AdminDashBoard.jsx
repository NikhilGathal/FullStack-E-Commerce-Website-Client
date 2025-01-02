


// import React, { useEffect, useState } from 'react'
// import './OrderList.css'
// import { useOutletContext } from 'react-router-dom'

// function AdminDashBoard() {
//   const [setissign, dark, isdark, issign, userlogin] = useOutletContext()

//   const [orders, setOrders] = useState([])
//   // const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const handleResize = () => {
//       // setIsMobile(window.innerWidth <= 600)
//     }
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:8080/api/orders/allUsersWithOrders'
//         )
//         if (response.ok) {
//           const data = await response.json()
//           setOrders(data)
//         } else {
//           console.error('Failed to fetch orders:', response.statusText)
//         }
//       } catch (error) {
//         console.error('Error fetching orders:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchOrders()
//   }, [])

//   const hasOrders = orders.length > 0

//   if (isLoading) {
//     return (
//       <h1 className="Load" style={{ textAlign: 'center' }}>
//         Loading My Orders...
//       </h1>
//     );
//   }

//   const groupedOrders = orders.reduce((acc, order) => {
//     const { id, username, email, address, phone, products } = order;  // Correctly use the response data structure
//     if (!acc[id]) {
//       acc[id] = {
//         username,
//         email,
//         address,
//         phone,
//         items: [],
//         totalPrice: 0,
//       };
//     }
//     products.forEach(item => {  // Iterate over products to calculate total price and quantity
//       const totalPrice = item.productPrice * item.quantity;
//       acc[id].items.push({ title: item.productName, quantity: item.quantity, totalPrice });
//       acc[id].totalPrice += totalPrice;
//     });
//     return acc;
//   }, {});

//   return (
//     <>
//       <div className={`order-grid ${dark ? 'dark' : ''}`}>
//         {hasOrders && (
//           <div className="grid-header">
//             <div className="u header-item">Username</div>
//             <div className="us header-item">User Details</div>
//             <div className="o header-item">Orders</div>
//             <div className="t header-item">Total Price</div>
//           </div>
//         )}
//         <div className="grid-body">
//           {Object.keys(groupedOrders).map((orderId, index) => {
//             // Access the grouped order using the orderId
//             const { username, email, address, phone, items, totalPrice } = groupedOrders[orderId];

//             if (!items || items.length === 0) {
//               return null;
//             }
//             // const gridColumnStyle = isMobile ? { gridColumn: index + 2 } : {};

//             return (
//               <div key={orderId} className="grid-row">
//                 <div 
//                 className="grid-item username-column">{username}</div>
//                 <div  className="grid-item user-details-column">
//                   {email || phone || address ? (
//                     <div>
//                       {email && <p>Email: {email}</p>}
//                       {phone && <p>Phone: {phone}</p>}
//                       {address && <p>Address: {address}</p>}
//                     </div>
//                   ) : (
//                     <p>No user details available</p>
//                   )}
//                 </div>
//                 <div  className="grid-item orders-column">
//                   {items.map((item, index) => (
//                     <div className="ord" key={index}>
//                       <span>Product: {item.title}</span>
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Total Price: ${item.totalPrice.toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div  className="grid-item total-price-column">
//                   ${totalPrice.toFixed(2)}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Move the heading outside the grid container */}
//       {!hasOrders && !isLoading && <h1 className="admin">No Orders Yet</h1>}
//     </>
//   );
// }

// export default AdminDashBoard;


import React, { useEffect, useState } from "react";
import "./OrderList.css";
import { useOutletContext } from "react-router-dom";

function AdminDashBoard() {
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/orders/allUsersWithOrders"
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setTimeout( ()=> 
          {
            setIsLoading(false);
          } ,1000)
      }
    };

    fetchOrders();
  }, []);

  const hasOrders = orders.length > 0;

  if (isLoading) {
    return (
      <h1 className="Load" style={{ textAlign: "center" }}>
        Loading Orders Details...
      </h1>
    );
  }

  const groupedOrders = orders.reduce((acc, order) => {
    const { id, username, email, address, phone, products,order_Id } = order;
    if (!acc[id]) {
      acc[id] = {
        username,
        email,
        address,
        phone,
        items: [],
        totalPrice: 0,
        order_Id
      };
    }
    products.forEach((item) => {
      const totalPrice = item.productPrice * item.quantity;
      acc[id].items.push({ title: item.productName, quantity: item.quantity ,productId:item.productId ,Price: item.productPrice });
      acc[id].totalPrice += totalPrice;
    });
    return acc;
  }, {});

  return (
    <>
      <div className={`order-grid ${dark ? "dark" : ""}`}>
        {hasOrders && (
          <div className="grid-header">
            <div className="amp u header-item">Username</div>
            <div className="amp us header-item">User Details</div>
            <div className="amp o header-item">Orders Details</div>
            <div className="amp t header-item">Total Price</div>
          </div>
        )}

        <div className="grid-body">
          {Object.keys(groupedOrders).map((orderId, index) => {
            const { username, email, address, phone, items, totalPrice ,order_Id } = groupedOrders[orderId];
            console.log(order_Id);
            

            if (!items || items.length === 0) {
              return null;
            }

            return (
              <div key={orderId} className="grid-row">
                <div className="amp grid-item username-column">{username} <p>OrderId: {order_Id}</p></div>
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
                <div className="grid-item orders-column">
                  {items.map((item, index) => (
                    <div className="ord" key={index}>
                      <span className="amp">Product: {item.title}</span>
                      <span className="amp">Product ID: {item.productId}</span>
                      <span className="amp">Quantity: {item.quantity}</span>
                      <span className="amp">Price: ${item.Price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="amp grid-item total-price-column">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!hasOrders && !isLoading && <h1 className="admin">No Orders Yet</h1>}
    </>
  );
}

export default AdminDashBoard;
