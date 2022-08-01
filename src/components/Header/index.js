import {Link} from 'react-router-dom'
import './index.css'

export default function Header() {
  return (
    <nav className="nav-header-container">
      <div className="header-container">
        <div>
          <h1>
            <Link to="/" className="logo-head">
              COVID19<span className="logo-span">INDIA</span>
            </Link>
          </h1>
        </div>
        <ul className="header-links">
          <li className="nav-menu-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          <li className="nav-menu-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
