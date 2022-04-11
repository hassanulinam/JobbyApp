import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import FailureView from '../FailureView'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
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
    this.accessToken = Cookies.get('jwt_token')
    this.fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    }
    this.getJobsData()
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({profileFetchStatus: apiStatusConstants.inProgress})
    const URL = 'https://apis.ccbp.in/profile'
    const response = await fetch(URL, this.fetchOptions)
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
    queryParams.push(`employment_type=${jobTypes.join(',')}`)
    queryParams.push(`minimum_package=${salaryRange}`)
    queryParams.push(`search=${searchKey}`)

    const URL = `https://apis.ccbp.in/jobs?${queryParams.join('&')}`
    console.log('Fetching jobs data ::', URL)

    const response = await fetch(URL, this.fetchOptions)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobsData: data.jobs,
        apiStatus: apiStatusConstants.success,
      })
      console.log(`Successfully fetched ${data.total} items...`)
    } else this.setState({apiStatus: apiStatusConstants.failure})
  }

  addOrRemoveJobTypeFilters = event => {
    const {id} = event.target
    console.log(id)
    const {jobTypes} = this.state
    if (jobTypes.includes(id)) {
      const filteredJobTypes = jobTypes.filter(jobId => jobId !== id)
      this.setState({jobTypes: filteredJobTypes}, this.getJobsData)
    } else this.setState({jobTypes: [...jobTypes, id]}, this.getJobsData)
  }

  changeSalaryRangeFilter = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsData)
  }

  changeSearchInput = event => {
    this.setState({searchKey: event.target.value})
  }

  renderJobTypeFilters = () => {
    const {jobTypesList} = this.props
    return (
      <ul>
        {jobTypesList.map(item => (
          <li className="filter-input-container" key={item.employmentTypeId}>
            <input
              type="checkbox"
              id={item.employmentTypeId}
              onChange={this.addOrRemoveJobTypeFilters}
            />
            <label htmlFor={item.employmentTypeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderSalaryRangeFilters = () => {
    const {salaryRangesList} = this.props
    return (
      <ul>
        {salaryRangesList.map(item => (
          <li className="filter-input-container" key={item.salaryRangeId}>
            <input
              type="radio"
              id={item.salaryRangeId}
              value={item.salaryRangeId}
              name="salaryRange"
              onChange={this.changeSalaryRangeFilter}
            />
            <label htmlFor={item.salaryRangeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="80" width="80" />
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
          className="search-input"
        />
        <button
          type="button"
          testid="searchButton"
          onClick={this.getJobsData}
          className="search-btn"
        >
          <BsSearch className="search-icon" color="#ffffff" size="20" />
        </button>
      </div>
    )
  }

  renderJobResultsView = () => {
    const {jobsData} = this.state
    if (jobsData.length > 0)
      return (
        <ul className="job-cards-container">
          {jobsData.map(item => (
            <JobItem key={item.id} details={item} />
          ))}
        </ul>
      )
    return (
      <di className="no-jobs-view-card">
        <img
          alt="no jobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any Jobs. Try other filters.</p>
      </di>
    )
  }

  renderResultsViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobResultsView()
      case apiStatusConstants.failure:
        return <FailureView retryMethod={this.getJobsData} />
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-view-wrapper">{this.renderLoadingView()}</div>
        )
      default:
        return null
    }
  }

  renderProfileCard = () => {
    const {profileData, profileFetchStatus} = this.state

    switch (profileFetchStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile-card-wrapper">
            <div className="profile-card-container">
              <img
                src={profileData.profileImageUrl}
                alt="profile"
                className="profile-img"
              />
              <h1 className="profile-heading">{profileData.name}</h1>
              <p className="profile-text">{profileData.shortBio}</p>
            </div>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="profile-card-wrapper">
            <button
              type="button"
              className="retry-btn"
              onClick={this.getProfileData}
            >
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.inProgress:
        return (
          <div className="profile-card-wrapper">{this.renderLoadingView()}</div>
        )
      default:
        return null
    }
  }

  renderProfileAndFiltersContainer = () => (
    <div className="profile-and-filters-container mb-2">
      {this.renderProfileCard()}
      <hr />
      <div className="jobs-filters-container">
        <h1 className="filters-heading">Type of Employment</h1>
        {this.renderJobTypeFilters()}
      </div>
      <hr />
      <div className="salary-range-filters-container">
        <h1 className="filters-heading">Salary Range</h1>
        {this.renderSalaryRangeFilters()}
      </div>
    </div>
  )

  render() {
    return (
      <div className="jobs-route-container">
        <Header />
        <div className="jobs-route-contents">
          {this.renderProfileAndFiltersContainer()}
          <div className="jobs-page-container">
            <div className="job-results-container">
              <div>{this.renderSearchBar()}</div>
              {this.renderResultsViewBasedOnApiStatus()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
