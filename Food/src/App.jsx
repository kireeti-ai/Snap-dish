// src/App.jsx
import React, { useState, useContext } from 'react'; // 1. Import useContext
import Navbar from './components/navbar/navbar.jsx';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/placeOrder/PlaceOrder';
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail.jsx';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';

// 2. Import the context and the new prompt component
import { StoreContext } from './Context/StoreContext.jsx';
import RestaurantChangePrompt from './components/RestaurantChangePrompt/RestaurantChangePrompt.jsx';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  // 3. Get the state for the prompt from the context
  const { showRestaurantPrompt } = useContext(StoreContext);

  return (
    <>
      {/* This is your existing login popup */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      {/* 4. Conditionally render the new restaurant change prompt */}
      {showRestaurantPrompt && <RestaurantChangePrompt />}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/restaurant/:id' element={<RestaurantDetail />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
