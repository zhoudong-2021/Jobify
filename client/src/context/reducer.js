import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
} from "./actions"

import { initialState } from "./appContext"

const reducer = (state, action) => {
    if (action.type === DISPLAY_ALERT) {
        return {
            ...state,
            alertOn: true,
            alertText: 'Please fill all fields.',
            alertType: 'danger',
        }
    }

    if (action.type === CLEAR_ALERT) {
        return {
            ...state,
            alertOn: false,
            alertText: '',
            alertType: '',
        }
    }

    // Register actions
    if (action.type === REGISTER_USER_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }

    if (action.type === REGISTER_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            user: action.payload.user,
            token: action.payload.token,
            userLocation: action.payload.user.location,
            jobLocation: action.payload.user.location,
            alertOn: true,
            alertText: 'Register successfully! Redirecting ...',
            alertType: 'success',
        }
    }

    if (action.type === REGISTER_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            alertOn: true,
            alertText: action.payload.msg,
            alertType: 'danger',
        }
    }

    // Login actions
    if (action.type === LOGIN_USER_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }

    if (action.type === LOGIN_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            user: action.payload.user,
            token: action.payload.token,
            userLocation: action.payload.user.location,
            jobLocation: action.payload.user.location,
            alertOn: true,
            alertText: 'Login successfully! Redirecting ...',
            alertType: 'success',
        }
    }

    if (action.type === LOGIN_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            alertOn: true,
            alertText: action.payload.msg,
            alertType: 'danger',
        }
    }

    // Logout User
    if (action.type === LOGOUT_USER) {
        return {
            ...initialState,
            user: null,
            token: null,
            userLocation: '',
            jobLocation: '',
        }
    }

    // Toggle side bar 
    if (action.type === TOGGLE_SIDEBAR) {
        return {
            ...state,
            showSidebar: !state.showSidebar
        }
    }
    

    throw new Error(`No such action: ${action.type}`)
}

export default reducer