import React, { useEffect, useState } from 'react'
import wishIcon from '../assets/heart-solid.svg'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import CartIcon from '../assets/cart-icon.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductdata,
  updateAllProducts,
} from '../store/slices/productsSlice'
import { loadCartItemsFromLocal } from '../store/slices/cartSlice'
import ModalSign from './ModalSign'
import ModalLogin from './ModalLogin'
import { loadWishItem } from '../store/slices/wishListSlice'
import Hamburger from './Hamburger'
import './Hover.css'
import lightmode from '../assets/light-mode-button.png'
import darkmode from '../assets/dark-mode-button.png'
// import SuggestionBox from './SuggestionBox'
export default function Header({
  issign,
  setissign,
  dark,
  isdark,
  setuserlogin,
  setIsAdmin,
  uname1,
  setUsername,
  setcheckuserlogin,
  checkuserlogin,
  userlogin
}) {
  console.log('from header ' + userlogin);
  // const isAdmin = localStorage.getItem('isAdmin')
  const location = useLocation()
  const [dbname, setDbname] = useState('')
  // console.log(dbname);

  // if (localStorage.getItem('isAdmin') === 'true') {
  //   // console.log( localStorage.getItem('adminname') === dbname);
  //   fetch('http://localhost:8080/api/users/admin-username')
  //     .then((response) => response.text()) // Parse the JSON response
  //     .then((data) => {
  //       setDbname(data)
  //       // console.log(data) // Set the admin username in state
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching admin username:', error)
  //     })
  // }

  const [isAdmin1, setIsAdmin1] = useState(
    localStorage.getItem('isAdmin') === 'true'
  )

  useEffect(() => {
    if (isAdmin1) {
      fetch('http://localhost:8080/api/users/admin-username')
        .then((response) => response.text())
        .then((data) => {
          setDbname(data)
        })
        .catch((error) => {
          console.error('Error fetching admin username:', error)
        })
    }
  }, [isAdmin1])

  // console.log(isAdmin);
  const name = localStorage.getItem('adminname')
  // console.log(name+ ' ' + dbname);

  // console.log(name === dbname);

  const [signname, setsignname] = useState(false)
  // console.log(signname);

  const [islog, setislog] = useState(false)
  // console.log(islog);

  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()
  // console.log(isAdmin);
  const existingAdmin = JSON.parse(localStorage.getItem('Admin')) || {}
  const adminUsername = existingAdmin.username // Get the username from existingAdmin

  const dispatch = useDispatch()

  const [username, setusername] = useState(() => {
    return localStorage.getItem('username') || ''
  })

  useEffect(() => {
    if (username) {
      // setIsAdmin(true)
      // Fetch and load the user's cart and wishlist from localStorage when username changes (i.e., user logs in)
      const storedCart =
        JSON.parse(localStorage.getItem(`${username}cart`)) || []
      dispatch(loadCartItemsFromLocal(storedCart))

      const storedWish =
        JSON.parse(localStorage.getItem(`${username}wish`)) || []
      dispatch(loadWishItem(storedWish))
    }
  }, [username, dispatch])

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setusername(storedUsername)
      // setIsAdmin(isAdmin)
    }
    const signedUp = localStorage.getItem('signedUp')
    if (signedUp === 'true') {
      setsignname(true)
    }
  }, [uname1])

  useEffect(() => {
    // dispatch(
    //   fetchdata({
    //     url: 'products',
    //     onsuccess: updateAllProducts.type,
    //      onstart: fetchProducts.type,
    //     onerror: fetchProductsError.type
    //   })
    // )

    // dispatch(fetchdata({
    //   url: 'carts/5',
    //   onsuccess: loadCartItems.type,
    //   onstart: fetchCartItems.type,
    //   onerror: fetchCartItemsError.type
    // })
    // )

    dispatch(fetchProductdata())

    // dispatch( fetchCartItemsdata())

    // let userlogin = localStorage.getItem('username')
    // let cartKey = userlogin ? `${userlogin}cart` : 'cartItems'
    // let wishKey = userlogin ? `${userlogin}wish` : 'wishItems'

    // let storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
    // dispatch(loadCartItemsFromLocal(storedCart))

    // let storedWish = JSON.parse(localStorage.getItem(wishKey)) || []
    // dispatch(loadWishItem(storedWish))

    // dispatch(fetchProducts())
    // fetch('https://fakestoreapi.com/products')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     dispatch(updateAllProducts(data))
    //   })
    //   .catch(() => {
    //     dispatch(fetchProductsError())
    //   })

    // dispatch(fetchCartItems())
    // fetch('https://fakestoreapi.com/carts/5')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     dispatch(loadCartItems(data))
    //   })
    //   .catch(() => {
    //     dispatch(fetchCartItemsError())
    //   })
  }, [])
  const cartItems = useSelector((state) => state.cartItems.list)
  // console.log(cartItems);
  const wish = useSelector((state) => state.wishList.list)
  // console.log(wish);

  const toggleMenu = (e) => {
    e.stopPropagation() // Stop the click event from propagating

    setMenuOpen((prevState) => !prevState) // Toggle the menu open state
  }

  const closeMenu = () => {
    setMenuOpen(false) // Close the menu
  }

  const handleHeaderClick = (e) => {
    // If the menu is open and the click is within the header, do not close it
    // console.log('Header');

    if (menuOpen && !e.target.closest('.header-contents')) {
      e.stopPropagation() // Prevent event bubbling
    } else {
      closeMenu() // Close the menu if clicked outside
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.header-container')) {
        closeMenu() // Close the menu if clicked outside of header
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  const handleClick = () => {
    if (username === adminUsername) {
      navigate('/Admin') // Navigate to the Admin page if username is Admin
    } else {
      navigate('/myorder') // Navigate to My Orders if username is not Admin
    }
  }
  // console.log(username);
  // const statedata = useSelector((state)=> state.products.list)
  // console.log(statedata);

  function handleDeleteAccount() {
    if (uname1) {
      // Call the delete API with the username
      fetch(`http://localhost:8080/api/users/username/${uname1}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete user')
          }
          alert('Account deleted successfully')
          setcheckuserlogin(false)
          localStorage.removeItem('username')
          setuserlogin(false)
          setusername('')
          setUsername('')
          navigate('/')
        })
        .catch((error) => {
          console.error('Error deleting account:', error.message)
          alert('Failed to delete account')
        })
    } else {
      alert('No user logged in')
    }
  }

  // const scrollToSection = (id) => {
  //   const section = document.getElementById(id);
  //   let yOffset;
  
  //   if (section) {
  //     if (section.id === "subscribe") {  // Use a string for ID comparison
  //       yOffset = -200;
  //     } else {
  //       yOffset = -100;
  //     }
  //     // Adjust offset based on header height
  //     const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
  //     window.scrollTo({ top: y, behavior: "smooth" });
  //   }
  // };
  useEffect(() => {
    localStorage.setItem("userlogin", JSON.stringify(userlogin));
  }, [userlogin]);

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { sectionId } }) // Redirect to root and pass sectionId
    } else {
      scrollToSection(sectionId)
    }
  }
  useEffect(() => {
    if (location.state?.sectionId) {
      setTimeout(() => {
        // Add a small delay to ensure scrolling works after navigation
        scrollToSection(location.state.sectionId)
      }, 100)
    }
  }, [location])

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      let yOffset = id === 'subscribe' ? -200 : -100 // Adjust offset for each section
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
  // const dark = false
  return (
    <header
      onClick={handleHeaderClick}
      className={`header-container head ${dark ? 'dark' : ''} ${
        menuOpen ? 'menu-open' : ''
      }`}
    >
      <div className="header-contents">
        <Link to="/">
          {' '}
          <h1
            title="home"
            onClick={() => {
              //  setquery('')
              // dispatch(fetchdata())
              window.scrollTo({ top: 0, behavior: 'smooth' })
              dispatch(fetchProductdata())
              // dispatch(updateAllProducts(statedata))
              //  console.log('clicked');
            }}
            className="H"
          >
            {' '}
            Shopee{' '}
          </h1>{' '}
        </Link>
        {/* <i
          onClick={() => {
            localStorage.setItem('isdarkmode', !dark)
            isdark(!dark)
          }}
          title={`${dark ? 'light mode' : 'dark mode'}`}
          className={`mode fa-solid fa-2xl fa-${dark ? 'sun ' : 'moon '}  `}
        ></i> */}

        <img
          onClick={() => {
            localStorage.setItem('isdarkmode', !dark)
            isdark(!dark)
          }}
          title={`${dark ? 'Light mode' : 'Dark mode'}`}
          src={dark ? darkmode : lightmode}
          alt={dark ? 'Light Mode' : 'Dark Mode'}
          className="mode"
        />
        <h3 id="wel">
          {localStorage.getItem('username')
            ? `Welcome ${localStorage.getItem('username')}`
            : localStorage.getItem('isAdmin') === 'true' &&
              localStorage.getItem('adminname')
            ? `Welcome ${localStorage.getItem('adminname')}`
            : ''}
        </h3>
        <div className="icon-contain">
          <Link className="cart-icon" to="/cart">
            <img
              className={`c H ${dark ? 'dark' : ''} `}
              title="Cart"
              src={CartIcon}
              alt="cart-icon"
            />

            <div className="cart-items-count">
              {cartItems.reduce(
                (accumulator, currentItem) =>
                  accumulator + currentItem.quantity,
                0
              )}
            </div>
          </Link>
          <Link className="cart-icon" to="/wish">
            <img
              title="WishList"
              className="c heart H"
              src={wishIcon}
              alt="wish-icon"
            />
            <div className="cart-items-count">{wish.length}</div>
          </Link>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="ham">
          <span onClick={toggleMenu} className="close-icon">
            &times;
          </span>

             <div className="H sections-container">
            <h3 className="sett">Sections</h3>
            <div className="suggestion-box-home">
              <p onClick={() => handleNavigation('category')} className="H">
                Category
              </p>
              <p onClick={() => handleNavigation('top-products')} className="H">
                Top Products
              </p>
              <p onClick={() => handleNavigation('subscribe')} className="H">
                Subscription
              </p>
              <p onClick={() => handleNavigation('testimonials')} className="H">
                Testimonials
              </p>
            </div>
          </div>

          {/* <div className="H sections-container">
            <h3 >Sections</h3>
            <div className="suggestion-box-home">
              <p onClick={() => scrollToSection('category')} className="H">
                Category
              </p>
              <p onClick={() => scrollToSection('top-products')} className="H">
                TopProducts
              </p>
              <p onClick={() => scrollToSection('subscribe')} className="H">
                Subscription
              </p>
              <p onClick={() => scrollToSection('testimonials')} className="H">
                Testimonials
              </p>
            </div>
          </div> */}

          <h3
            className="H"
            onClick={(e) => {
              setissign(true)
              toggleMenu(e)
            }}
            style={{
              display:
                localStorage.getItem('username') ||
                localStorage.getItem('isAdmin') === 'true'
                  ? 'none'
                  : 'block',
            }}
          >
            Signup
          </h3>
          <ModalSign
            issign={issign}
            setissign={setissign}
            setsignname={setsignname}
            setislog={setislog}
          />
          <div
            style={{
              display:
                localStorage.getItem('username') ||
                localStorage.getItem('isAdmin') === 'true'
                  ? 'block'
                  : 'none',
            }}
            className={`H heading-container ${dark ? 'dark' : ''}`}
          >
            {(localStorage.getItem('username') ||
              localStorage.getItem('isAdmin') === 'true') && (
              <>
                <h3 className=" heading">Profile</h3>
                {localStorage.getItem('username') &&
                localStorage.getItem('isAdmin') !== 'true' ? (
                  // Regular user links
                  <div className="suggestion-box">
                    <Link to="/myorder">
                      <p>My Orders</p>
                    </Link>
                    <Link to="/EditUser">
                      <p>Edit Profile</p>
                    </Link>
                    <Link to="/">
                      <p onClick={handleDeleteAccount}>Delete Account</p>
                    </Link>
                    <Link to="/Home">
                      <p>Buy Again</p>
                    </Link>
                  </div>
                ) : localStorage.getItem('isAdmin') === 'true' ? (
                  // Admin links
                  <div className="suggestion-box">
                    <Link to="/Admin">
                      <p>Orders</p>
                    </Link>
                    <Link to="/Add">
                      <p>Add Product</p>
                    </Link>
                    <Link to="/EditUser">
                      <p>Edit Profile</p>
                    </Link>
                    <Link to="/Emailslist">
                      <p>Subscription</p>
                    </Link>
                    <Link to="/FeedbacksList">
                      <p>Feedbacks</p>
                    </Link>
                  </div>
                ) : null}
              </>
            )}
          </div>
         {
          !userlogin &&
         (  <div className="H login-container">
          <h3
           //  style={{
           //    display:
           //      localStorage.getItem('username') ||
           //      localStorage.getItem('isAdmin') === 'true'
           //        ? 'none'
           //        : 'block',
           //  }}
          >
            Login
            <div className="suggestion-box-log">
              <p
                onClick={(e) => {
                  setislog(true)
                  toggleMenu(e)
                  // console.log('hi')
                }}
              >
                Admin
              </p>
              <p
                onClick={(e) => {
                  setislog(true)
                  toggleMenu(e)
                  // console.log('hi')
                }}
              >
                User
              </p>
            </div>
          </h3>
        </div>)
         }
          <ModalLogin
            islog={islog}
            setislog={setislog}
            setusername={setusername}
            setuserlogin={setuserlogin}
            setIsAdmin={setIsAdmin}
            setUsername={setUsername}
            setcheckuserlogin={setcheckuserlogin}
            setissign={setissign}
            userlogin={userlogin}
          />
          <h3
            className="H"
            onClick={() => {
              localStorage.removeItem('username')
              const storedCart =
                JSON.parse(localStorage.getItem('cartItems')) || []
              const storedwish =
                JSON.parse(localStorage.getItem('wishItems')) || []
              dispatch(loadCartItemsFromLocal(storedCart))
              dispatch(loadWishItem(storedwish))
              setuserlogin(false)
              localStorage.setItem("userlogin", JSON.stringify(false));
              setusername('')
              setIsAdmin(false)
              setsignname(false)
              setcheckuserlogin(false)
              // console.log('logout running')
              localStorage.setItem('isAdmin', 'false')
              localStorage.setItem('signedUp', 'false')
              navigate('/')
            }}
            style={{
              display:
                localStorage.getItem('username') ||
                localStorage.getItem('isAdmin') === 'true'
                  ? 'block'
                  : 'none',
            }}
          >
            Logout
          </h3>
          <NavLink
            className={({ isActive }) => (isActive ? 'underline' : '')}
            to="/about"
          >
            {' '}
            <h3 className="H">About Us</h3>{' '}
          </NavLink>

          <NavLink
            className={({ isActive }) => (isActive ? 'underline' : '')}
            to="/contact"
          >
            {' '}
            <h3 className="H">Contact Us</h3>{' '}
          </NavLink>
        </div>
        <Hamburger toggleMenu={toggleMenu} />
      </div>
    </header>
  )
}
