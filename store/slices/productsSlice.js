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



// export const fetchProductdata = () => (dispatch) => {
//   dispatch(fetchProducts())
//   fetch(`https://fakestoreapi.com/products`)
//     .then((res) => res.json())
//     .then((data) => {
//       dispatch(updateAllProducts(data))
//     })
//     .catch(() => {
//       dispatch(fetchProductsError())
//     })
// }

// export const fetchProductdata = () => (dispatch) => {
//   // Check if data exists in localStorage
//   const localData = JSON.parse(localStorage.getItem('productsList'));

//   if (localData && localData.length > 0) {
//     // Use localStorage data
//     dispatch(updateAllProducts(localData));
//   } else {
//     // Fetch data from API and store it in localStorage
//     dispatch(fetchProducts());
//     fetch(`https://fakestoreapi.com/products`)
//       .then((res) => res.json())
//       .then((data) => {
//         // Update Redux state and localStorage with the fetched data
//         dispatch(updateAllProducts(data));
//         localStorage.setItem('productsList', JSON.stringify(data));
//       })
//       .catch(() => {
//         dispatch(fetchProductsError());
//       });
//   }
// };

// export const fetchProductdata = () => (dispatch) => {
//   // Fetch data from the database first
//   fetch('http://localhost:8080/api/products')
//     .then((res) => res.json())
//     .then((data) => {
//       if (data && data.length > 0) {
//         // If products exist in the database, use them
//         // console.log('Data fetched from database:', data);
//         dispatch(updateAllProducts(data));
//         // Optionally, store it in localStorage if needed for offline use
//         localStorage.setItem('productsList', JSON.stringify(data));
//       } else {
//         // If no products exist in the database, use localStorage
//         const localData = JSON.parse(localStorage.getItem('productsList'));
//         if (localData && localData.length > 0) {
//           console.log('Data fetched from localStorage:', localData);
//           fetch('http://localhost:8080/api/products/saveall', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(localData),
//           })
//             .then((response) => {
//               if (response.ok) {
//                 console.log('Data sent to the backend successfully');
//               } else {
//                 console.error('Failed to send data to the backend');
//               }
//             })
//           dispatch(updateAllProducts(localData));
//         } else {
//           // If no data in both database and localStorage, fetch from external API
//           fetch('https://fakestoreapi.com/products')
//             .then((res) => res.json())
//             .then((apiData) => {
//               // Update Redux state and localStorage with the fetched data
//               console.log('Data fetched from external API:', apiData);
//               dispatch(updateAllProducts(apiData));
//               localStorage.setItem('productsList', JSON.stringify(apiData));

//               // Send the fetched data to the Spring Boot backend to save
//               fetch('http://localhost:8080/api/products/saveall', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(apiData),
//               })
//                 .then((response) => {
//                   if (response.ok) {
//                     console.log('Data sent to the backend successfully');
//                   } else {
//                     console.error('Failed to send data to the backend');
//                   }
//                 })


//                 .catch((error) => {
//                   console.error('Error sending data to the backend:', error);
//                 });
//             })
//             .catch((error) => {
//               console.error('Error fetching data from external API:', error);
//               dispatch(fetchProductsError());
//             });
//         }
//       }
//     })
//     .catch((error) => {
//       console.error('Error fetching data from the database:', error);
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
        console.log('Data fetched from database:', data);
        dispatch(updateAllProducts(data));
      } else {
        // If no data found in the database, use local data (productsList)
        console.log('No data in the database, using local data:', productsList);
        dispatch(updateAllProducts(productsList));

        // Send the local data to the backend to save it
        fetch('http://localhost:8080/api/products/saveall', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productsList),
        })
          .then((response) => {
            if (response.ok) {
              console.log('Local data sent to the backend successfully');
            } else {
              console.error('Failed to send local data to the backend');
            }
          })
          .catch((error) => {
            console.error('Error sending local data to the backend:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the database:', error);
      // If database fetch fails, fallback to local data
      console.log('Using local data due to database error:', productsList);
      dispatch(updateAllProducts(productsList));
      dispatch(fetchProductsError());
    });
};















export const getAllProducts = (state) => state.products.list
export const getProductLoadingState = (state) => state.products.loading
export const getProductError = (state) => state.products.error

export const { updateAllProducts, fetchProducts, fetchProductsError, deleteProduct, updateProduct, addProduct } = slice.actions

export default slice.reducer
