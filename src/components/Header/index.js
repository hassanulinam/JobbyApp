import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoMdHome, IoMdExit} from 'react-icons/io'

import './index.css'

const Header = props => {
  const logoutTheSession = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="header-responsive-container">
      <ul className="header-container">
        <li>
          <Link to="/">
            <img
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
              className="website-logo"
            />
          </Link>
        </li>
        <li className="header-nav-item-container">
          <Link to="/" className="nav-link-item">
            <p className="d-none d-md-inline mr-2">Home</p>
            <IoMdHome size="30" className="d-inline d-md-none" />
          </Link>
          <Link to="/jobs" className="nav-link-item">
            <p className="d-none d-md-inline">Jobs</p>
            <BsBriefcaseFill size="28" className="d-inline d-md-none" />
          </Link>
          <button
            type="button"
            className="transparent-btn d-inline d-md-none"
            onClick={logoutTheSession}
          >
            <IoMdExit size="30" color="#ffffff" />
          </button>
        </li>
        <li>
          <button
            type="button"
            className="logout-btn d-none d-md-inline"
            onClick={logoutTheSession}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
