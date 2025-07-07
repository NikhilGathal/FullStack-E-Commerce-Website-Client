import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  removeCartItem,
} from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'

export default function CartItem({
  productId,
  title,
  rating,
  price,
  imageUrl,
  quantity,
}) {
  const dispatch = useDispatch()
  let cartKey = 'cartItems';
  const [userId, setUserId] = useState(null)

   const [productStock, setProductStock] = useState(null);
    useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProductStock(data.rating?.count || 0);
        } else {
          console.error("Failed to fetch product stock");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
  
    fetchProductCount();
  }, [productId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Step 1: Retrieve the username from localStorage
        const username = localStorage.getItem('username');
        if (!username) {
          console.warn('Username not found in localStorage');
          return; // Early return if username is not found, so the rest of the code doesn't run
        }
  
        // Step 2: Fetch user details by username to get the userId
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`
        );
  
        if (!userResponse.ok) {
          console.error('User not found');
          return;
        }
  
        const user = await userResponse.json(); // Assuming the response contains user details including ID
        setUserId(user.id); // Set userId in state
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const username = localStorage.getItem('username');
    if (username) {
      fetchUserId(); // Only call fetchUserId if username exists
    }
  }, []); // Empty dependency array ensures this effect runs only once
  
  // Empty dependency array to run the effect only once on mount

  // const handleRemove = () => {
  //   if (userId) {
  //     fetch(
  //       `http://localhost:8080/api/cart/remove?userId=${userId}&productId=${productId}`,
  //       {
  //         method: 'DELETE', // Use DELETE method to remove the item
  //       }
  //     )
  //       .then((response) => response.text()) // Use .text() to handle plain text response
  //       .then((data) => {
  //         console.log('Response:', data) // Log the response to check if it's plain text
  //         // Handle the plain text response
  //         if (data === 'Product removed from cart') {
  //           dispatch(removeCartItem({ productId })) // Dispatch action to Redux to remove the item from the cart
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error removing item from cart:', error)
  //       })
  //   } else {
      
  //     let storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
  //     storedCart = storedCart.filter((item) => item.productId !== productId)

  //     // Save updated cart to localStorage
  //     localStorage.setItem(cartKey, JSON.stringify(storedCart))

  //     // Dispatch to update Redux store
  //     dispatch(removeCartItem({ productId }))
  //     console.log('Removed item from localStorage cart:', storedCart)
  //   }
  // }

const handleRemove = async () => {
  const cartKey = 'cartItems';
console.log(userId);

  if (userId) {
    try {
      // Step 1: Fetch the quantity of the item from the backend cart
      const res = await fetch(`http://localhost:8080/api/cart/item?userId=${userId}&productId=${productId}`);
      if (!res.ok) {
        console.error('Failed to fetch cart item');
        return;
      }
      const cartItem = await res.json();
      const removedQuantity = cartItem.quantity || 0;

      // Step 2: Increase the product stock in the database
      await fetch(`http://localhost:8080/api/products/stock/${productId}/${removedQuantity}`, {
        method: 'PUT',
      });
      setProductStock(prev => Math.max(prev + removedQuantity, 0)); 

      // Step 3: Remove the item from the user's cart
      const response = await fetch(
        `http://localhost:8080/api/cart/remove?userId=${userId}&productId=${productId}`,
        { method: 'DELETE' }
      );

      const result = await response.text();
      if (result === 'Product removed from cart') {
        dispatch(removeCartItem({ productId }));
        console.log('Item removed and stock restored successfully.');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }

  } else {
    // 🔹 For guest/localStorage users (fallback)
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const itemToRemove = storedCart.find(item => item.productId === productId);
    const removedQuantity = itemToRemove ? itemToRemove.quantity : 0;

    await fetch(`http://localhost:8080/api/products/stock/${productId}/${removedQuantity}`, {
      method: 'PUT',
    });

    const updatedCart = storedCart.filter(item => item.productId !== productId);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    dispatch(removeCartItem({ productId }));
    console.log('Removed from localStorage cart and updated stock.');
  }
};


const handleDecreaseQuantity = async () => {
  const cartKey = 'cartItems';

  if (userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/decrease?userId=${userId}&productId=${productId}`,
        {
          method: 'PUT',
        }
      );

      const data = await response.text();
      console.log('Response:', data);

      if (data === 'Quantity decreased') {
        dispatch(decreaseCartItemQuantity({ productId }));

        // Increase stock in DB since we decreased from cart
        await fetch(`http://localhost:8080/api/products/stock/${productId}/1`, {
          method: 'PUT',
        });
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  } else {
    // LocalStorage operation for guest users
    let storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingProductIndex = storedCart.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      storedCart[existingProductIndex].quantity -= 1;
      if (storedCart[existingProductIndex].quantity <= 0) {
        storedCart.splice(existingProductIndex, 1);
      }
    }

    localStorage.setItem(cartKey, JSON.stringify(storedCart));

    dispatch(decreaseCartItemQuantity({ productId }));
    console.log('Decreased quantity in localStorage cart:', storedCart);

    // Increase stock in DB for guest users as well (optional)
    await fetch(`http://localhost:8080/api/products/stock/${productId}/1`, {
      method: 'PUT',
    });
  }
};

const handleIncreaseQuantity = async () => {
  const cartKey = 'cartItems';

  if (userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/increase?userId=${userId}&productId=${productId}`,
        {
          method: 'PUT',
        }
      );

      const data = await response.text();
      console.log('Response:', data);

      if (data === 'Quantity increased') {
        dispatch(increaseCartItemQuantity({ productId }));

        // Decrease stock in the DB when quantity is increased
        await fetch(`http://localhost:8080/api/products/stock/${productId}/-1`, {
          method: 'PUT',
        });
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  } else {
    // Handle localStorage for guest user
    let storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingProductIndex = storedCart.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      storedCart[existingProductIndex].quantity += 1;
    } else {
      storedCart.push({ productId, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(storedCart));
    dispatch(increaseCartItemQuantity({ productId }));
    console.log('Increased quantity in localStorage cart:', storedCart);

    // Decrease stock in backend (optional for guest)
    await fetch(`http://localhost:8080/api/products/stock/${productId}/-1`, {
      method: 'PUT',
    });
    setProductStock(prev => Math.max(prev - 1, 0)); 
  }
};

  return (
    <div className="cart-item-container">
      <div className="cart-item">
        <Link to={`/${productId}`}>
          <img src={imageUrl} alt={title} />
        </Link>
        <div>
          <Link to={`/${productId}`}>
            <h3>{title}</h3>
          </Link>
          <p>{rating} ★ ★ ★ ★</p>
        </div>
      </div>

      <div className="">${price}</div>
      <div className="item-quantity">
        <button onClick={handleDecreaseQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={handleIncreaseQuantity}>+</button>
      </div>
      <div className="item-total">${quantity * price}</div>
      <div>
        <button className="remove" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}
