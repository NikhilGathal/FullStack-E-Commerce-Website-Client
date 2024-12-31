import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import women from '../assets/women.jpg'
import './style.css';

// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link, useOutletContext } from 'react-router-dom';

export default function Carousel() {

  const [, dark] = useOutletContext()

  const categories = ['electronics','jewelery',"men's clothing","women's clothing"]

    // const handleImageClick = (slideNumber) => {
        
    //     // You can add more logic here, like navigating to a new page or showing a modal.
    //   };
    
  return (
    <>
    <div className={ ` swiper-container  ${dark ? 'dark' : ''}`}>
    <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true} // Enable looping for continuous navigation
        speed={1000} 
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true} // Enable arrow navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper">
        <SwiperSlide>
         <Link to="/diwali">  
         <img
            className='i'
            src='https://rukminim2.flixcart.com/fk-p-flap/1200/250/image/d0e281a0cfa9c139.jpg?q=100'
            alt="Slide 1"
             loading="lazy"
          />
         </Link>
        </SwiperSlide>
        <SwiperSlide>
        <Link to={`/carousel/${categories[2]}`}>
        <img
            className='i'
            src='https://rukminim2.flixcart.com/fk-p-flap/1200/250/image/126619f56d1f3607.jpg?q=100'
            alt="Slide 2"
          />
        </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to={`/carousel/${categories[0]}`}>
          <img
            className='i'
            src='https://rukminim2.flixcart.com/fk-p-flap/1200/250/image/6493cebc0a00ece1.jpg?q=100'
            alt="Slide 3"
          />
          </Link>
          
        </SwiperSlide>
        <SwiperSlide>
          <Link to={`/carousel/${categories[1]}`}>
          <img
            className='i'
            src='https://rukminim2.flixcart.com/fk-p-flap/1200/250/image/d1b7c1632f530edd.jpeg?q=100'
            alt="Slide 4"
          />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to={`/carousel/${categories[3]}`}>
          <img
            className='i women'
            src={women}
            alt="Slide 5"
          />
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
   
    
 
    </>
  );
}
