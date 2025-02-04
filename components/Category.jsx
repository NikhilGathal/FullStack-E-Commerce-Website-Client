import React from 'react'
import Img1 from '../assets/elec.jpg'
import Img2 from '../assets/jewel.jpg'
import Img3 from '../assets/mencat2.jpg'
import Img4 from '../assets/women3.jpg'
import { FaStar } from 'react-icons/fa6'
import './Category.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Link, useOutletContext } from 'react-router-dom'
const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: 'Electronics',
    rating: 5.0,
    color: 'white',
    aosDelay: '0',
    path: 'electronics',
  },
  {
    id: 2,
    img: Img2,
    title: 'Jewelery',
    rating: 4.5,
    color: 'Red',
    aosDelay: '200',
    path: 'jewelery',
  },
  {
    id: 3,
    img: Img3,
    title: "Men's Clothing",
    rating: 4.7,
    color: 'brown',
    aosDelay: '400',
    path: "men's clothing",
  },
  {
    id: 4,
    img: Img4,
    title: "Women's Cloth",
    rating: 4.4,
    color: 'Yellow',
    aosDelay: '600',
    path: "women's clothing",
  },
]

const Category = ({ id }) => {
  const [, dark] = useOutletContext()
  return (
    <div id={ id } className={`cat-cat ${dark ? 'dark' : ''}`}>
      <div className="cat-mt-14 cat-mb-12 duration-200">
        <div className="cat-container">
          <div className="cat-text-center cat-mb-10 cat-max-w-\[600px\] cat-mx-auto">
            <h1 data-aos="fade-up" className="cat-text-3xl cat-font-bold">
              Categories
            </h1>
            <p data-aos="fade-up" className="cat-text-xs cat-text-gray-400">
              Discover a wide range of products tailored for every need and
              style.
            </p>
          </div>
          <div>
            <div className="cat-gridc cat-place-items-center">
              {ProductsData.map((data) => (
                <div
                  data-aos="fade-up"
                  data-aos-delay={data.aosDelay}
                  key={data.id}
                  className="cat-space-y-3"
                >
                  <Link to={`/carousel/${data.path}`}>
                    <img
                      src={data.img}
                      alt={data.title}
                      className="cat-h-[220px] cat-w-[150px] cat-object-cover cat-rounded-md"
                    />
                  </Link>
                  <div>
                    <Link to={`/carousel/${data.path}`}>
                      <h3 className="cat-font-semibold">{data.title}</h3>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div
           data-aos="fade-up"
           data-aos-duration="500"
           data-aos-delay="300"
              className="cat-flex cat-justify-center">
              <Link to="/Home">
                <button className="cat-text-center cat-mt-10 cat-cursor-pointer cat-bg-primary cat-text-white cat-py-1 cat-px-5 cat-rounded-md">
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category
