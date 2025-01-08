import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getAllProducts,
  updateAllProducts,
  addProduct,
} from '../store/slices/productsSlice';
import Product from './Product';

function CarouselPage() {
  const dispatch = useDispatch();
  const { carousel ,searchTerm } = useParams();
  console.log(searchTerm);
  
  const [loading, setLoading] = useState(true);
  const [sortPriceOrder, setSortPriceOrder] = useState('');
  const [sortRatingOrder, setSortRatingOrder] = useState('');
  // const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const productsList = useSelector(getAllProducts);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // useEffect(() => {
  //   setLoading(true);

  //   const storedProducts = JSON.parse(localStorage.getItem('productsList'));

  //   if (storedProducts) {
  //     dispatch(updateAllProducts(storedProducts));
  //     setFilteredProducts(storedProducts);
  //     setLoading(false);
  //   } else {
  //     setError('Products not found in local storage.');
  //     setLoading(false);
  //   }
  // }, [carousel, dispatch]);

  // Apply filtering, sorting, and search term
  useEffect(() => {
    if (productsList.length > 0) {
      let filtered = productsList.filter((product) =>
        searchTerm
          ? product.title.toLowerCase().includes(searchTerm.toLowerCase())
          : product.category.toLowerCase() === carousel.toLowerCase()
      );
      console.log(filtered);
      

      filtered = filtered.sort((a, b) => {
        if (sortPriceOrder === 'lowToHigh') return a.price - b.price;
        if (sortPriceOrder === 'highToLow') return b.price - a.price;
        if (sortRatingOrder === 'lowToHigh') return a.rating.rate - b.rating.rate;
        if (sortRatingOrder === 'highToLow') return b.rating.rate - a.rating.rate;
        return 0;
      });

      setFilteredProducts(filtered);
      setLoading(false)
    }
  }, [productsList, carousel, sortPriceOrder, sortRatingOrder, searchTerm]);

  if (loading) {
    return (
      <h1 className="Load" style={{ textAlign: 'center' }}>
        Loading...
      </h1>
    );
  }

  if (error) {
    return (
      <h1 className="home-error S" style={{ textAlign: 'center' }}>
        {error}
      </h1>
    );
  }

  return (
    <>
      <div className="search-filter-container filter extra">
     


        {/* Sort by Price */}
        <select
          id="sortPriceOrder"
          value={sortPriceOrder}
          onChange={(e) => {
            setSortPriceOrder(e.target.value);
            setSortRatingOrder('');
          }}
        >
          <option value="">Sort by Price</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>

        {/* Sort by Rating */}
        <select
          id="sortRatingOrder"
          value={sortRatingOrder}
          onChange={(e) => {
            setSortRatingOrder(e.target.value);
            setSortPriceOrder('');
          }}
        >
          <option value="">Sort by Rating</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>
      </div>

      <div className="products-container pdt">
        {filteredProducts.map(({ id, title, rating, price, image }) => (
          <Product
            key={id}
            productId={id}
            title={title}
            rating={rating.rate}
            price={price}
            imageUrl={image}
          />
        ))}
      </div>
    </>
  );
}

export default CarouselPage;