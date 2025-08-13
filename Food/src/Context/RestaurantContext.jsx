
import { createContext } from 'react';
import { restaurant_list } from '../assets/assets.js';


export const RestaurantContext = createContext(null);

const RestaurantContextProvider = (props) => {
    const contextValue = {
        restaurant_list
    }

    return (
      
        <RestaurantContext.Provider value={contextValue}>
            {props.children} 
        </RestaurantContext.Provider>
    )
}

export default RestaurantContextProvider;   