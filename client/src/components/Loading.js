
function Loading(isCenter) {
  return (
    <div className={isCenter ? 'loading loading-center' : 'loading'}></div>
  )
}

export default Loading