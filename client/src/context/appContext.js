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
    HANDLE_CHANGE,
    CLEAR_VALUES,
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
    DELETE_JOB_ERROR,
    DELETE_JOB_SUCCESS,
    GET_STATS_BEGIN,
    GET_STATS_SUCCESS,
    GET_STATS_ERROR,
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
    isEditing: false,
    editJobId: '',
    company: '',
    position: '',
    jobLocation: userLocation || '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numberOfPages: 1,
    page: 1,
    defaultStats: {},
    monthlyApplications:[],
    showSidebar: false,
    search:'',
    searchType: 'all',
    searchStatus: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
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
        // await sleep(1000)
        return response
    }, error => {
        if (error.response.status === 401) {
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

    const clearAlertAuto = () => {
        setTimeout(clearAlert, 2000)
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
            if (error.response.status !== 401) {
                dispatch({
                    type: LOGIN_USER_ERROR,
                    payload: {
                        msg: error.response.data.msg
                    }
                })
            }
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
            const { user } = data
            const token = state.token
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {
                    user: data.user
                }
            })
            clearAlertAuto()
            addUserToLocalStorage({ user, token })
        } catch (error) {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
    }

    // Create job
    const createJob = async (jobInfo) => {
        dispatch({ type: CREAT_JOB_BEGIN })
        try {
            const { data } = await authFetch.post('/jobs', jobInfo)
            const job = data.job
            dispatch({
                type: CREAT_JOB_SUCCESS,
                payload: job
            })
            clearAlertAuto()
            clearValues()
        } catch (error) {
            console.log(error)
            dispatch({
                type: CREAT_JOB_ERROR,
                payload: { msg: error.response.data.msg }
            })
            clearAlertAuto()
        }
    }

    // Get jobs
    const getJobs = async () => {
        // Clear alert msg from other components
        clearAlert()
        dispatch({ type: GET_JOBS_BEGIN })
        try {
            const { data } = await authFetch.get('/jobs')
            const { jobs, totalJobs, numberOfPages } = data
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numberOfPages
                }
            })
        } catch (error) {
            console.log(error)
            logoutUser()
        }
    }

    // Edit job
    const setEditJob = (id) => {
        dispatch({
            type: SET_EDIT_JOB,
            payload: { id }
        })
    }

    const editJob = async() => {
        dispatch({type: EDIT_JOB_BEGIN})
        const {
            editJobId,
            company,
            position,
            jobLocation,
            jobType,
            status } = state
        try {
            const job = await authFetch.patch(`/jobs/${editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status, 
            })
            dispatch({
                type: EDIT_JOB_SUCCESS,
            })
            clearValues()
        } catch (error) {
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: {msg:error.response.data.msg}
            })
        }
        clearAlertAuto()
    }

    // Delete Job 
    const deleteJob = async (id) => {
        dispatch({type: DELETE_JOB_BEGIN})
        try {
        await authFetch.delete(`/jobs/${id}`)
        dispatch({type: DELETE_JOB_SUCCESS})
        getJobs()
        } catch (error) {
            console.log(error)
            dispatch({type: DELETE_JOB_ERROR})
        }
    }

    // Get Stats Data
    const getStats = async () => {
        clearAlert()
        dispatch({type: GET_STATS_BEGIN})
        try {
            const {data} = await authFetch.get('/jobs/stats')
            const {defaultStats, monthlyApplications} = data
            dispatch({
                type: GET_STATS_SUCCESS,
                payload: {
                    defaultStats, 
                    monthlyApplications
                }
            })
        } catch (error) {
            console.log(error)
            dispatch({type: GET_STATS_ERROR})
            logoutUser()
        }
    }

    // Handle input values
    const handleChange = (name, value) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: {
                name,
                value
            }
        })
    }

    // Clear input values
    const clearValues = () => {
        dispatch({
            type: CLEAR_VALUES
        })
    }

    // Clear filters
    const clearFilters = () => {
        console.log('clear filters')
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
                clearAlertAuto,
                updateUser,
                register,
                logoutUser,
                login,
                handleChange,
                clearValues,
                createJob,
                getJobs,
                setEditJob,
                editJob,
                deleteJob,
                getStats,
                clearFilters
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