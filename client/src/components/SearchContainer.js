import { useAppContext } from "../context/appContext"
import Wrapper from '../assets/wrappers/SearchContainer'
import {FormRow, FormRowSelect} from '.'

const SearchContainer = () => {
    const {
        isLoading,
        search,
        searchStatus,
        searchType,
        sort,
        handleChange,
        clearFilters,
    } = useAppContext()

    return(
        <Wrapper>
            <form className="form">
                <h4>search for</h4>
                {/* search position */}
                <div className="form-center">
                    <FormRow>
                        
                    </FormRow>

                </div>
            </form> 
        </Wrapper>
    )
}

export default SearchContainer