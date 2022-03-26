
const FormRow = ({type, value, name, LabelText, handleChange}) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {LabelText || name}
            </label>

            <input
                type={type}
                value={value}
                name={name}
                onChange={handleChange}
                className='form-input'
            />
        </div>
    )
}

export default FormRow