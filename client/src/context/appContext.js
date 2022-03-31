import React, { useReducer, useContext } from 'react'
import reducer from './reducer'
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    LOGOUT_USER,
    TOGGLE_SIDEBAR,
} from './actions'
import axios from 'axios'



const sleep = (delay) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}


// Store and delete user info from localstorage
const addUserToLocalStorage = ({ user, token }) => {
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
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false,
}


const AppContext = React.createContext()
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Set base URI and token in request
    const authFetch = axios.create({
        baseURL: '/api/v1',
    })

    authFetch.interceptors.request.use(
        config => {
            config.headers.common['Authorization'] = `Bearer ${state.token}`
            return config
        },
        error => {
            return Promise.reject(error)
        }
    )

    axios.interceptors.response.use(async response => {
        // Set 1s delay of response
        await sleep(1000)
        return response
    }, error => {
        if(error.response.status === 401){
            logoutUser()
        }
        return Promise.reject(error)
    })

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
            addUserToLocalStorage({ user, token })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
    }

    // Login method
    const login = async (userInfo) => {
        dispatch({ type: LOGIN_USER_BEGIN })

        try {
            const res = await axios.post('/api/v1/auth/login', userInfo)

            const { user, token } = res.data
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: {
                    user: user,
                    token: token
                }
            })
            addUserToLocalStorage({ user, token })
        } catch (error) {
            if(error.response.status !== 401){
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })}
        }
    }

    const logoutUser = () => {
        dispatch({
            type: LOGOUT_USER
        })
        removeUserFromLocalStorage()
        clearAlert()
    }

    // Update user
    const updateUser = async (currentUser) => {
        dispatch({
            type: UPDATE_USER_BEGIN
        })
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser)
            console.log(data.user)
            const {user} = data
            const token = state.token
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {
                    user: data.user
                }
            })
            addUserToLocalStorage({user, token})
        } catch (error) {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
    }

    const toggleSidebar = () => {
        dispatch({
            type: TOGGLE_SIDEBAR,
        })
    }



    return (
        <AppContext.Provider
            value={{
                ...state,
                displayEmptyFieldAlert,
                toggleSidebar,
                clearAlert,
                updateUser,
                register,
                logoutUser,
                login,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider }