import React from 'react'

function Hamburger({ toggleMenu }) {
  return (
    <div className="hamburger-menu-container ">
    <div className="hamburger-menu">
      <span className="hamburger-icon " onClick={toggleMenu}>&#9776;</span>
    </div>
  </div>
  )
}

export default Hamburger