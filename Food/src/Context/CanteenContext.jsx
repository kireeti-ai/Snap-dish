import { createContext } from 'react';
import { canteen_list } from '../assets/assets.js';

export const CanteenContext = createContext(null);

const CanteenContextProvider = (props) => {
    const contextValue = {
        canteen_list
    }

    return (
        
        <CanteenContext.Provider value={contextValue}>
            {props.children} 
        </CanteenContext.Provider>
    )
}

export default CanteenContextProvider;