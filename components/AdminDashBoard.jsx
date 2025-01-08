// import React, { useEffect, useState } from "react";
// import "./OrderList.css";
// import { useOutletContext } from "react-router-dom";

// function AdminDashBoard() {
//   const [setissign, dark, isdark, issign, userlogin] = useOutletContext();
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:8080/api/orders/allUsersWithOrders"
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setOrders(data);
//         } else {
//           console.error("Failed to fetch orders:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setTimeout( ()=> 
//           {
//             setIsLoading(false);
//           } ,1000)
//       }
//     };

//     fetchOrders();
//   }, []);

//   const hasOrders = orders.length > 0;

//   if (isLoading) {
//     return (
//       <div className="admin"> 
//         <h1>
//         Loading Orders Details...
//       </h1>
//       </div>
//     );
//   }

//   // Function to format date to "6 January 2025 at 04:37:23 pm"
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', { 
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//       hour12: true
//     });
//   };

//   const groupedOrders = orders.reduce((acc, order) => {
//     const { id, username, email, address, phone, products, order_Id, orderDate } = order;
//     if (!acc[id]) {
//       acc[id] = {
//         username,
//         email,
//         address,
//         phone,
//         items: [],
//         totalPrice: 0,
//         order_Id,
//         orderDate
//       };
//     }
//     products.forEach((item) => {
//       const totalPrice = item.productPrice * item.quantity;
//       acc[id].items.push({ title: item.productName, quantity: item.quantity ,productId:item.productId ,Price: item.productPrice });
//       acc[id].totalPrice += totalPrice;
//     });
//     return acc;
//   }, {});

//   return (
//     <>
//      {hasOrders && ( <h1 className="ordhead">Order Details</h1>)}
//       <div className={`order-grid ${dark ? "dark" : ""}`}>
//         {hasOrders && (
//           <div className="grid-header">
//             <div className="amp u header-item">Username</div>
//             <div className="amp us header-item">User Details</div>
//             <div className="amp o header-item">Orders Details</div>
//             <div className="amp t header-item">Total Price</div>
//           </div>
//         )}

//         <div className="grid-body">
//           {Object.keys(groupedOrders).map((orderId, index) => {
//             const { username, email, address, phone, items, totalPrice ,order_Id, orderDate } = groupedOrders[orderId];
//             console.log(order_Id);
            
//             if (!items || items.length === 0) {
//               return null;
//             }

//             return (
//               <div key={orderId} className="grid-row">
//                 <div className="amp grid-item username-column">
//                   {username}
//                   <p>OrderId: {order_Id}</p>
//                   <p>Order Date: {formatDate(orderDate)}</p> {/* Display formatted date */}
//                 </div>
//                 <div className="amp grid-item user-details-column">
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
//                 <div className="grid-item orders-column">
//                   {items.map((item, index) => (
//                     <div className="ord" key={index}>
//                       <span className="amp">Product: {item.title}</span>
//                       <span className="amp">Product ID: {item.productId}</span>
//                       <span className="amp">Quantity: {item.quantity}</span>
//                       <span className="amp">Price: ${item.Price.toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="amp grid-item total-price-column">
//                   ${totalPrice.toFixed(2)}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {!hasOrders && !isLoading && <div className="admin"> <h1 >No Orders Yet</h1> </div>}
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
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchOrders();
  }, []);

  const hasOrders = orders.length > 0;

  // Function to format date to "6 January 2025 at 04:37:23 pm"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  const groupedOrders = orders.reduce((acc, order) => {
    const { id, username, email, address, phone, products, order_Id, orderDate } = order;
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
      };
    }
    products.forEach((item) => {
      const totalPrice = item.productPrice * item.quantity;
      acc[id].items.push({
        title: item.productName,
        quantity: item.quantity,
        productId: item.productId,
        Price: item.productPrice,
      });
      acc[id].totalPrice += totalPrice;
    });
    return acc;
  }, {});

  return (
    <div className={`order-container ${dark ? "dark" : ""}`}>
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
          <div className="order-grid">
            <div className="grid-header">
              <div className="amp u header-item">Username</div>
              <div className="amp us header-item">User Details</div>
              <div className="amp o header-item">Orders Details</div>
              <div className="amp t header-item">Total Price</div>
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
                } = groupedOrders[orderId];

                if (!items || items.length === 0) {
                  return null;
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
        </>
      )}
    </div>
  );
}

export default AdminDashBoard;
