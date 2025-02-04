import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import './EditUser.css'

const EditUser = () => {
  const navigate = useNavigate()
  const [, dark, , ,, uname1, setUsername] = useOutletContext() // Get username from context

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    address: '',
    isAdmin: false,
  })
// console.log(uname1);

  useEffect(() => {
    // Fetch user data from the server based on the username (uname1)
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${uname1}`
        )
        if (!response.ok) {
          alert('Failed to fetch user data')
          return
        }
        const data = await response.json()
        setUserData(data) // Populate form with fetched user data
      } catch (error) {
        console.error('Error fetching user data:', error)
        alert('Error fetching user data')
      }
    }

    if (uname1) {
      fetchUserData() // Fetch user data if a valid username is available
    } else {
      console.log('username not found');
      
      navigate('/Home') // Redirect if username is not found
    }
  }, [uname1, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleAdminChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      isAdmin: e.target.checked,
    }))
  }

  const handleSave = async () => {
    // Validate fields
    const errorMessages = []
    if (!userData.username.trim()) errorMessages.push('Username is required.')
    if (!userData.password.trim()) errorMessages.push('Password is required.')
    if (!userData.phone.trim()) errorMessages.push('Phone number is required.')
    if (!userData.email.trim()) errorMessages.push('Email is required.')
    if (!userData.address.trim()) errorMessages.push('Address is required.')
  
    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'))
      return
    }
  
    try {
      // Fetch user ID using username
      const userResponse = await fetch(`http://localhost:8080/api/users/${uname1}`)
      if (!userResponse.ok) {
        throw new Error('User not found')
      }
      const user = await userResponse.json()
  
      // Update user details
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
  
      if (response.status === 409) { // Check for username or email conflict
        const result = await response.json()
        if (result.email) {
          alert('Email already exists. Please choose another email.')
        } else if (result.username) {
          alert('Username already exists. Please choose another username.')
        }
        return
      }
  
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
  
      const updatedUser = await response.json()
      localStorage.setItem('username', userData.username)
      setUsername(userData.username)
      alert('Profile updated successfully')
      navigate('/')
    } catch (error) {
      console.error('Error:', error.message)
      alert('Error updating user')
    }
  }
  return (
    <div className="editu">
      <div className={`edit-user-modal ${dark ? 'dark' : ''}`}>
        <div className="edit-user-modal-content">
          <h2>Edit Profile</h2>
          <div className="edit-form">
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={userData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUser
