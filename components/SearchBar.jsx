// import React, { useEffect, useRef, useState } from 'react'
// import { Navigate, useNavigate } from 'react-router-dom';
// // import './Search.css'
// export default function SearchBar({ setquery }) {
//   let element = document.querySelector('.list-contain')


//   const listContainRef = useRef(null);
//   const inputRef = useRef(null);
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const [query1, setQuery1] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();
//   const data = ['jewelery', "men's clothing", 'electronics', "women's clothing"]
  
//   const handleChange = (e) => {
//     const value = e.target.value;
//     setQuery1(value);
//     let element = document.querySelector('.list-contain');
  
//     // Filter data based on user input
//     if (value.length > 0) {
//       const filteredSuggestions = data.filter(item =>
//         item.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestions(filteredSuggestions);
  
//       // Add or remove the 'visible' class based on suggestions
//       if (filteredSuggestions.length > 0) {
//         element.classList.add('visible');
//       } else {
//         element.classList.remove('visible');
//       }
//     } else {
//       // Clear suggestions and remove the 'visible' class when the input is cleared
//       setSuggestions([]);
//       element.classList.remove('visible');
//     }
  
//   };

//   const handlesearch = () => {
//     console.log('hi');
//     // Trigger search with the current query1 value
//     if (query1.trim() !== '') {
//       setquery(query1.toLowerCase());
//     }
//   };

  
//   const handleKeyDown = (e) => {
//     // console.log('Before update:', highlightedIndex);
//     // console.log('sugge-len',suggestions.length);
    
//     if (e.key === 'ArrowDown') {
//       setHighlightedIndex((prevIndex) => {
//         const newIndex = prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0;
//         // console.log('New index:', newIndex);
//         return newIndex;
//       });
//     } else if (e.key === 'ArrowUp') {
//       setHighlightedIndex((prevIndex) => {
//         const newIndex = prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1;
//         console.log('New index:', newIndex);
//         return newIndex;
//       });
//     } else if (e.key === 'Enter' && highlightedIndex >= 0) {
//       // console.log('Enter pressed, selected suggestion:', suggestions[highlightedIndex]);
//       handleSuggestionClick(suggestions[highlightedIndex]);
//     }
//   };


//   const handleSuggestionClick = (suggestion) => {
//     console.log('clicked suggestion', suggestion);
//     setQuery1(suggestion);
//     setquery(suggestion);
//     setSuggestions([]);
//     setHighlightedIndex(-1);
//     navigateToSuggestion(suggestion);
//   };

//   useEffect(() => {
//     const inputElement = inputRef.current;

//     if (inputElement) {
//       inputElement.addEventListener('keydown', handleKeyDown);
//     }

//     return () => {
//       if (inputElement) {
//         inputElement.removeEventListener('keydown', handleKeyDown);
//       }
//     };
//   }, [suggestions, highlightedIndex]);


//   const navigateToSuggestion = (suggestion) => {
//     navigate(`/carousel/${suggestion}`);
//   };

//   return (
//     <div className="search-container">
//        <i onClick={handlesearch} className="fa-solid fa-magnifying-glass"></i>
//       <input
//         onChange={handleChange}
//         ref={inputRef}
//         type="text"
//         value={query1}
//         placeholder="Search for a Category..."
//       />

//       {/* Always render the suggestions container */}
//       <div className={`list-contain ${suggestions.length > 0 ? 'visible' : ''}`} ref={listContainRef}>
//         <ul>
//           {suggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               className={`list-item ${index === highlightedIndex ? 'highlighted' : ''}`}
//               onClick={() => handleSuggestionClick(suggestion)}
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }








import { productsList } from '../store/productsList';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ setquery }) {
  const listContainRef = useRef(null);
  const inputRef = useRef(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [query1, setQuery1] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  document.addEventListener('click', (e) => {
    listContainRef.current?.classList.remove('visible');
})


  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setquery(value)
    setQuery1(value);

    // Filter product titles based on user input
    if (value.length > 0) {
      const filteredSuggestions = productsList.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);

      if (filteredSuggestions.length > 0) {
        listContainRef.current?.classList.add('visible');
      } else {
        listContainRef.current?.classList.remove('visible');
      }
    } else {
      setSuggestions([]);
      listContainRef.current?.classList.remove('visible');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedProduct = productsList.find(
      (product) => product.title === suggestion
    );

    if (selectedProduct) {
      navigate(`/${selectedProduct.id}`); // Navigate to the product detail page by ID
    }
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }
    document.querySelector('.imnp').addEventListener('click' , (e)=>
      {
        e.stopPropagation()
      })
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [suggestions, highlightedIndex]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleSuggestionClick(suggestions[highlightedIndex].title);
    }
  };

  return (
    <div className="search-container">
      <i onClick={handleSearch} className="fa-solid fa-magnifying-glass"></i>
      <input
      className='imnp'
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => {
          handleChange(e);
          setSearchTerm(e.target.value);
        }}
        ref={inputRef}
      />

      <div
        className={`list-contain ${suggestions.length > 0 ? 'visible' : ''}`}
        ref={listContainRef}
      >
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`list-item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion.title)}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
