import React, {useState, useReducer, useContext } from 'react'
import reducer from './reducer'
import { DISPLAY_ALERT, CLEAR_ALERT } from './actions' 

export const initialState = {
    isLoading: false,
    alertOn: false,
    alertText:'',
    alertType:'',
}



const AppContext = React.createContext()
const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const displayAlert = () =>{
        dispatch({type:DISPLAY_ALERT})
    }
    const clearAlert = () => {
        dispatch({type:CLEAR_ALERT})
    }

    return(
        <AppContext.Provider
         value={{...state, displayAlert, clearAlert}}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider}