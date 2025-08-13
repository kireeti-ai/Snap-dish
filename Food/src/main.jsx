import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext.jsx'
import RestaurantContextProvider from './Context/RestaurantContext.jsx'
import CanteenContextProvider from './Context/CanteenContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <RestaurantContextProvider>
        <CanteenContextProvider>
          <App />
        </CanteenContextProvider>
      </RestaurantContextProvider>
    </StoreContextProvider>
  </BrowserRouter>


)
