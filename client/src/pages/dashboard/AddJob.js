import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'
import { Alert, FormRow } from '../../components'
import FormRowSelect from '../../components/FormRowSelect'
import { useNavigate } from 'react-router-dom'

const AddJob = () => {
    const {
        isEditing,
        alertOn,
        company,
        position,
        jobLocation,
        jobTypeOptions,
        jobType,
        statusOptions,
        status,
        displayEmptyFieldAlert,
        handleChange,
        clearValues,
        editJob,
        createJob,
    } = useAppContext()

    const navigate = useNavigate()

    const handleJobInput = (e) => {
        const name = e.target.name
        const value = e.target.value
        handleChange(name, value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!position || !company || !jobLocation) {
            displayEmptyFieldAlert()
            return
        }
        if (isEditing) {
            await editJob();
            setTimeout(() =>
                navigate('/all-jobs'), 1000)
            return
        }
        createJob({ position, company, jobLocation, jobType, status })
    }
    return (
        <Wrapper>
            <form className='form'>
                <h3>{isEditing ? 'Edit job' : 'Create job'}</h3>
                {alertOn && <Alert />}


                <div className='form-center'>
                    {/* position */}
                    <FormRow
                        type='text'
                        value={position}
                        name='position'
                        handleChange={handleJobInput}
                    />

                    {/* company */}
                    <FormRow
                        type='text'
                        value={company}
                        name='company'
                        handleChange={handleJobInput}
                    />

                    {/* location */}
                    <FormRow
                        type='text'
                        value={jobLocation}
                        LabelText='job location'
                        name='jobLocation'
                        handleChange={handleJobInput}
                    />

                    {/* job type */}
                    <FormRowSelect
                        labelText='type'
                        name='jobType'
                        value={jobType}
                        list={jobTypeOptions}
                        handleChange={handleJobInput}
                    />

                    {/* job status */}
                    <FormRowSelect
                        name='status'
                        value={status}
                        list={statusOptions}
                        handleChange={handleJobInput}
                    />

                    <div className='btn-container'>
                        <button
                            className='btn btn-block submit-btn'
                            type='submit'
                            onClick={ handleSubmit }
                        >
                            Submit
                        </button>
                        <button
                            className='btn btn-block clear-btn'
                            onClick={(e) => {
                                e.preventDefault()
                                clearValues()
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    )
}

export default AddJob