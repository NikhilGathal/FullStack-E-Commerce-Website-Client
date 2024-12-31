
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { act } from 'react'

const findItemIndex = (state, action) =>
  state.findIndex((wishItem) => wishItem.productId === action.payload.productId)

const slice = createSlice({
  name: 'wish',
  initialState: {
    loading: false,
    list: [],
    error: '',
  },
  reducers: {
    addWishItem(state, action) {
      const existingItemIndex = findItemIndex(state.list, action)
      if (existingItemIndex !== -1 ) state.list[existingItemIndex].quantity = 1
      else state.list.push({ ...action.payload, quantity: 1 })
    },
    removeWishItem(state, action) {
      const existingItemIndex = findItemIndex(state.list, action)
      state.list.splice(existingItemIndex, 1)
    },
    removeallWishItem(state)
    {
      state.list = []
    },
    loadWishItem(state,action)
    {
      if(action.payload.length)
      state.list = action.payload
    else
    state.list = []
    }
  },
})

const getWishItems = (state) => state.wishList.list;

export const getAllWishItems = createSelector(
  [getWishItems, (state) => state.products.list], // Pass the products list as an input
  (wishItems, products) => {
    return wishItems
      .map(({ productId, quantity }) => {
        const wishProduct = products.find(product => product.id === productId);
        return { ...wishProduct, quantity };
      })
      .filter(({ title }) => title); // Ensure you filter out any items without titles
  }
);
export const {
  loadWishItem,
  addWishItem,
  removeWishItem,
  removeallWishItem
} = slice.actions
export default slice.reducer
