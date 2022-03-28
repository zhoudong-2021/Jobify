import React, { useState, useReducer, useContext } from 'react'
import reducer from './reducer'
import { 
    DISPLAY_ALERT, 
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR 
} from './actions'
import axios from 'axios'

const sleep = (delay) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}
// Set 1s delay of response
axios.interceptors.response.use(async response => {
    await sleep(1000)
    return response
}, error => Promise.reject(error))

// Store and delete user info from localstorage
const addUserToLocalStorage = ({user, token}) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', user.location)
}

const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('location')
}

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')



export const initialState = {
    isLoading: false,
    alertOn: false,
    alertText: '',
    alertType: '',
    user: user? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
}


const AppContext = React.createContext()
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const displayEmptyFieldAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
    }
    const clearAlert = () => {
        dispatch({ type: CLEAR_ALERT })
    }

    // Register method
    const register = async (userInfo) => {
        dispatch({ type: REGISTER_USER_BEGIN })

        try {
            const res = await axios.post('/api/v1/auth/register', userInfo)
            const { user, token } = res.data
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: {
                    user: user,
                    token: token
                }
            })
            // addUserToLocalStorage(user, token)
            addUserToLocalStorage({user, token})
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: REGISTER_USER_ERROR,
                payload:{
                    msg: error.response.data.msg
                }
            })
        }
    }

    return (
        <AppContext.Provider
            value={{ ...state, displayEmptyFieldAlert, clearAlert, register }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider }