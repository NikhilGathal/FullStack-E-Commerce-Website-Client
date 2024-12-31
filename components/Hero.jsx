import React from 'react'
import Image1 from '../assets/women.png'
import Image2 from '../assets/shopping.png'
import Image3 from '../assets/sale.png'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './Hero.css' // Import the CSS file
import { Link, useOutletContext } from 'react-router-dom'

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Up to 50% off on all Men's Wear",
    description:
      "Discover the latest trends in men's fashion. From stylish shirts to comfortable jeans, enjoy discounts of up to 50% on our top collections. Limited time offer!",
  },
  {
    id: 2,
    img: Image2,
    title: "30% off on all Women's Wear",
    description:
      "Elevate your wardrobe with our exclusive women's wear collection. Shop now for dresses, tops, and accessories, all at 30% off. Perfect styles for every occasion!",
  },
  {
    id: 3,
    img: Image3,
    title: 'Up to 70% off on All Products Sale',
    description:
      'Hurry! Get up to 70% off on selected products in our store-wide sale. Shop now to grab unbeatable deals on electronics, fashion, home goods, and more!',
  },
]

const Hero = () => {
  const [, dark] = useOutletContext()
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    pauseOnFocus: true,
  }

  return (
    <div className={`hero-container ${dark ? 'dark' : ''}`}>
      {/* background pattern */}
   
      {/* hero section */}
      <div className="container">
      <div className="background-pattern"></div>
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid-container">
                {/* text content section */}
                <div className="text-container">
                  <h1 className="title">{data.title}</h1>
                  <p className="description">{data.description}</p>
                  <div className="order-now-container">
                    <Link to="/Home">
                      <button className="order-now-button">Shop Now</button>
                    </Link>
                  </div>
                </div>
                {/* image section */}
                <div className="image-container">
                  <img src={data.img} alt="Product" className="hero-image" />
                </div>
              </div>
            </div>
          ))}
         
        </Slider>
     
      </div>
    </div>
  )
}

export default Hero
