import React, { useState } from 'react'
import { useNavigate, useLocation, useOutletContext, Outlet } from 'react-router-dom'

const ContactUs = () => {
  const [, dark] = useOutletContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create a new feedback object
    const newFeedback = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    }

    try {
      // Send feedback data to the backend using fetch
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      // Reset the form after submission
      setFormData({ name: '', email: '', message: '' })

      // After form submission, navigate to /contact/feedback
      navigate('feedback') // Programmatically navigate to /contact/feedback

      setTimeout(() => {
        navigate('/contact');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('An error occurred while submitting your feedback.')
    }
  }

  const isFormRoute = location.pathname === '/contact/feedback'

  return (
    <>
      {!isFormRoute && (
        <main className="contact-main">
          <div className={`contact-us-container ${dark ? 'dark' : ''}`}>
            <h1 className='cnt'>Contact Us</h1>
            <p style={{ textAlign: 'center' }}>
              If you have any questions or feedback, please reach out to us!
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="contact-button" type="submit">
                Submit
              </button>
            </form>
          </div>
        </main>
      )}
       <Outlet/>
      {/* Render the outlet to allow for nested routes */}
    </>
  )
}

export default ContactUs
