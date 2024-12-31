import { createSelector, createSlice } from '@reduxjs/toolkit'

const findItemIndex = (state, action) =>
  state.findIndex((cartItem) => cartItem.productId === action.payload.productId)

const slice = createSlice({
  name: 'cart',
  initialState: {
    loading: false,
    list: [],
    error: '',
  },
  reducers: {
    fetchCartItems(state) {
      state.loading = true
    },
    fetchCartItemsError(state, action) {
      state.loading = false
      state.error = action.payload || 'Something went wrong!'
    },
    loadCartItems(state, action) {
      state.loading = false
      state.list = action.payload.products
    },
    loadCartItemsFromLocal(state, action) {
      state.loading = false
      state.list = action.payload
    },
    removeallCartItem(state)
    {
      state.list = []
    },
    clearCart: (state) => {
      state.list = []; // Clear the cart items
  },
    addCartItem(state, action) {
      // console.log(action);
      
      const existingItemIndex = findItemIndex(state.list, action)
      if (existingItemIndex !== -1) state.list[existingItemIndex].quantity += 1
      else state.list.push({ ...action.payload, quantity: 1 })
    },
    removeCartItem(state, action) {
      const existingItemIndex = findItemIndex(state.list, action)
      state.list.splice(existingItemIndex, 1)
    },
    increaseCartItemQuantity(state, action) {
      const existingItemIndex = findItemIndex(state.list, action)
      // console.log(state.list);
      
      state.list[existingItemIndex].quantity += 1
    },
    decreaseCartItemQuantity(state, action) {
      const existingItemIndex = findItemIndex(state.list, action)
      if (existingItemIndex !== -1) 
      state.list[existingItemIndex].quantity -= 1
      if (state.list[existingItemIndex].quantity === 0)
        state.list.splice(existingItemIndex, 1)
    },
  },
})



//  const getCartItems = ({ products, cartItems }) => {
//   return cartItems.list
//     .map(({ productId, quantity }) => {
//       const cartProduct = products.list.find(
//         (product) => {
//         return  product.id === productId })
//       return { ...cartProduct, quantity }
//     })

    
// }

// export const getAllCartItems = createSelector(getCartItems, (cartItems) => {
//  return cartItems
// } )


const getCartItems = (state) => {
  return state.cartItems.list // Accessing the correct part of the state
    .map(({ productId, quantity }) => {
      const cartProduct = state.products.list.find(
        (product) => product.id === productId
      );
      return { ...cartProduct, quantity };
    })
    .filter(({ title }) => title); // Ensure there's a title
}


export const getAllCartItems = createSelector(
  (state) => state.cartItems.list, // Input selector
  (state) => state.products.list,   // Input selector
  (cartItems, products) => {
    return cartItems.map(({ productId, quantity }) => {
      const cartProduct = products.find((product) => product.id === productId);
      return { ...cartProduct, quantity };
    }).filter(({ title }) => title);
  }
);

// createSelector([state => state.todos], todos => todos)
export const getCartLoadingState = (state) => state.products.loading
export const getCartError = (state) => state.products.error
// Thunk Action Create
// export const fetchCartItemsdata = ()=> (dispatch)=> 
  {
    // dispatch(fetchCartItems())
    // fetch(`https://fakestoreapi.com/carts/5 `)
    // .then((res) => res.json())
    // .then((data) => {
    //     dispatch(loadCartItems(data))
    // })
    // .catch(() => {
    //     dispatch(fetchCartItemsError())
    // })
  } 
// export const fetchCartItemsdata = () => (dispatch) => {
//   let storedCart = JSON.parse(localStorage.getItem('cartItems')) || []; 
//   const arry = []; 
//   const fetchPromises = storedCart.map((id) => {
//     return fetch(`https://fakestoreapi.com/products/${id}`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return res.json();
//   })
//       .then((data) => {
//         arry.push(data);
//       })
//       .catch(() => {
//       });
//   });

//   Promise.all(fetchPromises)
//     .then(() => {
//       console.log(arry);
//       dispatch(loadCartItemsFromLocal(arry)); 
//     })
//     .catch(() => {
//     });
// };
export const {loadCartItemsFromLocal,
  fetchCartItemsError,
  fetchCartItems,
  loadCartItems,
  removeallCartItem,
  addCartItem,
  removeCartItem,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
} = slice.actions

export default slice.reducer
