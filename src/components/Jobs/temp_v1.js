import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}
const accessToken = Cookies.get('jwt_token')
const fetchOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsData: [],
    jobTypes: [],
    salaryRange: '',
    searchKey: '',
    profileFetchStatus: apiStatusConstants.initial,
    profileData: '',
  }

  componentDidMount() {
    this.getJobsData()
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({profileFetchStatus: apiStatusConstants.inProgress})
    const URL = 'https://apis.ccbp.in/profile'
    const response = await fetch(URL, fetchOptions)
    if (response.ok) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData,
        profileFetchStatus: apiStatusConstants.success,
      })
    } else this.setState({profileFetchStatus: apiStatusConstants.failure})
  }

  getJobsData = async () => {
    const {jobTypes, salaryRange, searchKey} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const queryParams = []
    if (jobTypes.length > 0)
      queryParams.push(`employment_type=${jobTypes.join(',')}`)
    if (salaryRange.length > 0)
      queryParams.push(`minimum_package=${salaryRange}`)
    if (searchKey.length > 0) queryParams.push(`search=${searchKey}`)

    const URL = `https://apis.ccbp.in/jobs?${queryParams.join('&')}`
    console.log(jobTypes, queryParams)
    console.log('Fetching jobs data ::', URL)

    const response = await fetch(URL, fetchOptions)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobsData: data.jobs,
        apiStatus: apiStatusConstants.success,
      })
      console.log(`Successfully fetched ${data.total} items...`)
    } else this.setState({apiStatus: apiStatusConstants.failure})
  }

  addOrRemoveJobTypeFilters = async event => {
    const {id} = event.target
    console.log(id)
    const {jobTypes} = this.state
    if (jobTypes.includes(id)) {
      const filteredJobTypes = jobTypes.filter(jobId => jobId !== id)
      await this.setState({jobTypes: filteredJobTypes})
    } else await this.setState({jobTypes: [...jobTypes, id]})
    this.getJobsData()
  }

  changeSalaryRangeFilter = async event => {
    await this.setState({salaryRange: event.target.value})
    this.getJobsData()
  }

  changeSearchInput = event => {
    this.setState({searchKey: event.target.value})
  }

  renderJobTypeFilters = () => {
    const {jobTypesList} = this.props
    return (
      <>
        {jobTypesList.map(item => (
          <div className="job-type-input" key={item.employmentTypeId}>
            <input
              type="checkbox"
              id={item.employmentTypeId}
              onChange={this.addOrRemoveJobTypeFilters}
            />
            <label htmlFor={item.employmentTypeId}>{item.label}</label>
          </div>
        ))}
      </>
    )
  }

  renderSalaryRangeFilters = () => {
    const {salaryRangesList} = this.props
    return (
      <>
        {salaryRangesList.map(item => (
          <div className="salary-range-input" key={item.salaryRangeId}>
            <input
              type="radio"
              id={item.salaryRangeId}
              value={item.salaryRangeId}
              name="salaryRange"
              onChange={this.changeSalaryRangeFilter}
            />
            <label htmlFor={item.salaryRangeId}>{item.label}</label>
          </div>
        ))}
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderSearchBar = () => {
    const {searchKey} = this.state
    return (
      <div className="search-bar-container">
        <input
          type="search"
          value={searchKey}
          placeholder="Search"
          onChange={this.changeSearchInput}
        />
        <button type="button" testid="searchButton">
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobResultsView = () => {
    const {jobsData} = this.state
    return (
      <div className="job-cards-container">
        {jobsData.map(item => (
          <JobItem key={item.id} details={item} />
        ))}
      </div>
    )
  }

  renderResultsViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobResultsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileCard = () => {
    const {profileData, profileFetchStatus} = this.state

    switch (profileFetchStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile-card-container">
            <img
              src={profileData.profileImageUrl}
              alt="profile"
              className="profile-img"
            />
            <h1 className="profile-heading">{profileData.name}</h1>
            <p className="profile-text">{profileData.shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <button
            type="button"
            className="retry-btn"
            onClick={this.getProfileData}
          >
            Retry
          </button>
        )
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileAndFiltersContainer = () => (
    <div className="profile-and-filters-container">
      {this.renderProfileCard()}
      <hr />
      <div className="jobs-filters-container">
        <h1>Types of Employment</h1>
        {this.renderJobTypeFilters()}
      </div>
      <hr />
      <div className="salary-range-filters-container">
        <h1>Salary Range</h1>
        {this.renderSalaryRangeFilters()}
      </div>
    </div>
  )

  render() {
    return (
      <div className="jobs-route-container">
        <Header />
        {this.renderProfileAndFiltersContainer()}
        <div className="jobs-page-container">
          <div className="job-results-container">
            {this.renderSearchBar()}
            {this.renderResultsViewBasedOnApiStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
