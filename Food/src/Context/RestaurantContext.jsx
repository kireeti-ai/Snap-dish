// src/Context/RestaurantContext.jsx - CORRECTED
import { createContext } from 'react';
import { restaurant_list } from '../assets/assets.js';

export const RestaurantContext = createContext(null);

const RestaurantContextProvider = (props) => {
    const contextValue = {
        restaurant_list
    }

    return (
        // Use the Provider from the Context, not the component itself
        <RestaurantContext.Provider value={contextValue}>
            {props.children} {/* Corrected typo: props.children */}
        </RestaurantContext.Provider>
    )
}

export default RestaurantContextProvider;   