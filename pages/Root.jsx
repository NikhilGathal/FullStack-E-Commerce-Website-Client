import React, { useEffect, useState } from 'react'
import Hero1 from '../components/Hero'
import Category from '../components/Category'
import TopProducts from '../components/TopProducts'
import Banner from '../components/Banner'
import Subscribe from '../components/Subscribe'
import Testimonials from '../components/Testimonial'
import Footer from '../components/Footer'
import { useOutletContext } from 'react-router-dom'

function Root() {
  const [setissign, dark, isdark, issign, userlogin] = useOutletContext()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if the modal has already been shown before
    const hasShownModal = localStorage.getItem('hasShownModal')

    // If the modal hasn't been shown, set a timeout to show it after 4 seconds
    if (!hasShownModal) {
      // console.log('Timer');
      const timer = setTimeout(() => {
        setShowModal(true)
        !showModal && setissign(true) // Show modal after 4 seconds
        localStorage.setItem('hasShownModal', 'true') // Set flag in localStorage
      }, 3000)

      // Clean up the timer in case the component unmounts
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <Hero1 id="hero" />
      <Category id="category" />
      <TopProducts id="top-products" />
      <Subscribe id="subscribe" />
      <Banner id="banner" />
      <Testimonials id="testimonials" />
      <Footer dark={dark} />
    </>
  )
}

export default Root
