import Header from '../Header'

import './index.css'

const NotFound = () => (
  <div className="not-found-route-container">
    <Header />
    <div className="not-found-responsive-container">
      <div className="flex-center">
        <img
          alt="not found"
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          className="not-found-img"
        />
        <h1>Page Not Found</h1>
        <p>we&apos;re sorry, the page you requested could not be found.</p>
      </div>
    </div>
  </div>
)

export default NotFound
