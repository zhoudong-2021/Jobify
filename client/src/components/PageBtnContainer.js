import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
    const { numberOfPages, page, handleChange  } = useAppContext()
    const pages = Array.from({ length: numberOfPages }, (v, index) => index + 1)

    const prevPage = () => {
        if(page === 1) return
        handleChange('page', page - 1)
    }

    const nextPage = () => {
        if(page === numberOfPages) return
        handleChange('page', page + 1)
    }

    const handleClick = (index) => {
        handleChange('page', index)
    }
    return (
        <Wrapper>
            <button
                className='prev-btn'
                onClick={prevPage}>
                <HiChevronDoubleLeft />
                prev
            </button>
            <div className='btn-container'>
                {pages.map(index => (
                    <button 
                    type='button'
                    className={page === index ? 'pageBtn active' : 'pageBtn'}
                    key={index}
                    onClick={()=>handleClick(index)}
                    >
                        {index}
                    </button>
))}
            </div>

            <button
                className='next-btn'
                onClick={nextPage}>
                next
                <HiChevronDoubleRight />
            </button>

        </Wrapper>
    )
}

export default PageBtnContainer