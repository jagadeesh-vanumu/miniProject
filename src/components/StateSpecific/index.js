import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
} from 'recharts'
import Header from '../Header'
import Footer from '../Footer'
import DistrictItem from '../DistrictItem'
import './index.css'

const specificStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

const caseStatusConstants = {
  confirmed: 'CONFIRMED',
  active: 'ACTIVE',
  recovered: 'RECOVERED',
  deceased: 'DECEASED',
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

const graphStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class StateSpecific extends Component {
  state = {
    stateDetails: [],
    graphDetails: [],
    specificStatus: specificStatusConstants.initial,
    graphStatus: graphStatusConstants.initial,
    caseStatus: caseStatusConstants.confirmed,
  }

  componentDidMount = () => {
    this.getDetails()
    this.getGraphs()
  }

  getDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params

    this.setState({
      specificStatus: specificStatusConstants.inProgress,
    })

    const stateUrl = 'https://apis.ccbp.in/covid19-state-wise-data'

    const options = {
      method: 'GET',
    }

    const response = await fetch(stateUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const resultList = []

      const key = statesList.find(each => each.state_code === stateCode)
      const keyName = key.state_code
      const {total, districts} = data[keyName]
      const confirmed = total.confirmed ? total.confirmed : 0
      const deceased = total.deceased ? total.deceased : 0
      const recovered = total.recovered ? total.recovered : 0
      const tested = total.tested ? total.tested : 0
      const population = data[keyName].meta.population
        ? data[keyName].meta.population
        : 0
      resultList.push({
        stateCode: keyName,
        name: key.state_name,
        districts,
        confirmed,
        deceased,
        recovered,
        tested,
        population,
        active: confirmed - (deceased + recovered),
      })

      this.setState({
        stateDetails: resultList,
        specificStatus: specificStatusConstants.success,
      })
    }
  }

  getGraphs = async () => {
    this.setState({graphStatus: graphStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const apiUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const options = {
      method: 'GET',
    }
    const responseData = await fetch(apiUrl, options)
    if (responseData.ok === true) {
      const graphData = await responseData.json()

      const data = graphData[stateCode].dates

      const keys = Object.keys(data)

      const confirmedData = []
      const activeData = []
      const testedData = []
      const recoveredData = []
      const deceasedData = []
      const completeData = []
      keys.forEach(keyName => {
        const {total} = data[keyName]

        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const active = confirmed - (deceased + recovered)

        confirmedData.push({
          date: keyName,
          count: confirmed,
        })

        activeData.push({date: keyName, count: active})

        testedData.push({date: keyName, count: tested})

        recoveredData.push({date: keyName, count: recovered})

        deceasedData.push({date: keyName, count: deceased})
      })

      completeData.push(
        {activeData},
        {testedData},
        {recoveredData},
        {confirmedData},
        {deceasedData},
      )

      this.setState({
        graphStatus: graphStatusConstants.success,
        graphDetails: completeData,
      })
    }
  }

  renderLoadingView = () => (
    <div className="home-loader-container" testid="stateDetailsLoader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  changeConfirmed = () => {
    this.setState({caseStatus: caseStatusConstants.confirmed})
  }

  changeActive = () => {
    this.setState({caseStatus: caseStatusConstants.active})
  }

  changeRecovered = () => {
    this.setState({caseStatus: caseStatusConstants.recovered})
  }

  changeDeceased = () => {
    this.setState({caseStatus: caseStatusConstants.deceased})
  }

  renderStateView = () => {
    const {stateDetails, caseStatus} = this.state
    const {
      name,
      confirmed,
      deceased,
      recovered,
      tested,
      districts,
      active,
    } = stateDetails[0]

    const districtList = []
    const districtKeys = Object.keys(districts)

    districtKeys.forEach(keyName => {
      const {total} = districts[keyName]
      const confirmedCases = total.confirmed ? total.confirmed : 0
      const deceasedCases = total.deceased ? total.deceased : 0
      const recoveredCases = total.recovered ? total.recovered : 0

      districtList.push({
        name: keyName,
        confirmedCases,
        deceasedCases,
        recoveredCases,

        activeCases: confirmed - (deceased + recovered),
      })
    })
    let value
    let color
    let activeIcon = ''
    let confirmedIcon = ''
    let recoveredIcon = ''
    let deceasedIcon = ''
    switch (caseStatus) {
      case caseStatusConstants.active:
        value = 'activeCases'
        color = 'active-color'
        activeIcon = 'active-icon'
        break
      case caseStatusConstants.confirmed:
        value = 'confirmedCases'
        color = 'confirmed-color'
        confirmedIcon = 'confirmed-icon'
        break
      case caseStatusConstants.recovered:
        value = 'recoveredCases'
        color = 'recovered-color'
        recoveredIcon = 'recovered-icon'
        break
      case caseStatusConstants.deceased:
        value = 'deceasedCases'
        color = 'deceased-color'
        deceasedIcon = 'deceased-icon'
        break
      default:
        value = null
        break
    }

    const updatedCasesList = districtList.map(each => ({
      districtName: each.name,
      count: each[value],
    }))
    const sortedCasesList = updatedCasesList.sort((a, b) =>
      a.count > b.count ? -1 : 1,
    )

    return (
      <div>
        <div className="specific-container">
          <div className="state-container">
            <h1 className="state-text">{name}</h1>
            <div className="text-color">
              <p>Tested</p>
              <p>{tested}</p>
            </div>
          </div>
        </div>
        <div className="home-icons icon-container">
          <div
            testid="stateSpecificConfirmedCasesContainer"
            className="home-icons-container"
          >
            <button
              type="button"
              onClick={this.changeConfirmed}
              className={`icon-button ${confirmedIcon}`}
            >
              <p className="confirmed-text">Confirmed</p>
              <img
                src="https://res.cloudinary.com/dtkberly2/image/upload/v1658988067/samples/Group_kkazls.svg"
                alt="state specific confirmed cases pic"
              />
              <p className="confirmed-text">{confirmed}</p>
            </button>
          </div>
          <div
            testid="stateSpecificActiveCases"
            className="home-icons-container"
          >
            <button
              type="button"
              onClick={this.changeActive}
              className={`icon-button ${activeIcon}`}
            >
              <p className="active-text">Active</p>
              <img
                src="https://res.cloudinary.com/dtkberly2/image/upload/v1658990028/samples/protection_1_est2jv.svg"
                alt="state specific active cases pic"
              />
              <p className="active-text">{active}</p>
            </button>
          </div>
          <div
            testid="stateSpecificRecoveredCases"
            className="home-icons-container"
          >
            <button
              type="button"
              onClick={this.changeRecovered}
              className={`icon-button ${recoveredIcon}`}
            >
              <p className="recovered-text">Recovered</p>
              <img
                src="https://res.cloudinary.com/dtkberly2/image/upload/v1658990098/samples/recovered_1_sn7280.svg"
                alt="state specific recovered cases pic"
              />
              <p className="recovered-text">{recovered}</p>
            </button>
          </div>
          <div
            testid="stateSpecificDeceasedCases"
            className="home-icons-container"
          >
            <button
              type="button"
              onClick={this.changeDeceased}
              className={`icon-button ${deceasedIcon}`}
            >
              <p className="deceased-text">Deceased</p>
              <img
                src="https://res.cloudinary.com/dtkberly2/image/upload/v1658990198/samples/breathing_1_rownx1.svg"
                alt="state specific deceased cases pic"
              />
              <p className="deceased-text">{deceased}</p>
            </button>
          </div>
        </div>
        <div>
          <div className="line-graphs-container">
            <div className={`top-district ${color}`}>
              <h1>Top Districts</h1>
              <ul
                testid="topDistrictsUnorderedList"
                className="district-list-container"
              >
                {sortedCasesList.map(each => (
                  <DistrictItem key={each.districtName} item={each} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  graphLoadingView = () => (
    <div className="home-loader-container" testid="timelinesDataLoader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  graphSuccessView = () => {
    const {graphDetails, caseStatus} = this.state
    const {confirmedData} = graphDetails[3]
    const {activeData} = graphDetails[0]
    const {recoveredData} = graphDetails[2]
    const {deceasedData} = graphDetails[4]
    const {testedData} = graphDetails[1]

    let data
    let color
    switch (caseStatus) {
      case caseStatusConstants.active:
        data = activeData.slice(40, 50)
        color = '#007BFF'
        break
      case caseStatusConstants.confirmed:
        data = confirmedData.slice(40, 50)
        color = '#FF073A'
        break
      case caseStatusConstants.recovered:
        data = recoveredData.slice(40, 50)
        color = '#27A243'
        break
      case caseStatusConstants.deceased:
        data = deceasedData.slice(40, 50)
        color = '#6C757D'
        break

      default:
        data = null
        break
    }

    return (
      <div>
        <div>
          <div className="line-graphs-container">
            <div className="graph-container">
              <h1>Bar Chart</h1>
              <div>
                <BarChart width={800} height={450} data={data}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill={color}
                    className="bar"
                    label={{position: 'top', color: 'white'}}
                  />
                </BarChart>
              </div>
            </div>
          </div>
          <div className="line-graphs-container">
            <div className="graph-container">
              <h1>Daily Spread Sheets</h1>
              <div className="confirmed-graph">
                <div className="graphs">
                  <LineChart
                    width={730}
                    height={250}
                    data={confirmedData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#FF073A" />
                  </LineChart>
                  <p className="confirmed-color">Confirmed</p>
                </div>
              </div>
              <div className="active-graph">
                <div className="graphs">
                  <LineChart
                    width={730}
                    height={250}
                    data={activeData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#007BFF" />
                  </LineChart>
                  <p className="active-color">Active</p>
                </div>
              </div>
              <div className="recovered-graph">
                <div className="graphs">
                  <LineChart
                    width={730}
                    height={250}
                    data={recoveredData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#27A243" />
                  </LineChart>
                  <p className="recovered-color">Recovered</p>
                </div>
              </div>
              <div className="deceased-graph">
                <div className="graphs">
                  <LineChart
                    width={730}
                    height={250}
                    data={deceasedData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#6C757D" />
                  </LineChart>
                  <p className="deceased-color">Deceased</p>
                </div>
              </div>
              <div className="tested-graph">
                <div className="graphs">
                  <LineChart
                    width={730}
                    height={250}
                    data={testedData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#9673B9" />
                  </LineChart>
                  <p className="tested-color">Tested</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  graphsView = () => {
    const {graphStatus} = this.state

    switch (graphStatus) {
      case graphStatusConstants.success:
        return this.graphSuccessView()
      case graphStatusConstants.inProgress:
        return this.graphLoadingView()
      default:
        return null
    }
  }

  renderView = () => {
    const {specificStatus} = this.state

    switch (specificStatus) {
      case specificStatusConstants.success:
        return this.renderStateView()
      case specificStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="state-specific-container">
        <Header />
        {this.renderView()}
        {this.graphsView()}
        <Footer />
      </div>
    )
  }
}
export default StateSpecific
