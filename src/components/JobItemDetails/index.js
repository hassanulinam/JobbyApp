/* eslint-disable camelcase */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

class JobItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, jobData: {}}

  componentDidMount() {
    this.accessToken = Cookies.get('jwt_token')
    this.fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    }
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const URL = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(URL, this.fetchOptions)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobData: data,
      })
    } else this.setState({apiStatus: apiStatusConstants.failure})
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData} = this.state
    const {job_details, similar_jobs} = jobData
    const {
      company_logo_url,
      title,
      employment_type,
      job_description,
      location,
      package_per_annum,
      rating,
      life_at_company,
      skills,
      company_website_url,
    } = job_details

    return (
      <ul>
        <li className="job-item-card-container mb-2">
          <div className="flex-row">
            <img
              alt="job details company logo"
              src={company_logo_url}
              className="company-logo"
            />
            <div className="ml-1">
              <h1>{title}</h1>
              <div className="flex-row">
                <BsStarFill color="#ffff00" size="20" />
                <p className="bold ml-1">{rating}</p>
              </div>
            </div>
          </div>
          <div className="flex-row justify-content-between mb-0 mt-3">
            <div className="flex-row">
              <div className="flex-row mr-4">
                <MdLocationOn color="#dddeee" size="20" />
                <p className="ml-1">{location}</p>
              </div>
              <div className="flex-row">
                <BsBriefcaseFill color="#dddddd" size="20" />
                <p className="ml-1">{employment_type}</p>
              </div>
            </div>
            <div>
              <p className="job-title">{package_per_annum}</p>
            </div>
          </div>
          <hr />
          <div className="job-desc mb-2">
            <h1 className="desc-heading">Description</h1>
            <p className="line-gap">{job_description}</p>
          </div>
          <a href={company_website_url}>Visit</a>
          <h1>Skills</h1>
          <ul className="skill-cards-container mb-2">
            {skills.map(item => (
              <li className="skill-card flex-row" key={item.name}>
                <img
                  alt={item.name}
                  src={item.image_url}
                  className="skill-img"
                />
                <p className="ml-1">{item.name}</p>
              </li>
            ))}
          </ul>
          <div>
            <h1>Life at company</h1>
            <div className="life-at-company">
              <p>{life_at_company.description}</p>
              <img
                alt="life at company"
                src={life_at_company.image_url}
                className="ml-1"
              />
            </div>
          </div>
        </li>
        <li>
          <h1 className="mt-3 mb-0">Similar Jobs</h1>
          <ul className="similar-job-items-container">
            {similar_jobs.map(item => (
              <li className="similar-job-item-card" key={item.id}>
                <div className="flex-row mb-2">
                  <img
                    alt="similar job company logo"
                    src={item.company_logo_url}
                    className="company-logo-img"
                  />
                  <div>
                    <h1 className="job-title">{item.title}</h1>
                    <div className="flex-row">
                      <BsStarFill color="#ffff00" size="20" />
                      <p className="bold ml-1">{item.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="job-desc mb-2">
                  <h1 className="desc-heading">Description</h1>
                  <p className="line-gap">{item.job_description}</p>
                </div>
                <div className="flex-row">
                  <div className="flex-row">
                    <div className="flex-row mr-4">
                      <MdLocationOn color="#ffffff" size="20" />
                      <p className="ml-1">{item.location}</p>
                    </div>
                    <div className="flex-row">
                      <BsBriefcaseFill color="#ffffff" size="20" />
                      <p className="ml-1">{item.employment_type}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    )
  }

  renderViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return <FailureView retryMethod={this.getJobDetails} />
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-route-container">
        <Header />
        <div className="job-details-card-wrapper">
          {this.renderViewBasedOnApiStatus()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
