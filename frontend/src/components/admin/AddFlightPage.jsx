import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/ApiService'
import { useMessage } from '../common/MessageDisplay'

const AddFlightPage = () => {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage()
  const navigate = useNavigate()
  const [flight, setFlight] = useState({
    flightNumber: '',
    departureAirportIataCode: '',
    arrivalAirportIataCode: '',
    departureTime: '',
    arrivalTime: '',
    basePrice: '',
    pilotId: '',
  })
  const [airports, setAirports] = useState([])
  const [pilots, setPilots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [airportsRes, pilotsRes] = await Promise.all([
        ApiService.getAllAirports(),
        ApiService.getAllPilots(),
      ])

      setAirports(airportsRes.data || [])

      // Transform pilots data to simpler format for the dropdown
      const formattedPilots = (pilotsRes.data || []).map((pilot) => ({
        id: pilot.id,
        name: pilot.name,
      }))
      setPilots(formattedPilots)
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFlight((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Prepare the flight data in the required format
      const flightData = {
        flightNumber: flight.flightNumber,
        departureAirportIataCode: flight.departureAirportIataCode,
        arrivalAirportIataCode: flight.arrivalAirportIataCode,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        basePrice: parseFloat(flight.basePrice),
        pilotId: parseInt(flight.pilotId),
      }

      await ApiService.createFlight(flightData)
      showSuccess('Flight created successfully!')
      navigate('/admin')
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create flight')
    }
  }

  if (loading) return <div className="flight-form-loading">Loading...</div>

  return (
    <div className="flight-form-container">
      <div className="flight-form-card">
        <ErrorDisplay />
        <SuccessDisplay />

        <h2 className="flight-form-title">Add New Flight</h2>

        <form onSubmit={handleSubmit} className="flight-form">
          <div className="form-group">
            <label htmlFor="flightNumber">Flight Number</label>
            <input
              type="text"
              id="flightNumber"
              name="flightNumber"
              value={flight.flightNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="departureAirportIataCode">Departure Airport</label>
            <select
              id="departureAirportIataCode"
              name="departureAirportIataCode"
              value={flight.departureAirportIataCode}
              onChange={handleChange}
              required
            >
              <option value="">Select departure airport</option>
              {airports.map((airport) => (
                <option key={airport.iataCode} value={airport.iataCode}>
                  {airport.city} ({airport.iataCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="arrivalAirportIataCode">Arrival Airport</label>
            <select
              id="arrivalAirportIataCode"
              name="arrivalAirportIataCode"
              value={flight.arrivalAirportIataCode}
              onChange={handleChange}
              required
            >
              <option value="">Select arrival airport</option>
              {airports.map((airport) => (
                <option key={airport.iataCode} value={airport.iataCode}>
                  {airport.city} ({airport.iataCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="departureTime">Departure Time</label>
            <input
              type="datetime-local"
              id="departureTime"
              name="departureTime"
              value={flight.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="arrivalTime">Arrival Time</label>
            <input
              type="datetime-local"
              id="arrivalTime"
              name="arrivalTime"
              value={flight.arrivalTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="basePrice">Base Price ($)</label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              value={flight.basePrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pilotId">Assigned Pilot</label>
            <select
              id="pilotId"
              name="pilotId"
              value={flight.pilotId}
              onChange={handleChange}
              required
            >
              <option value="">Select pilot</option>
              {pilots.map((pilot) => (
                <option key={pilot.id} value={pilot.id}>
                  {pilot.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Create Flight
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFlightPage
