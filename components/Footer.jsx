import React from 'react'
import './footer.css' // You will style it in this CSS file
// import shop from '../assets/Sho.jpg'
import { Link } from 'react-router-dom'
const Footer = ({ dark }) => {
  return (
    <footer  data-aos="zoom-in"   className={`footer ${dark ? 'dark' : ''}`}>
      <div   className="footer-left">
        <div className="footer-brand">
          {/* <img src={shop} alt="Logo" className="footer-logo" /> */}
          <a href="#">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="60"
              width="60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </a>
          <a href="#">
            {' '}
            <button className="download-btn">Download App</button>{' '}
          </a>
        </div>
      </div>

      <div className="footer-right">
        <div className="footer-column">
          <h4>Shop</h4>
          <ul>
            <li>
              <a href="#">Gift cards</a>
            </li>
            <li>
              <a href="#">Registry</a>
            </li>
            <li>
              <a href="#">Sitemap</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Sell</h4>
          <ul>
            <li>
              <a href="#">Sell on OurSite</a>
            </li>
            <li>
              <a href="#">Teams</a>
            </li>
            <li>
              <a href="#">Forums</a>
            </li>
            <li>
              <a href="#">Affiliates & Creators</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>About</h4>
          <ul>
            <li>
              <a href="#">Our Company</a>
            </li>
            <li>
              <a href="#">Policies</a>
            </li>
            <li>
              <a href="#">Investors</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>

            <li>
              <a href="#">Impact</a>
            </li>
          </ul>
        </div>

        <div className="footer-column help">
          <h4>Help</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Privacy Settings</a>
            </li>
          </ul>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
            {/* <a href="#"><i className="fab fa-pinterest"></i></a> */}
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
