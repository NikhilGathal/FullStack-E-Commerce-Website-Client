
import React, { useState } from 'react';
import './Subscribe.css'; // Import your custom CSS file
import { useOutletContext } from 'react-router-dom';

const Subscribe = ({id}) => {
  const [, dark] = useOutletContext(); // Dark mode context
  const [email, setEmail] = useState(''); // Email state
  const [isSubmitted, setIsSubmitted] = useState(false); // For showing submission feedback
  const [showHeading, setShowHeading] = useState(true); // State to manage the visibility of the heading
  const [errorMessage, setErrorMessage] = useState(''); // State to manage error message
  const [emailValidationError, setEmailValidationError] = useState(''); // State for email validation error

  // Email validation regex pattern (simple version)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async () => {
    // Validate email format
    if (!emailRegex.test(email)) {
      setShowHeading(false);
      setEmailValidationError('Please enter a valid email address.');
      setTimeout(() => {
        setEmailValidationError('');
        setShowHeading(true);
      }, 3000);
      setEmail('');
      return;
    } else {
      setEmailValidationError(''); // Clear validation error if email is valid
    }

    try {
      // Make the API call
      const response = await fetch('http://localhost:8080/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( email ), // Send email in JSON format
      });

      const data = await response.text(); // Parse response as text because the API returns a string

      // Handle server responses
      if (response.ok) {
        if (data === "Subscription added successfully!") {
          setShowHeading(false);
          setIsSubmitted(true); // Show success message
          setTimeout(() => {
            setIsSubmitted(false);
            setShowHeading(true); // Restore heading after a delay
          }, 3000);
          setEmail(''); // Clear the input field
        } 
        
        else if (data === "Email already subscribed!") {


          setShowHeading(false);
          setErrorMessage("This email is already subscribed."); // Set specific error message
        
          setTimeout(() => {
            setErrorMessage('');
            setShowHeading(true);
          }, 3000);

          setEmail('');
          return;
        } else {
          // Handle unexpected successful responses
          setShowHeading(false);
          setErrorMessage("Unexpected response from the server.");
          setTimeout(() => {
            setErrorMessage('');
            setShowHeading(true);
          }, 3000);
        }
      } else {
        // Handle HTTP errors
        setShowHeading(false);
        setErrorMessage(`Server error: ${response.statusText}`);
        setTimeout(() => {
          setErrorMessage('');
          setShowHeading(true);
        }, 3000);
      }
    } catch (error) {
      // Handle network or other errors
      setShowHeading(false);
      setErrorMessage('Failed to connect to the server. Please try again later.');
      setTimeout(() => {
        setErrorMessage('');
        setShowHeading(true);
      }, 3000);
    }
  };
  return (
    <div id={id} className={`sub ${dark ? 'dark' : ''}`}>
      <div data-aos="zoom-in" className="subscribe-section">
        <div className="container backdrop-blur-sm py-10">
          <div className="subscribe-content">
            {/* Conditionally render heading based on showHeading state */}
            {showHeading && <h1 className="subscribe-heading">Get Notified About New Products</h1>}
            {errorMessage && <h1 className="subscribe-heading">{errorMessage}</h1>}
            {isSubmitted && <h1 className="subscribe-heading">Thank you for subscribing!</h1>}
            {emailValidationError && <h1 className="subscribe-heading">{emailValidationError}</h1>} 
            <input
              data-aos="fade-up"
              type="email"
              placeholder="Enter your email"
              className="subscribe-input"
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
            />
            <button
              data-aos="fade-up"
              className="subscribe-button"
              onClick={handleSubmit} // Submit email
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Subscribe;


