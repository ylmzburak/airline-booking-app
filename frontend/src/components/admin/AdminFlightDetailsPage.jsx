import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ApiService from '../../services/ApiService'
import { useMessage } from '../common/MessageDisplay'

const AdminFlightDetailsPage = () => {
  const { id } = useParams()

  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage()
  const navigate = useNavigate()
  const [flight, setFlight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchFlightDetails()
  }, [id])

  const fetchFlightDetails = async () => {
    try {
      const [flightRes, bookingsRes] = await Promise.all([
        ApiService.getFlightById(id),
        ApiService.getAllBookings(),
      ])
      setFlight(flightRes.data)
      setSelectedStatus(flightRes.data.status)
      // Filter bookings for this flight
      setBookings(bookingsRes.data.filter((b) => b.flight?.id === parseInt(id)))
    } catch (error) {
      showError(
        error.response?.data?.message || 'Failed to fetch flight details',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    try {
      const resp = await ApiService.updateFlight({
        id: flight.id,
        status: selectedStatus,
      })

      if (resp.statusCode === 200) {
        showSuccess('Flight status updated successfully!')
        fetchFlightDetails()
      }
    } catch (error) {
      showError(
        error.response?.data?.message || 'Failed to update flight status',
      )
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

  if (loading)
    return <div className="admin-flight-loading">Loading flight details...</div>
  if (!flight) return <div className="admin-flight-error">Flight not found</div>

  return (
    <div className="admin-flight-container">
      <div className="admin-flight-card">
        <ErrorDisplay />
        <SuccessDisplay />

        <h2 className="admin-flight-title">Flight Management</h2>

        <div className="admin-flight-summary">
          <div className="admin-flight-info">
            <div className="admin-flight-number">
              Flight: {flight.flightNumber}
            </div>
            <div
              className={`admin-flight-status ${flight.status.toLowerCase()}`}
            >
              Current Status: {flight.status}
            </div>
          </div>

          <div className="admin-route-info">
            <div className="admin-route">
              {flight.departureAirport?.iataCode} →{' '}
              {flight.arrivalAirport?.iataCode}
            </div>
            <div className="admin-times">
              <div className="admin-departure-time">
                Departure: {formatDate(flight.departureTime)}
              </div>
              <div className="admin-arrival-time">
                Arrival: {formatDate(flight.arrivalTime)}
              </div>
            </div>
          </div>

          <div className="admin-flight-details">
            <div className="admin-info-row">
              <span className="admin-label">Departure Airport:</span>
              <span className="admin-value">
                {flight.departureAirport?.name} (
                {flight.departureAirport?.iataCode})
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-label">Arrival Airport:</span>
              <span className="admin-value">
                {flight.arrivalAirport?.name} ({flight.arrivalAirport?.iataCode}
                )
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-label">Base Price:</span>
              <span className="admin-value">
                ${flight.basePrice?.toFixed(2)}
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-label">Assigned Pilot:</span>
              <span className="admin-value">{flight.assignedPilot?.name}</span>
            </div>
          </div>
        </div>

        <div className="admin-flight-management">
          <h3>Update Flight Status</h3>
          <div className="admin-status-selector">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="admin-status-select"
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="DEPARTED">DEPARTED</option>
              <option value="ARRIVED">ARRIVED</option>
            </select>
            <button
              onClick={handleStatusChange}
              className="admin-update-button"
              disabled={selectedStatus === flight.status}
            >
              Update Status
            </button>
          </div>
        </div>

        <div className="admin-flight-bookings">
          <h3>Associated Bookings ({bookings.length})</h3>
          {bookings.length > 0 ? (
            <div className="admin-bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="admin-booking-item">
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
                    <div className="admin-passengers-count">
                      {booking.passengers.length} Passenger
                      {booking.passengers.length !== 1 ? 's' : ''}
                    </div>
                    <Link
                      to={`/admin/booking/${booking.id}`}
                      className="admin-view-booking"
                    >
                      View Booking
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-no-bookings">No bookings for this flight</div>
          )}
        </div>

        <div className="admin-flight-actions">
          <button onClick={() => navigate(-1)} className="admin-back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
export default AdminFlightDetailsPage
