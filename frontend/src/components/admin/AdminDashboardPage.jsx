import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ApiService from '../../services/ApiService'
import { useMessage } from '../common/MessageDisplay'

const AdminDashboardPage = () => {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [bookingsRes, flightsRes, airportsRes] = await Promise.all([
        ApiService.getAllBookings(),
        ApiService.getAllFlights(),
        ApiService.getAllAirports(),
      ])

      setBookings(bookingsRes.data || [])
      setFlights(flightsRes.data || [])
      setAirports(airportsRes.data || [])
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <div className="admin-loading">Loading dashboard...</div>

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-card">
        <ErrorDisplay />
        <SuccessDisplay />

        <h2 className="admin-dashboard-title">Admin Dashboard</h2>

        <div className="admin-dashboard-tabs">
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={activeTab === 'flights' ? 'active' : ''}
            onClick={() => setActiveTab('flights')}
          >
            Flights
          </button>
          <button
            className={activeTab === 'airports' ? 'active' : ''}
            onClick={() => setActiveTab('airports')}
          >
            Airports
          </button>
          <button
            className={activeTab === 'add-flight' ? 'active' : ''}
            onClick={() => navigate('/add-flight')}
          >
            Add New Flight
          </button>
          <button
            className={activeTab === 'add-airport' ? 'active' : ''}
            onClick={() => navigate('/add-airport')}
          >
            Add New Airport
          </button>
        </div>

        <div className="admin-dashboard-content">
          {activeTab === 'bookings' ? (
            <div className="admin-bookings-list">
              <h3>All Bookings</h3>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="admin-booking-card">
                    <div className="admin-booking-header">
                      <div className="admin-booking-ref">
                        Booking #: {booking.bookingReference}
                      </div>
                      <div
                        className={`admin-booking-status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </div>
                    </div>

                    <div className="admin-booking-details">
                      <div className="admin-flight-info">
                        <div className="admin-flight-number">
                          {booking.flight?.flightNumber ||
                            'Flight details not available'}
                        </div>
                        <div className="admin-route">
                          {booking.flight?.departureAirport?.iataCode} →
                          {booking.flight?.arrivalAirport?.iataCode}
                        </div>
                        <div className="admin-date">
                          {booking.flight
                            ? formatDate(booking.flight.departureTime)
                            : 'N/A'}
                        </div>
                      </div>

                      <div className="admin-passengers-info">
                        <div className="admin-passengers-count">
                          {booking.passengers.length} Passenger
                          {booking.passengers.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="admin-booking-actions">
                        <Link
                          to={`/admin/booking/${booking.id}`}
                          className="admin-view-details"
                        >
                          View/Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-no-data">
                  <p>No bookings found</p>
                </div>
              )}
            </div>
          ) : activeTab === 'flights' ? (
            <div className="admin-flights-list">
              <h3>All Flights</h3>
              {flights.length > 0 ? (
                flights.map((flight) => (
                  <div key={flight.id} className="admin-flight-card">
                    <div className="admin-flight-header">
                      <div className="admin-flight-number">
                        {flight.flightNumber}
                      </div>
                      <div
                        className={`admin-flight-status ${flight.status.toLowerCase()}`}
                      >
                        {flight.status}
                      </div>
                    </div>

                    <div className="admin-flight-details">
                      <div className="admin-route">
                        <span className="admin-departure">
                          {flight.departureAirport?.iataCode} (
                          {flight.departureAirport?.city})
                        </span>
                        <span>→</span>
                        <span className="admin-arrival">
                          {flight.arrivalAirport?.iataCode} (
                          {flight.arrivalAirport?.city})
                        </span>
                      </div>

                      <div className="admin-times">
                        <div className="admin-departure-time">
                          {formatDate(flight.departureTime)}
                        </div>
                        <div className="admin-arrival-time">
                          {formatDate(flight.arrivalTime)}
                        </div>
                      </div>

                      <div className="admin-flight-actions">
                        <Link
                          to={`/admin/flight/${flight.id}`}
                          className="admin-manage-flight"
                        >
                          Manage Flight
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-no-data">
                  <p>No flights found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="admin-airports-list">
              <h3>All Airports</h3>
              {airports.length > 0 ? (
                <div className="airports-grid">
                  {airports.map((airport) => (
                    <div key={airport.id} className="admin-airport-card">
                      <div className="airport-header">
                        <h4>{airport.name}</h4>
                        <span className="iata-code">{airport.iataCode}</span>
                      </div>
                      <div className="airport-details">
                        <div>
                          <span className="detail-label">City:</span>
                          <span>{airport.city}</span>
                        </div>
                        <div>
                          <span className="detail-label">Country:</span>
                          <span>{airport.country.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                      <div className="airport-actions">
                        <button
                          onClick={() =>
                            navigate(`/edit-airport/${airport.id}`)
                          }
                          className="edit-button"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-no-data">
                  <p>No airports found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
