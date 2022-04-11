/* eslint-disable camelcase */
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    submitErrMsg: '',
    nameErr: '',
    passwordErr: '',
  }

  onNameInputChange = event => {
    const nameErr = event.target.value === '' ? '*Required' : ''
    this.setState({username: event.target.value, nameErr})
  }

  onPasswordInputChange = event => {
    const passwordErr = event.target.value === '' ? '*Required' : ''
    this.setState({password: event.target.value, passwordErr})
  }

  saveAccessTokenAndNavigateToHome = token => {
    Cookies.set('jwt_token', token, {expires: 5})
    const {history} = this.props
    history.replace('/')
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const URL = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(URL, options)
    const data = await response.json()
    if (response.ok) {
      this.saveAccessTokenAndNavigateToHome(data.jwt_token)
    } else {
      let {error_msg} = data
      error_msg = error_msg.replace('user', 'User')
      error_msg = error_msg.replace('pass', 'Pass')
      this.setState({
        submitErrMsg: `*${error_msg}`,
      })
    }
  }

  renderForm = () => {
    const {username, password, submitErrMsg, nameErr, passwordErr} = this.state

    return (
      <form className="login-form-container" onSubmit={this.submitForm}>
        <img
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
          className="login-website-logo"
        />
        <label htmlFor="usernameInput">USERNAME</label>
        <input
          id="usernameInput"
          value={username}
          className="input-field"
          placeholder="Username"
          onBlur={this.onNameInputChange}
          onChange={this.onNameInputChange}
        />
        <p className="error-message">{nameErr}</p>
        <label htmlFor="passwordInput">PASSWORD</label>
        <input
          id="passwordInput"
          type="password"
          value={password}
          className="input-field"
          placeholder="Password"
          onBlur={this.onPasswordInputChange}
          onChange={this.onPasswordInputChange}
        />
        <p className="error-message">{passwordErr}</p>
        <button type="submit" className="login-btn">
          Login
        </button>
        <p className="error-message">{submitErrMsg}</p>
      </form>
    )
  }

  render() {
    const accessToken = Cookies.get('jwt_token')
    if (accessToken !== undefined) return <Redirect to="/" />
    return <div className="login-route-container">{this.renderForm()}</div>
  }
}

export default Login
