// import React, { useEffect, useState } from 'react';
// import Myordersitem from '../components/Myordersitem';

// function Myorders() {
//   const [myOrders, setMyOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const username = localStorage.getItem('username');

//   useEffect(() => {

//    const myo = async ()=>
//    {

//     if (!username) {
//       console.log('User not logged in');
//       setTimeout( ()=> 
//       {
//         setIsLoading(false);
//       } ,1000)
//       // Set loading to false if no user is logged in
//       return; // Exit early if no user is logged in
//     }

//     const userResponse = await fetch(`http://localhost:8080/api/users/${username}`);

//     if (!userResponse.ok) {
//       console.error('Failed to fetch user details. User not found.');
//       return;
//     }

//     const user = await userResponse.json();

//     // Fetch orders from backend
//     fetch(`http://localhost:8080/api/orders/user/${user.id}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch orders');
//         }
//         return response.json(); // Parse the JSON response
//       })
//       .then((data) => {
//         if (data && data.length > 0) {
//           setMyOrders(data); // Set fetched orders to state
//         } else {
//           console.log('No orders found for the user');
//         }
//         setTimeout( ()=> 
//           {
//             setIsLoading(false);
//           } ,1000)// Set loading to false after fetching data
//       })
//       .catch((error) => {
//         console.error('Error fetching orders:', error);
//         setTimeout( ()=> 
//           {
//             setIsLoading(false);
//           } ,1000) // Set loading to false in case of error
//       });

//    }
//    myo()
   
//   }, [username]);

//   if (isLoading) {
//     return (
//       <h1 className="Load" style={{ textAlign: 'center' }}>
//         Loading My Orders...
//       </h1>
//     );
//   }

//   return (
//     <>
//       {myOrders.length > 0 ? (
//         <main className="cart-container">
//           <div className="cart-container">
//             <h2 className="item-wish">My Orders</h2>
//             <div className="cart-items-container">
//               <div className="cart-header cart-item-container">
//                 <div className="cart-item">Item</div>
//                 <div>Price</div>
//                 <div className="total"></div>
//               </div>
//               {myOrders.map((order, orderIndex) =>
//                 order.orderItems.map((orderItem, itemIndex) => (
//                   <Myordersitem
//                     key={`${order.id}-${orderItem.product.id}-${itemIndex}`} // Unique key combining order and product IDs
//                     productId={orderItem.product.id}
//                     title={orderItem.product.title}
//                     price={orderItem.product.price}
//                     quantity={orderItem.quantity}
//                     imageUrl={orderItem.product.image}
//                     rating={orderItem.product.rating.rate}
//                     index={itemIndex} // To keep track of the individual items within an order
//                   />
//                 ))
//               )}
//               <div className="cart-header cart-item-container">
//                 <div></div>
//                 <div></div>
//                 <div></div>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <div className="empty-wish-container">
//           <h1 className="empty-wish">No Orders Yet</h1>
//         </div>
//       )}
//     </>
//   );
// }

// export default Myorders;







import React, { useEffect, useState } from "react";
import Myordersitem from "../components/Myordersitem";

function Myorders() {
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!username) {
        console.log("User not logged in");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return;
      }

      try {
        const userResponse = await fetch(`http://localhost:8080/api/users/${username}`);
        if (!userResponse.ok) {
          console.error("Failed to fetch user details. User not found.");
          return;
        }
        const user = await userResponse.json();

        const ordersResponse = await fetch(
          `http://localhost:8080/api/orders/user/${user.id}`
        );
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }

        const orders = await ordersResponse.json();
        if (orders && orders.length > 0) {
          setMyOrders(orders);
        } else {
          console.log("No orders found for the user");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchMyOrders();
  }, [username]);

  return (
    <div className={`order-container`}>
      {isLoading ? (
        <div className="admin">
          <h1>Loading Order Details...</h1>
        </div>
      ) : myOrders.length === 0 ? (
        <div className="admin">
          <h1>No Orders Yet</h1>
        </div>
      ) : (
        <>
          <h1 className="ordhead">My Orders</h1>
          <div className="order-grid">
            <div className="grid-header">
              <div className="amp u header-item">Order ID</div>
              <div className="amp us header-item">Order Date</div>
              <div className="amp o header-item">Order Details</div>
              <div className="amp t header-item">Total Price</div>
            </div>
            <div className="grid-body">
              {myOrders.map((order, orderIndex) => (
                <div key={order.id} className="grid-row">
                  <div className="amp grid-item username-column">
                    {order.id}
                  </div>
                  <div className="amp grid-item user-details-column">
                    {new Date(order.orderDate).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: true,
                    })}
                  </div>
                  <div className="grid-item orders-column">
                    {order.orderItems.map((orderItem, itemIndex) => (
                      <Myordersitem
                        key={`${order.id}-${orderItem.product.id}-${itemIndex}`}
                        productId={orderItem.product.id}
                        title={orderItem.product.title}
                        price={orderItem.product.price}
                        quantity={orderItem.quantity}
                        imageUrl={orderItem.product.image}
                        rating={orderItem.product.rating.rate}
                        index={itemIndex}
                      />
                    ))}
                  </div>
                  <div className="amp grid-item total-price-column">
                    ${order.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Myorders;
