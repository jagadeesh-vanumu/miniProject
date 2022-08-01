import {BiChevronRightSquare} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import './index.css'

const SearchList = props => {
  const {item} = props
  const {name, stateCode} = item

  return (
    <li>
      <Link to={`/state/${stateCode}`} className="search-Link-container">
        <p>{name}</p>
        <div className="code-container">
          <p>{stateCode}</p>
          <BiChevronRightSquare />
        </div>
      </Link>
      <hr className="search-line" />
    </li>
  )
}

export default SearchList
