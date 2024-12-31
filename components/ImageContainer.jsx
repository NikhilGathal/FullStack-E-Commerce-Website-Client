


import React from 'react';
import './Imagecontainer.css';
import elec from '../assets/electronics.jpg';
import jewel from '../assets/jewelery.jpg';
import men from '../assets/mens.jpg';
import women from '../assets/womencloth.jpg';
import { Link, useOutletContext } from 'react-router-dom';

const a = [
  { id: 1, imgSrc: elec, label: 'Electronics', path: 'electronics' },
  { id: 2, imgSrc: jewel, label: 'Jewelery', path: 'jewelery' },
  { id: 3, imgSrc: men, label: "Men's Clothing", path: "men's clothing" },
  { id: 4, imgSrc: women, label: "Women's Clothing", path: "women's clothing" },
];

const ImageContainerries = () => {
  const [, dark] = useOutletContext();

  return (
    <div className={`out ${dark ? 'dark' : ''}`}>
      <div className="categories-container">
        {a.map((category) => (
          <Link 
            key={category.id} 
            to={`/carousel/${category.path}`} // Dynamic navigation based on the path
            className="category-item-link"
          >
            <div className="category-item">
              <div className="image-wrapper">
                <img
                  src={category.imgSrc}
                  alt={category.label}
                  className="category-img"
                />
              </div>
              <p className="category-label">{category.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ImageContainerries;

