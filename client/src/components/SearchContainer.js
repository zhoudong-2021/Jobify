import { useAppContext } from "../context/appContext"
import Wrapper from '../assets/wrappers/SearchContainer'
import { FormRow, FormRowSelect } from '.'

const SearchContainer = () => {
    const {
        isLoading,
        search,
        searchStatus,
        searchType,
        sort,
        handleChange,
        clearFilters,
        sortOptions,
        statusOptions,
        jobTypeOptions,
    } = useAppContext()

    const handleSearch = (e) => {
        if (isLoading) return
        handleChange(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearFilters()
    }

    return (
        <Wrapper>
            <form className="form">
                <h4>search for</h4>
                {/* search position */}
                <div className="form-center">
                    <FormRow
                        type='text'
                        name='search'
                        value={search}
                        handleChange={handleSearch}
                    >
                    </FormRow>

                    {/* search by status */}
                    <FormRowSelect
                        labelText='job status'
                        name='searchStatus'
                        value={searchStatus}
                        handleChange={handleSearch}
                        list={['all', ...statusOptions]}
                    >
                    </FormRowSelect>

                    {/* search by type */}
                    <FormRowSelect
                        labelText='job type'
                        name='searchType'
                        value={searchType}
                        handleChange={handleSearch}
                        list={['all', ...jobTypeOptions]}
                    >
                    </FormRowSelect>

                    {/* sort*/}
                    <FormRowSelect
                        name='sort'
                        value={sort}
                        handleChange={handleSearch}
                        list={sortOptions}
                    >
                    </FormRowSelect>

                    <button
                        className="btn btn-block btn-danger"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        clear filters
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default SearchContainer