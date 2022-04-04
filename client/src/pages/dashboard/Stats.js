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