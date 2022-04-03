import { useEffect, useState } from "react"
import Wrapper from "../assets/wrappers/RegisterPage"
import { Alert, FormRow, Logo } from "../components"
import { useAppContext } from "../context/appContext"
import {useNavigate} from 'react-router-dom'

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true
} 

const Register = () => {
    const [values, setValues] = useState(initialState)
    const navigate = useNavigate()

    const {
        user,
        isLoading, 
        alertOn, 
        displayEmptyFieldAlert, 
        clearAlert,
        register,
        login
    } = useAppContext()

    useEffect(() => {
        if(user){
            setTimeout(() => {
                navigate('/')
                clearAlert()
            }, 2000)  
        }
    },[user, navigate, clearAlert])

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault()
        clearAlert()
        const {name, email, password, isMember} = values
        if(!email || !password || (!isMember && !name)){
            return displayEmptyFieldAlert()
        }
        const user = {name, email, password}
        if(isMember){
            login(user)
        }
        else{
            register(user)
        }

    }

    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    return (
        <Wrapper className="full-page">
            <form className="form" onSubmit={onSubmit}>
                <Logo />
                <h3>{values.isMember ? 'Login' : 'Register'}</h3>

                {/* name field */}
                {!values.isMember && <FormRow
                    type={'text'}
                    value={values.name}
                    name={'name'}
                    handleChange={handleChange} />}

                {/* email field */}
                <FormRow
                    type={'email'}
                    value={values.email}
                    name={'email'}
                    handleChange={handleChange} />

                {/* password field */}
                <FormRow
                    type={'password'}
                    value={values.password}
                    name={'password'}
                    handleChange={handleChange} />

                {/* Alert field */}
                {alertOn && <Alert />}

                <button 
                disabled={isLoading}
                type='submit' 
                className="btn btn-block">
                    submit
                </button>

                <p>
                    {!values.isMember ? 'Already a member? ' : `Not a member yet? `}

                    <button type='button' onClick={toggleMember} className='member-btn'>
                        {values.isMember ? 'Register' : 'Login'}
                    </button>
                </p>

            </form>

        </Wrapper>
    )
}

export default Register