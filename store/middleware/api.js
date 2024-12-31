
import { fetchProducts, fetchProductsError, updateAllProducts } from "../slices/productsSlice"
export const apiMiddleware = ({ dispatch }) => (next) => (action) => {


    const baseurl = 'https://fakestoreapi.com'
    if (action.type === 'api/makeCall') {
        next(action)
        const { url, onsuccess, onstart, onerror } = action.payload
        dispatch({
            type: onstart
        })
        fetch(`${baseurl}/${url} `)
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: onsuccess,
                    payload: data
                })
            })
            .catch(() => {
                dispatch({
                    type: onerror
                })
            })
    }
    else {
        next(action)
    }
}

export const fetchdata = (payload) => ({ type: 'api/makeCall', payload })

