import React, { useEffect, useState, useContext } from 'react';
import './App.css'; 

// Create a new context
const DataContext = React.createContext();

// Custom hook to access the data context
const useDataContext = () => useContext(DataContext);

// Data provider component
const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Get current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add to Cart handler
  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
    setMessage('Item added to cart');
  };

  // Remove from Cart handler
  const handleRemoveFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        currentItems,
        itemsPerPage,
        currentPage,
        paginate,
        cartItems,
        message,
        setCartItems,
        setMessage,
        handleAddToCart,
        handleRemoveFromCart,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Home component
const Home = () => {
  const {
    data,
    currentItems,
    itemsPerPage,
    currentPage,
    paginate,
    cartItems,
    message,
    handleAddToCart,
    handleRemoveFromCart,
  } = useDataContext();

  return (
    <div className="container">
      <h1>Catalog of Items</h1>
      <ul>
        {currentItems.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
      <p className="message">{message}</p>
      <p>Items in Cart: {cartItems.length}</p>

      <Pagination itemsPerPage={itemsPerPage} totalItems={data.length} currentPage={currentPage} paginate={paginate} />
    </div>
  );
};

// Cart component
const Cart = () => {
  const { cartItems, handleRemoveFromCart } = useDataContext();

  return (
    <div className="container">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>{item.title}</span>
              <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Pagination component
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <ul>
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <button onClick={() => paginate(pageNumber)}>{pageNumber}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// App component
const App = () => {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <DataProvider>
      <div className="container">
        <button className="tab-button" onClick={() => setActiveTab('Home')}>
          Home
        </button>
        <button className="tab-button" onClick={() => setActiveTab('Cart')}>
          Cart
        </button>
      </div>
      {activeTab === 'Home' ? <Home /> : <Cart />}
    </DataProvider>
  );
};

export default App;
