import React from 'react'
import { Link } from 'react-router-dom'

function Myordersitem({ productId, title, rating, price, imageUrl, quantity ,index  } ) {


  
  return (

    
    <div className="cart-item-container"   >
      <div className="cart-item">
      <Link to={`/${productId}`}> <img src={imageUrl} alt={title} />  </Link>  

        <div>
        <Link to={`/${productId}`}>  <h3>{title}</h3> </Link> 
          <p>{rating} ★ ★ ★ ★</p>
        </div>
      </div>

      <div className="">${price}</div>

      <div className="item-quantity">
        {/* <button onClick={() => dispatch(decreaseCartItemQuantity(productId))}></button> */}
        {/* <span>{quantity}</span> */}
        {/* <button onClick={handleRemove}>Remove</button> */}
      </div>
      <div className="item-total"></div>
    </div>
  )
}

export default Myordersitem