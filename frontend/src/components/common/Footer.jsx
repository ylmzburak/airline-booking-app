import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">Yilmaz Airline</h3>
          <p className="footer-text">
            Your trusted partner for comfortable and safe air travel.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link className="footer-link" to="/flights">
                Book Flight
              </Link>
            </li>
            <li>
              <Link className="footer-link" to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li>
              <Link className="footer-link" to="/terms">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link className="footer-link" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="footer-link" to="/faq">
                FAQs
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Yilmaz Airline. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
export default Footer
