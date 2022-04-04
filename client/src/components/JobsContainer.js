import { useAppContext } from "../context/appContext"
import { Loading, Job } from "../components"
import Wrapper from "../assets/wrappers/JobsContainer"
import { useEffect } from "react"
import { PageBtnContainer } from '.'


const JobsContainer = () => {
    const {
        getJobs,
        jobs,
        totalJobs,
        numberOfPages,
        page,
        isLoading,
        search,
        searchStatus,
        searchType,
        sort
    } = useAppContext()

    useEffect(() => {
        getJobs()
        // eslint-disable-next-line
    }, [page, search, searchStatus, searchType, sort])

    if (isLoading) return <Loading isCenter={true} />

    if (jobs.length === 0)
        return (
            <Wrapper>
                <h2>No Jobs Found...</h2>
            </Wrapper>
        )

    return (
        <Wrapper>
            <h5>
                {totalJobs} job{jobs.length > 1 && 's'} listed
            </h5>

            <div className="jobs">
                {jobs.map(job => {
                    return <Job key={job._id} job={job} />
                })}
            </div>
            {numberOfPages > 1 && <PageBtnContainer />}
        </Wrapper>

    )
}

export default JobsContainer