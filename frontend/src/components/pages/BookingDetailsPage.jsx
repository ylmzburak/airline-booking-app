import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ApiService from '../../services/ApiService'
import { useMessage } from '../common/MessageDisplay'

const BookingDetailsPage = () => {
  const { id } = useParams()
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  const fetchBookingDetails = async () => {
    try {
      const response = await ApiService.getBookingById(id)
      setBooking(response.data)
    } catch (error) {
      showError(
        error.response?.data?.message || 'Failed to fetch booking details',
      )
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

  const calculateTotalPrice = () => {
    if (!booking || !booking.flight) return 0
    return booking.passengers.reduce((total, passenger) => {
      let price = booking.flight.basePrice
      if (passenger.type === 'CHILD') {
        price *= 0.75 // 25% discount for children
      } else if (passenger.type === 'INFANT') {
        price *= 0.1 // 90% discount for infants
      }
      return total + price
    }, 0)
  }

  if (loading)
    return (
      <div className="booking-details-loading">Loading booking details...</div>
    )
  if (!booking)
    return <div className="booking-details-error">Booking not found</div>

  return (
    <div className="booking-details-container">
      <div className="booking-details-card">
        <ErrorDisplay />
        <SuccessDisplay />

        <h2 className="booking-details-title">Booking Details</h2>

        <div className="booking-details-summary">
          <div className="booking-details-flight-info">
            <div className="booking-details-flight-number">
              Flight: {booking.flight?.flightNumber || 'N/A'}
            </div>
            <div className="booking-details-route">
              <span className="booking-details-departure">
                {booking.flight?.departureAirport?.iataCode} →{' '}
                {booking.flight?.arrivalAirport?.iataCode}
              </span>
              <span className="booking-details-date">
                {formatDate(booking.flight?.departureTime)}
              </span>
            </div>
          </div>
          <div className="booking-details-price">
            ${calculateTotalPrice().toFixed(2)}
          </div>
        </div>

        <div className="booking-details-info-section">
          <div className="booking-details-info-card">
            <h3 className="booking-details-subtitle">Booking Information</h3>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Reference Number:</span>
              <span className="booking-details-value">
                {booking.bookingReference}
              </span>
            </div>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Booking Date:</span>
              <span className="booking-details-value">
                {formatDate(booking.bookingDate)}
              </span>
            </div>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Status:</span>
              <span
                className={`booking-details-value booking-details-status-${booking.status.toLowerCase()}`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          <div className="booking-details-flight-card">
            <h3 className="booking-details-subtitle">Flight Details</h3>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Departure:</span>
              <span className="booking-details-value">
                {booking.flight?.departureAirport?.name} (
                {booking.flight?.departureAirport?.iataCode})
              </span>
            </div>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Departure Time:</span>
              <span className="booking-details-value">
                {formatDate(booking.flight?.departureTime)}
              </span>
            </div>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Arrival:</span>
              <span className="booking-details-value">
                {booking.flight?.arrivalAirport?.name} (
                {booking.flight?.arrivalAirport?.iataCode})
              </span>
            </div>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Arrival Time:</span>
              <span className="booking-details-value">
                {formatDate(booking.flight?.arrivalTime)}
              </span>
            </div>
            <div className="booking-details-info-row">
              <span className="booking-details-label">Pilot:</span>
              <span className="booking-details-value">
                {booking.flight?.assignedPilot?.name}
              </span>
            </div>
          </div>

          <div className="booking-details-passengers-section">
            <h3 className="booking-details-subtitle">
              Passengers ({booking.passengers.length})
            </h3>
            {booking.passengers.map((passenger, index) => (
              <div
                key={passenger.id}
                className="booking-details-passenger-card"
              >
                <div className="booking-details-passenger-header">
                  <h4 className="booking-details-passenger-title">
                    Passenger {index + 1}
                  </h4>
                  <span className="booking-details-passenger-type">
                    {passenger.type}
                  </span>
                </div>
                <div className="booking-details-passenger-details">
                  <div className="booking-details-info-row">
                    <span className="booking-details-label">Name:</span>
                    <span className="booking-details-value">
                      {passenger.firstName} {passenger.lastName}
                    </span>
                  </div>
                  <div className="booking-details-info-row">
                    <span className="booking-details-label">Passport:</span>
                    <span className="booking-details-value">
                      {passenger.passportNumber}
                    </span>
                  </div>
                  <div className="booking-details-info-row">
                    <span className="booking-details-label">Seat:</span>
                    <span className="booking-details-value">
                      {passenger.seatNumber}
                    </span>
                  </div>
                  {passenger.specialRequests && (
                    <div className="booking-details-info-row">
                      <span className="booking-details-label">
                        Special Requests:
                      </span>
                      <span className="booking-details-value">
                        {passenger.specialRequests}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="booking-details-total-section">
            <div className="booking-details-total-row">
              <span>Base Price:</span>
              <span>${booking.flight?.basePrice?.toFixed(2) || '0.00'}</span>
            </div>
            {booking.passengers.map((passenger, index) => {
              let price = booking.flight.basePrice
              if (passenger.type === 'CHILD') {
                price *= 0.75
              } else if (passenger.type === 'INFANT') {
                price *= 0.1
              }
              return (
                <div key={index} className="booking-details-total-row">
                  <span>
                    Passenger {index + 1} ({passenger.type}):
                  </span>
                  <span>${price.toFixed(2)}</span>
                </div>
              )
            })}
            <div className="booking-details-grand-total">
              <span>Total:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="booking-details-actions">
            <Link to="/profile" className="booking-details-back-button">
              Back to My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BookingDetailsPage
