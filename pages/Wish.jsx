// import React, { useEffect, useState } from 'react'
// import Wishitem from '../components/Wishitem'
// import { useDispatch, useSelector } from 'react-redux'
// import { getAllWishItems } from '../store/slices/wishListSlice'
// import { Link, useNavigate } from 'react-router-dom'

// export default function Wish() {
//   const wishItems = useSelector(getAllWishItems)
//   const [isLoading, setIsLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchWishItems = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API fetch delay
//       setIsLoading(false)
//     }
//     fetchWishItems()
//   }, [])

//   if (isLoading) {
//     return <h1 className='Load' style={{ textAlign: 'center' }}>Loading Wishlist items...</h1> // Loading state
//   }

//   return (
//     <>
//       {wishItems.length ? (
//         <main className="cart-container">
//          <div className="cart-container">
//          <h2 className="item-wish">Wishlist Items</h2>
//          </div>
//           <div className="cart-items-container">
//             <div className="cart-header cart-item-container">
//               <div className="cart-item">Item</div>
//               <div className="price">Price</div>
//               <div className="quantity">Remove</div>
//             </div>
//             {wishItems.map(({ id, title, rating, price, image, quantity }) => (
//               <Wishitem
//                 key={id}
//                 productId={id}
//                 title={title}
//                 price={price}
//                 quantity={quantity}
//                 imageUrl={image}
//                 rating={rating.rate}
//               />
//             ))}
//           </div>
//         </main>
//       ) : (
//         <div className="empty-wish-container">
//           <h1 className='empty-wish'>Wishlist is empty</h1>
         
//         </div>
//       )}
//     </>
//   )
// }








import React, { useEffect, useState } from "react";
import Wishitem from "../components/Wishitem";
import { useDispatch, useSelector } from "react-redux";
import { getAllWishItems } from "../store/slices/wishListSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Wish() {
  const wishItems = useSelector(getAllWishItems);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishItems = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API fetch delay
      setIsLoading(false);
    };
    fetchWishItems();
  }, []);

  return (
    <div className="wish-container">
      {isLoading ? (
        <div className="admin">
          <h1>Loading Wishlist Items...</h1>
        </div>
      ) : wishItems.length === 0 ? (
        <div className="admin">
          <h1>Wishlist is Empty</h1>
        </div>
      ) : (
        <main className="cart-container">
          <div className="cart-container">
            <h2 className="item-wish">Wishlist Items</h2>
          </div>
          <div className="cart-items-container">
            <div className="cart-header cart-item-container">
              <div className="cart-item">Item</div>
              <div className="price">Price</div>
              <div className="quantity">Remove</div>
            </div>
            {wishItems.map(({ id, title, rating, price, image, quantity }) => (
              <Wishitem
                key={id}
                productId={id}
                title={title}
                price={price}
                quantity={quantity}
                imageUrl={image}
                rating={rating.rate}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

