import { useEffect } from "react"
import { useAppContext } from "../../context/appContext"
import { ChartsContainer, Loading, StatsContainer } from '../../components'


const Stats = () => {
    const {
        getStats,
        isLoading,
        monthlyApplications,
    } = useAppContext()

    useEffect(() => {
        getStats()
        // eslint-disable-next-line
    }, [])

    if (isLoading) return <Loading isCenter={true} />

    return (
        <>
            <StatsContainer />
            {monthlyApplications.length > 0 && <ChartsContainer />}
        </>
    )
}

export default Stats