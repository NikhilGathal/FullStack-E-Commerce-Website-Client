import React from "react";
import BannerImg from "../assets/4547829.jpg";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import "./Banner.css"; // Import the CSS file
import { useOutletContext } from "react-router-dom";

const Banner = () => {
  const [, dark] = useOutletContext()
  return (
<div className="ban">
<div className={ `banner  ${ dark ? 'dark' : ''}`}>
      <div className="container">
        <div className="grid-section">
          {/* Image Section */}
          <div className="image-section" data-aos="zoom-in">
            <img
              src={BannerImg}
              alt="Banner"
              className="banner-img"
            />
          </div>

          {/* Text Details Section */}
          <div className="text-section" data-aos="fade-up">
            <h1 className="banner-title">Winter Sale upto 50% Off</h1>
            <p className="banner-description">
            Discover the latest trends in fashion and accessories at unbeatable prices. Shop now and enjoy fast delivery, secure payments, and exclusive offers.
            </p>
            <div className="features">
              <div className="feature-item" data-aos="fade-up">
                <GrSecure
                className={ `feature-icon secure-icon  ${ dark ? 'dark' : ''}`}
                 
                  // style={{ height: "20px", width: "20px" }}
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="2"
                />
                <p>Quality Products</p>
              </div>
              <div className="feature-item" data-aos="fade-up">
                <IoFastFood
                className={ `feature-icon food-icon  ${ dark ? 'dark' : ''}`}
   
                  // style={{ height: "20px", width: "20px" }}
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="2"
                />
                <p>Fast Delivery</p>
              </div>
              <div className="feature-item" data-aos="fade-up">
                <GiFoodTruck
                className={ `feature-icon truck-icon  ${ dark ? 'dark' : ''}`}
                  
                  // style={{ height: "20px", width: "20px" }}
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="2"
                />
                <p>Easy Payment method</p>
              </div>
              <div className="feature-item" data-aos="fade-up">
                <GiFoodTruck
                className={ `feature-icon offer-icon  ${ dark ? 'dark' : ''}`}
                
                  // style={{ height: "20px", width: "20px" }}
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="2"
                />
                <p>Get Offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  );
};

export default Banner;






