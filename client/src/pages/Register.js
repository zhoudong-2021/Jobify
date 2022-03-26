import { useState } from "react"
import Wrapper from "../assets/wrappers/RegisterPage"
import { Alert, FormRow, Logo } from "../components"
import { useAppContext } from "../context/appContext"

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true
}

const Register = () => {
    const [values, setValues] = useState(initialState)

    // global context and useNavigate later
    const {isLoading, alertOn, displayAlert, clearAlert} = useAppContext()

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const {name, email, password, isMember} = values
        if(!email || !password || (!isMember && !name)){
            return displayAlert()
        }
        clearAlert()
        console.log(values)
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

                <button type='submit' className="btn btn-block">
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