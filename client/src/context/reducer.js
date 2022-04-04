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
    HANDLE_CHANGE,
    CLEAR_VALUES,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    CREAT_JOB_BEGIN,
    CREAT_JOB_SUCCESS,
    CREAT_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    DELETE_JOB_BEGIN,
    DELETE_JOB_SUCCESS,
    DELETE_JOB_ERROR,
    GET_STATS_BEGIN,
    GET_STATS_SUCCESS,
    GET_STATS_ERROR,
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

    // Update User
    if (action.type === UPDATE_USER_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }

    if (action.type === UPDATE_USER_SUCCESS) {
        console.log(action.payload.user);
        return {
            ...state,
            isLoading: false,
            user: action.payload.user,
            userLocation: action.payload.user.location,
            jobLocation: action.payload.user.location,
            alertOn: true,
            alertText: 'User Profile Updated!',
            alertType: 'success',
        }
    }

    if (action.type === UPDATE_USER_ERROR) {
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

    // Handle input values
    if (action.type === HANDLE_CHANGE) {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    }

    // Clear input values
    if (action.type === CLEAR_VALUES) {
        const initialState = {
            isEditing: false,
            editJobId: '',
            position: '',
            company: '',
            jobLocation: state.userLocation,
            jobType: 'full-time',
            status: 'pending',
        }
        return { ...state, ...initialState }
    }

    // Toggle side bar 
    if (action.type === TOGGLE_SIDEBAR) {
        return {
            ...state,
            showSidebar: !state.showSidebar
        }
    }

    // Create job
    if (action.type === CREAT_JOB_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }

    if (action.type === CREAT_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            alertOn: true,
            alertText: 'New job created',
            alertType: 'success',
        }
    }

    if (action.type === CREAT_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            alertOn: true,
            alertText: action.payload.msg,
            alertType: 'danger',
        }
    }

    // Get jobs
    if (action.type === GET_JOBS_BEGIN) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if (action.type === GET_JOBS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            jobs: action.payload.jobs,
            totalJobs: action.payload.totalJobs,
            numberOfPages: action.payload.numberOfPages,
            page: action.payload.page,
        }
    }

    // Set edit job
    if (action.type === SET_EDIT_JOB) {
        const job = state.jobs.find(job => job._id === action.payload.id)
        const { _id, company, position, jobLocation, jobType, status } = job
        return {
            ...state,
            isEditing: true,
            editJobId: _id,
            company,
            position,
            jobLocation,
            jobType,
            status
        }
    }

    // Edit job
    if(action.type === EDIT_JOB_BEGIN){
        return {
            ...state,
            isLoading:true
        }
    }

    if(action.type === EDIT_JOB_SUCCESS){
        return {
            ...state,
            isEditing:false,
            isLoading:false,
            alertOn: true,
            alertType: 'success',
            alertText: 'Update job successfully!'
        }
    }

    if(action.type === EDIT_JOB_ERROR){
        return {
            ...state,
            isLoading:false,
            alertOn: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }

    // Delete job
    if(action.type === DELETE_JOB_BEGIN){
        return {
            ...state,
            isLoading:true
        }
    }

    if(action.type === DELETE_JOB_SUCCESS){
        return {
            ...state,
            isLoading:false
        }
    }

    if(action.type === DELETE_JOB_ERROR){
        return {
            ...state,
            isLoading:false
        }
    }

    // Get stats data
    if(action.type === GET_STATS_BEGIN){
        return {
            ...state,
            isLoading:true
        }
    }

    if(action.type === GET_STATS_SUCCESS){
        return {
            ...state,
            isLoading:false,
            defaultStats: action.payload.defaultStats,
            monthlyApplications: action.payload.monthlyApplications,
        }
    }

    if(action.type === GET_STATS_ERROR){
        return {
            ...state,
            isLoading:false
        }
    }

    throw new Error(`No such action: ${action.type}`)
}

export default reducer