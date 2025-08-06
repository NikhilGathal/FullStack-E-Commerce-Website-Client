import { createSlice } from '@reduxjs/toolkit'
import { productsList } from '../productsList.js';
const findItemIndex = (state, action) =>
  state.findIndex((cartItem) => cartItem.productId === action.payload.productId)

// Action types 

// product/fetchProducts – triggered by the fetchProducts reducer.
// product/fetchProductsError – triggered by the fetchProductsError reducer.
// product/updateAllProducts – triggered by the updateAllProducts reducer.
// product/addProduct – triggered by the addProduct reducer.
// product/deleteProduct – triggered by the deleteProduct reducer.
// product/updateProduct – triggered by the updateProduct reducer.

const slice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    list: JSON.parse(localStorage.getItem('productsList')) || [...productsList],
    error: '',
  },
  reducers: {
    fetchProducts(state) {
      state.loading = true
    },
    fetchProductsError(state, action) {
      state.loading = false
      state.error = action.payload || 'Something went wrong!'
    },
    updateAllProducts(state, action) {
      state.loading = false
      state.list = action.payload
      state.error = ''
    },


    addProduct(state, action) {
      const newProduct = action.payload;
      state.list.push(newProduct); // Add the new product to the list
      localStorage.setItem('productsList', JSON.stringify(state.list)); // Update localStorage
    },
    deleteProduct(state, action) {
      state.list = state.list.filter((product) => product.id !== action.payload); // Delete product by ID
      localStorage.setItem('productsList', JSON.stringify(state.list)); // Update localStorage
    },
    updateProduct(state, action) {
      const {
        id,
        title,
        price,
        category,
        description,
        image,
        rating = { rate: 0 }, // Default value for rating
      } = action.payload;

      const index = state.list.findIndex((product) => product.id === id); // Find the correct index
      if (index !== -1) {
        // Update the product at the found index
        state.list[index] = { id, title, price, category, description, image, rating };
        localStorage.setItem('productsList', JSON.stringify(state.list)); // Update localStorage
      }
    },
  },
})

// just for convention we have to call action creator that why below call back function is present
// inside of dispatch as convention we have to call that function for that we are returning a function from  callback function

// export const fetchProductdata = () => (dispatch) => {
//   // First, attempt to fetch data from the database
//   fetch('http://localhost:8080/api/products')
//     .then((res) => res.json())
//     .then((data) => {
//       if (data && data.length > 0) {
//         // Use data fetched from the database
//         console.log('Data fetched from database:', data);
//         dispatch(updateAllProducts(data));
//       } 
//       else {
//         // If no data found in the database, use local data (productsList)
//         console.log('No data in the database, using local data:', productsList);
//         dispatch(updateAllProducts(productsList));

//         // Send the local data to the backend to save it
//         fetch('http://localhost:8080/api/products/saveall', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(productsList),
//         })
//           .then((response) => {
//             if (response.ok) {
//               console.log('Local data sent to the backend successfully');
//             } else {
//               console.error('Failed to send local data to the backend');
//             }
//           })
//           .catch((error) => {
//             console.error('Error sending local data to the backend:', error);
//           });
//       }
//     })
//     .catch((error) => {
//       console.error('Error fetching data from the database:', error);
//       // If database fetch fails, fallback to local data
//       console.log('Using local data due to database error:', productsList);
//       dispatch(updateAllProducts(productsList));
//       dispatch(fetchProductsError());
//     });
// };


export const fetchProductdata = () => (dispatch) => {
  // First, attempt to fetch data from the database
  fetch('http://localhost:8080/api/products')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.length > 0) {
        // Use data fetched from the database
        // console.log('Data fetched from database:', data);
        dispatch(updateAllProducts(data));
      } else {
        // <--- ✅ Move else to same line with the closing brace of if
            dispatch(updateAllProducts(productsList));

            fetch('http://localhost:8080/api/products/saveall', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(productsList),
            })
              .then((response) => {
                if (response.ok) {
                  console.log('Local fallback data sent to backend successfully');
                } else {
                  console.error('Failed to send local fallback data to backend');
                }
              })
              .catch((err) => {
                console.error('Error while sending local fallback data to backend:', err);
              });       
      }
    })
}

export const getAllProducts = (state) => state.products.list
export const getProductLoadingState = (state) => state.products.loading
export const getProductError = (state) => state.products.error

export const { updateAllProducts, fetchProducts, fetchProductsError, deleteProduct, updateProduct, addProduct } = slice.actions

export default slice.reducer
