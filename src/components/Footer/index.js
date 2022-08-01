import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'
import './index.css'

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <h1 className="footer-logo">
          COVID19<span className="footer-span">INDIA</span>
        </h1>
        <p className="footer-description">
          we stand with everyone fighting on the front lines
        </p>
        <div className="footer-icons-container">
          <VscGithubAlt className="footer-icon" />
          <FiInstagram className="footer-icon" />
          <FaTwitter className="footer-icon" />
        </div>
      </div>
    </div>
  )
}
