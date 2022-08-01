import {Component} from 'react'
import Loader from 'react-loader-spinner'
import FaqsItem from '../FaqsItem'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class About extends Component {
  state = {faqsList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getFaqs()
  }

  getFaqs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'

    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()

      this.setState({
        faqsList: fetchedData.faq,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" testid="aboutRouteLoader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFaqsListView = () => {
    const {faqsList} = this.state

    return (
      <div className="faq-container">
        <h1 className="about-text">About</h1>
        <ul className="faq-list-container" testid="faqsUnorderedList">
          {faqsList.map(each => (
            <FaqsItem key={each.qno} item={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderFaqsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderFaqsListView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="about-container">
        <Header />
        <div className="questions-container">{this.renderFaqsList()}</div>
        <Footer />
      </div>
    )
  }
}

export default About
