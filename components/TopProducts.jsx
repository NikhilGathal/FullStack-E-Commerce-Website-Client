import React, { useEffect } from 'react';

import { FaStar } from 'react-icons/fa';
import './TopProducts.css';
import { Link, useOutletContext } from 'react-router-dom';
import AOS from 'aos'; // Import AOS

const ProductsData = [
  {
    id: 3,
    img: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    title: 'Mens Cotton Jacket',
    description:
      'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions...',
    price: '55.99',
    rating: {
      rate: 4.7,
      count: 500,
    },
  },
  {
    id: 7,
    img: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    title: 'White Gold Plated Princess',
    description:
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her...",
    price: '9.99',
    rating: {
      rate: 3,
      count: 400,
    },
  },
  {
    id: 20,
    img: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg',
    title: 'DANVOUY Womens T Shirt Casual Cotton Short',
    description:
      '95% Cotton, 5% Spandex. Features: Casual, Short Sleeve, Letter Print, V-Neck...',
    price: '12.99',
    rating: {
      rate: 3.6,
      count: 145,
    },
  },
];

const TopProducts = ({ handleOrderPopup ,id }) => {
  const [, dark] = useOutletContext();

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init(); // Initialize AOS
    return () => {
      AOS.refresh(); // Refresh AOS when the component unmounts
    };
  }, []);

  return (
    <div id={id} className={`tp ${dark ? 'dark' : ''}`}>
      <div className="container">
        {/* Header section */}
        <div className="text-left mb-24">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Rated Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Best Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Discover our top-rated products, carefully selected for quality and
            style...
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
          {ProductsData.map((data) => (
            <div data-aos="zoom-in" className="product-card" key={data.id}>
              {/* image section */}
              <div className="image-section">
                <Link to={`/${data.id}`}>
                  <img src={data.img} alt={data.title} className="image" />
                </Link>
              </div>
              {/* details section */}
              <div className="details-section">
                {/* star rating */}
                <div className="rating">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <Link to={`/${data.id}`}>
                  <button onClick={handleOrderPopup}>Order Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;



