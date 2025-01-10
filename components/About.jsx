import React from 'react';
import './About-Contact.css'
import { useOutletContext } from 'react-router-dom';

const AboutUs = () => {
  const [, dark] = useOutletContext()

  return (
   <main className='about-main'>
     <div className= {`about-us-container ${ dark ? 'dark' : ''}`}>
      <h1>About Us</h1>
      <p>
        Welcome to Shopee, where we are passionate about providing our customers with the best shopping experience possible.
        Our journey began in 2024, with a mission to offer high-quality products at affordable prices.
      </p>
      <p>
        We believe in sustainability and ethical sourcing, and we work closely with our partners to ensure that our products are made with care for the environment and the people who create them.
      </p>
      <p>
        Our dedicated team is here to assist you with any questions or concerns you may have. Thank you for supporting us and being a part of our community!
      </p>
      <h3>Our Values</h3>
      <ul className='value'>
        <li>Quality: We strive for excellence in everything we do.</li>
        <li>Sustainability: We are committed to minimizing our environmental impact.</li>
        <li>Customer Satisfaction: Your happiness is our top priority.</li>
      </ul>
    </div>
   </main>
  );
};

export default AboutUs;
