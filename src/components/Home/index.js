import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import {BsSearch} from 'react-icons/bs'
import TableItem from '../TableItem'
import SearchList from '../SearchList'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

class Home extends Component {
  state = {
    ascending: true,
    casesList: [],
    searchIn: '',
    activateSearch: false,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCasesList()
  }

  getCasesList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'

    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const resultList = []
      const stateNamesList = []
      statesList.forEach(each => {
        stateNamesList.push(each.state_name)
      })
      const sortedNames = stateNamesList.sort()

      const stateKeys = sortedNames.map(each => {
        const value = statesList.filter(item => item.state_name === each)
        return value[0].state_code
      })

      stateKeys.forEach(keyName => {
        const {total} = data[keyName]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        resultList.push({
          stateCode: keyName,
          name: statesList.find(state => state.state_code === keyName)
            .state_name,
          confirmed,
          deceased,
          recovered,
          tested,
          population,
          active: confirmed - (deceased + recovered),
        })
      })
      this.setState({
        casesList: resultList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="home-loader-container" testid="homeRouteLoader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  updateSearch = event => {
    this.setState({searchIn: event.target.value, activateSearch: true})
  }

  orderByAsc = () => {
    const {ascending, casesList} = this.state
    if (ascending === false) {
      this.setState({casesList: casesList.reverse(), ascending: true})
    }
  }

  orderByDsc = () => {
    const {ascending, casesList} = this.state
    if (ascending) {
      this.setState({casesList: casesList.reverse(), ascending: false})
    }
  }

  renderListView = () => {
    const {casesList, searchIn, activateSearch} = this.state
    const searchList = casesList.filter(each =>
      each.name.toLowerCase().startsWith(searchIn.toLowerCase()),
    )
    let searchView

    if (activateSearch && searchIn.length !== 0) {
      searchView = (
        <ul
          className="search-list-container"
          testid="searchResultsUnorderedList"
        >
          {searchList.map(each => (
            <SearchList key={each.stateCode} item={each} />
          ))}
        </ul>
      )
    } else {
      searchView = null
    }

    let confirmedCases = 0
    let activeCases = 0
    let deceasedCases = 0
    let recoveredCases = 0
    casesList.forEach(each => {
      confirmedCases += each.confirmed
    })
    casesList.forEach(each => {
      activeCases += each.active
    })
    casesList.forEach(each => {
      deceasedCases += each.deceased
    })
    casesList.forEach(each => {
      recoveredCases += each.recovered
    })

    return (
      <div className="home-content-container">
        <div className="search-container">
          <div className="search">
            <BsSearch className="home-search-icon" />
            <input
              type="search"
              value={searchIn}
              onChange={this.updateSearch}
              placeholder="Enter the State"
              className="home-input"
            />
          </div>

          {searchView}
        </div>

        <div className="home-icons">
          <div
            testid="countryWideConfirmedCases"
            className="home-icons-container"
          >
            <p className="confirmed-text">Confirmed</p>
            <img
              src="https://res.cloudinary.com/dtkberly2/image/upload/v1658988067/samples/Group_kkazls.svg"
              alt="country wide confirmed cases pic"
            />
            <p className="confirmed-text">{confirmedCases}</p>
          </div>
          <div testid="countryWideActiveCases" className="home-icons-container">
            <p className="active-text">Active</p>
            <img
              src="https://res.cloudinary.com/dtkberly2/image/upload/v1658990028/samples/protection_1_est2jv.svg"
              alt="country wide active cases pic"
            />
            <p className="active-text">{activeCases}</p>
          </div>
          <div
            testid="countryWideRecoveredCases"
            className="home-icons-container"
          >
            <p className="recovered-text">Recovered</p>
            <img
              src="https://res.cloudinary.com/dtkberly2/image/upload/v1658990098/samples/recovered_1_sn7280.svg"
              alt="country wide recovered cases pic"
            />
            <p className="recovered-text">{recoveredCases}</p>
          </div>
          <div
            testid="countryWideDeceasedCases"
            className="home-icons-container"
          >
            <p className="deceased-text">Deceased</p>
            <img
              src="https://res.cloudinary.com/dtkberly2/image/upload/v1658990198/samples/breathing_1_rownx1.svg"
              alt="country wide deceased cases pic"
            />
            <p className="deceased-text">{deceasedCases}</p>
          </div>
        </div>
        <div testid="stateWiseCovidDataTable">
          <ul className="home-list-container">
            <li className="list-item">
              <div className="state-name">
                <p>States/UT</p>
                <button
                  type="button"
                  onClick={this.orderByAsc}
                  testid="ascendingSort"
                  className="sorting-button"
                >
                  <FcGenericSortingAsc className="order-icon" />
                </button>
                <button
                  type="button"
                  onClick={this.orderByDsc}
                  testid="descendingSort"
                  className="sorting-button"
                >
                  <FcGenericSortingDesc className="order-icon" />
                </button>
              </div>
              <p className="cases">Confirmed</p>
              <p className="cases">Active</p>
              <p className="cases">Recovered</p>
              <p className="cases">Deceased</p>
              <p className="cases">Population</p>
            </li>
            <li>
              <hr className="home-line" />
            </li>
            {casesList.map(each => (
              <TableItem key={each.stateCode} item={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        {this.renderView()}
        <Footer />
      </div>
    )
  }
}
export default Home
