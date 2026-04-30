import { useNavigate, Link } from 'react-router-dom'
import ApiService from '../../services/ApiService'

const Navbar = () => {
  const isAuthenticated = ApiService.isAthenticated()
  const isAdmin = ApiService.isAdmin()
  const isPilot = ApiService.isPilot()
  const isCustomer = ApiService.isCustomer()

  const navigate = useNavigate()

  const handleLogout = () => {
    const isLogout = window.confirm('Are you sure you want to logout? ')
    if (isLogout) {
      ApiService.logout()
      navigate('/login')
    }
  }

  return (
    <nav className="nb">
      <div className="nb-container">
        <div className="nb-brand">
          <Link to="/home" className="ng-logo">
            <span className="logo-airline">Yilmaz</span>
            <span className="logo-text">Airlines</span>
          </Link>
        </div>

        <div className="nb-links">
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/flights" className="nav-link">
            Find Flights
          </Link>

          {isAuthenticated ? (
            <>
              {isCustomer && (
                <>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </>
              )}
              {isPilot && (
                <Link to="/admin" className="nav-link">
                  Pilot
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}

              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-button nav-button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
