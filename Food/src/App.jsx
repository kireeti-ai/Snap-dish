
import React, { useState, useContext } from 'react';
import Navbar from './components/navbar/navbar.jsx';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';

import PlaceOrder from './pages/placeOrder/PlaceOrder.jsx' 
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail.jsx';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';
import { StoreContext } from './Context/StoreContext.jsx';
import RestaurantChangePrompt from './components/RestaurantChangePrompt/RestaurantChangePrompt.jsx';
import Footer from './components/Footer/Footer.jsx';
import ManageRestaurant from './pages/ManageResturant/ManageResturant.jsx';

import AddressManager from './components/Addresses/AddressManager.jsx';
import MyOrders from './pages/MyOrders/MyOrders.jsx';
import Wishlist from './pages/WishList/WishList.jsx';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess.jsx';
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { showRestaurantPrompt } = useContext(StoreContext);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {showRestaurantPrompt && <RestaurantChangePrompt />}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/restaurant/:id' element={<RestaurantDetail />} />
          <Route path='/partner-with-us' element={<ManageRestaurant />} />
          
          <Route path='/address' element={<AddressManager/>}/>
          <Route path='/myOrders' element={<MyOrders/>} />
          <Route path='/wishList' element={<Wishlist/>}/>
          <Route path ='/orderSuccess' element={<OrderSuccess/>}/>
        </Routes>
        
      </div>
      <Footer/>
    </>
  );
};

export default App;
