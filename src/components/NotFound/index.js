import './index.css'

const NotFound = props => {
  const navigate = () => {
    const {history} = props
    history.replace('/')
  }
  return (
    <div className="notFound-container">
      <img
        src="https://res.cloudinary.com/dtkberly2/image/upload/v1658896605/samples/Group_7484not_found_nbvwb8.png"
        alt="not-found-pic"
        className="notFound-image"
      />
      <h1 className="notFound-head">PAGE NOT FOUND</h1>
      <p className="notFound-description">
        we are sorry, the page you requested could not be found
        <br />
        Please go back to the homepage
      </p>
      <button type="button" className="notFound-button" onClick={navigate}>
        Home
      </button>
    </div>
  )
}

export default NotFound
