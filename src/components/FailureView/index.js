import './index.css'

const FailureView = props => {
  const {retryMethod} = props

  return (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-img"
      />
      <h1 className="mt-3">Oops! Something Went Wrong</h1>
      <p className="mb-2">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={() => retryMethod()}>
        Retry
      </button>
    </div>
  )
}

export default FailureView
