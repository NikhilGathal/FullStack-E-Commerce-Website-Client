import React from 'react'
import { Link } from 'react-router-dom'
import './ProductShimmer.css'
import '../src/App.css'
function ProductShimmer() {
  return (
    <div className="products-container">
    {Array.from({ length: 20 }).map((el, i) => {
      return (
        <div key={i} className="product shimmer-card">
        <div className="shimmer-card product-image flag-container">
         <img  />  
        </div>
        <div className="title-container card-title">
           <h3 className='item-detail'> </h3> 
        </div>
        <div className="price-rating-container ">
          <p className="rating shimmer-card"></p>
          <p className="price shimmer-card"></p>
        </div>
        <div className="cta-container ">
          <button></button>
          <button></button>
        </div>
      </div>
      )
    })}
  </div>
  )
}

export default ProductShimmer