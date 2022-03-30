import { Outlet, Link } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/SharedLayout'
import { BigSidebar, SmallSidebar, Navbar } from '../../components/index'


const SharedLayout = () => {
    return (
        <Wrapper>
            <main className='dashboard'>
                <BigSidebar />
                <SmallSidebar />
                <div>
                    <Navbar />
                    <div className='dashboard-page'>
                        <Outlet />
                    </div>
                </div>
            </main>
        </Wrapper>
    )
}

export default SharedLayout