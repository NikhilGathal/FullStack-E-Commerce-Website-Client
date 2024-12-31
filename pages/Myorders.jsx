  // useEffect(() => {
  //   if (!username) {
  //     console.log('User not logged in')
  //     return // Exit early if no user is logged in
  //   }

  //   // Fetch orders from backend
  //   fetch(`http://localhost:8080/api/orders/user/${username}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch orders')
  //       }
  //       return response.json() // Parse the JSON response
  //     })
      
  //     .catch((data) => {
  //       if (!data || data.length === 0) {
          
  //         console.log('No orders found for the user')
  //         return // Exit early if no orders
  //       }
  //       console.log('Fetched orders:', data);
  //       setMyOrders(data) // Set fetched orders to state
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching orders:', error)
  //     })
  // }, [username])






// import React, { useEffect, useState } from 'react'
// import Myordersitem from '../components/Myordersitem'

// function Myorders() {
//   const [myOrders, setMyOrders] = useState([])
//   const [isLoading, setIsLoading] = useState(true);
//   const username = localStorage.getItem('username')
//   // console.log(myOrders)
//   // console.log(username)



//   useEffect(() => {
//     if (!username) {
//       console.log('User not logged in');
//       return; // Exit early if no user is logged in
//     }
  
//     // Fetch orders from backend
//     fetch(`http://localhost:8080/api/orders/user/${username}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch orders');
//         }
//         return response.json(); // Parse the JSON response
//       })
//       .then((data) => {
//         if (data && data.length > 0) {
//           // console.log('Fetched orders:', data); // Log the orders data
//           setMyOrders(data); // Set fetched orders to state
//           setTimeout(() => {
//             setIsLoading(false);
//           }, 500); 
//         } else {
//           console.log('No orders found for the user');
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching orders:', error);
//       });
//   }, [username]);
  

//   if (isLoading) {
//     return (
//       <h1 className="Load" style={{ textAlign: 'center' }}>
//         Loading My Orders...
//       </h1>
//     )
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
//   )
// }

// export default Myorders



import React, { useEffect, useState } from 'react';
import Myordersitem from '../components/Myordersitem';

function Myorders() {
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      console.log('User not logged in');
      setTimeout( ()=> 
      {
        setIsLoading(false);
      } ,1000)
      // Set loading to false if no user is logged in
      return; // Exit early if no user is logged in
    }

    // Fetch orders from backend
    fetch(`http://localhost:8080/api/orders/user/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        if (data && data.length > 0) {
          setMyOrders(data); // Set fetched orders to state
        } else {
          console.log('No orders found for the user');
        }
        setTimeout( ()=> 
          {
            setIsLoading(false);
          } ,1000)// Set loading to false after fetching data
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setTimeout( ()=> 
          {
            setIsLoading(false);
          } ,1000) // Set loading to false in case of error
      });
  }, [username]);

  if (isLoading) {
    return (
      <h1 className="Load" style={{ textAlign: 'center' }}>
        Loading My Orders...
      </h1>
    );
  }

  return (
    <>
      {myOrders.length > 0 ? (
        <main className="cart-container">
          <div className="cart-container">
            <h2 className="item-wish">My Orders</h2>
            <div className="cart-items-container">
              <div className="cart-header cart-item-container">
                <div className="cart-item">Item</div>
                <div>Price</div>
                <div className="total"></div>
              </div>
              {myOrders.map((order, orderIndex) =>
                order.orderItems.map((orderItem, itemIndex) => (
                  <Myordersitem
                    key={`${order.id}-${orderItem.product.id}-${itemIndex}`} // Unique key combining order and product IDs
                    productId={orderItem.product.id}
                    title={orderItem.product.title}
                    price={orderItem.product.price}
                    quantity={orderItem.quantity}
                    imageUrl={orderItem.product.image}
                    rating={orderItem.product.rating.rate}
                    index={itemIndex} // To keep track of the individual items within an order
                  />
                ))
              )}
              <div className="cart-header cart-item-container">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className="empty-wish-container">
          <h1 className="empty-wish">No Orders Yet</h1>
        </div>
      )}
    </>
  );
}

export default Myorders;

