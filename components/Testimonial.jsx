import React from 'react'
import Slider from 'react-slick'
import pro1 from '../assets/pro1.jpg'
import pro2 from '../assets/pro2.jpg'
import pro3 from '../assets/pro3.jpg'
import pro4 from '../assets/pro4.jpg'
import './Testimonial.css'
import { useOutletContext } from 'react-router-dom'
const TestimonialData = [
  {
    id: 1,
    name: 'Victor',
    text: 'The product quality is amazing! It exceeded my expectations and I would definitely recommend it to others.',
    img: pro1,
  },
  {
    id: 2,
    name: 'Satya Nadella',
    text: 'Great experience! The service is top-notch, and the website is very user-friendly. Highly recommended.',
    img: pro2,
  },
  {
    id: 3,
    name: 'Virat Kohli',
    text: 'Excellent customer service and fast delivery! I’m really happy with my purchase.',
    img: pro3,
  },
  {
    id: 5,
    name: 'Sachin Tendulkar',
    text: 'Amazing products at great prices. The whole shopping experience was seamless. Will shop again!',
    img: pro4,
  },
]
const Testimonials = ({id}) => {
  const [, dark] = useOutletContext()

  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div id={id} className={`testimonial-container ${dark ? 'dark' : ''}`}>
      <div className="testimonial-header">
        <p className="testimonial-subtitle">What our customers are saying</p>
        <h1 className="testimonial-title">Testimonials</h1>
        {/* <p className="testimonial-description">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
          asperiores modi.
        </p> */}
      </div>

      <div className="testimonial-slider">
        <Slider {...settings}>
          {TestimonialData.map((data) => (
            <div key={data.id} className="testimonial-card">
              <div className="testimonial-card-body">
                <div className="testimonial-img">
                  <img src={data.img} alt="" />
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-text">{data.text}</p>
                  <h1 className="testimonial-name">{data.name}</h1>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default Testimonials
