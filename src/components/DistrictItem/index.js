import './index.css'

const DistrictItem = props => {
  const {item} = props
  const {districtName, count} = item
  return (
    <li className="district-list-item">
      <p className="district-text"> {count}</p>
      <p className="district-text">{districtName}</p>
    </li>
  )
}

export default DistrictItem
