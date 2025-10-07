import React, { useState, useContext, useEffect } from 'react'; 
import axios from 'axios'; 
import Navbar from './components/navbar/navbar.jsx';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/placeOrder/PlaceOrder.jsx';
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
import SearchPage from './pages/SearchPage/SearchPage.jsx';
import RestaurantDisplay from './components/RestaurantDisplay/RestaurantDisplay.jsx';
import MyReviews from './pages/MyReviews/MyReviews.jsx';
import PersonalInfoEdit from './pages/profile/profile.jsx';
import CreatorCommunity from './pages/Affiliate/CreatorCommunity.jsx';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  // Get token and url from context to fetch user data
  const { showRestaurantPrompt, token, url } = useContext(StoreContext);

  // --- START: NEW LOGIC TO FETCH USER ---
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(`${url}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setUser(response.data.user); // Store the full user object
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          setUser(null);
        }
      } else {
        setUser(null); // Clear user if no token
      }
    };

    fetchUserProfile();
  }, [token, url]);
  // --- END: NEW LOGIC TO FETCH USER ---

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      {showRestaurantPrompt && <RestaurantChangePrompt />}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/restaurant/:id' element={<RestaurantDetail />} />
          
          {/* --- MODIFIED ROUTE: PASS USER AND TOKEN PROPS --- */}
          <Route 
            path='/partner-with-us' 
            element={<ManageRestaurant user={user} token={token} />} 
          />
          
          <Route path='/restaurant' element={<RestaurantDisplay />} />
          <Route path='/address' element={<AddressManager />} />
          <Route path='/myOrders' element={<MyOrders />} />
          <Route path='/wishList' element={<Wishlist />} />
          <Route path='/orderSuccess' element={<OrderSuccess />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/reviews-user' element={<MyReviews />} />
          <Route path='/profile-edit' element={<PersonalInfoEdit />} />
          <Route path='/affiliate' element={<CreatorCommunity/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;