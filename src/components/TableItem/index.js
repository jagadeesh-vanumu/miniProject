import './index.css'

const TableItem = props => {
  const {item} = props
  const {
    name,
    confirmed,
    deceased,
    recovered,

    population,
    active,
  } = item

  return (
    <li className="list-item">
      <p className="state-name">{name}</p>
      <p className="cases confirmed-text">{confirmed}</p>
      <p className="cases active-text">{active}</p>
      <p className="cases recovered-text">{recovered}</p>
      <p className="cases deceased-text">{deceased}</p>
      <p className="cases population-text">{population}</p>
    </li>
  )
}

export default TableItem
