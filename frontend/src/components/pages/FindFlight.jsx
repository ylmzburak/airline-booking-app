import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import ApiService from '../../services/ApiService'
import { useMessage } from '../common/MessageDisplay'

const FindFlightsPage = () => {
  const { ErrorDisplay, SuccessDisplay, showError } = useMessage()

  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useState({
    departureIataCode: '',
    arrivalIataCode: '',
    departureDate: '',
  })

  // Fetch all airports on component mount
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await ApiService.getAllAirports()
        setAirports(response.data || [])
      } catch (error) {
        showError('Failed to load airports')
      }
    }
    fetchAirports()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    const initialParams = {
      departureIataCode: params.get('departureIataCode') || '',
      arrivalIataCode: params.get('arrivalIataCode') || '',
      departureDate: params.get('departureDate') || '',
    }

    setSearchParams(initialParams)

    if (initialParams.departureIataCode || initialParams.arrivalIataCode) {
      fetchFlights(initialParams)
    } else {
      setLoading(false)
    }
  }, [location])

  const fetchFlights = async (initialParams) => {
    try {
      setLoading(true)
      const response = await ApiService.searchFlights(
        initialParams.departureIataCode,
        initialParams.arrivalIataCode,
        initialParams.departureDate,
      )
      setFlights(response.data)
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to fetch flights')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchParams.departureIataCode || !searchParams.arrivalIataCode) {
      showError('Please select both departure and arrival airports')
      return
    }

    const query = new URLSearchParams()
    query.append('departureIataCode', searchParams.departureIataCode)
    query.append('arrivalIataCode', searchParams.arrivalIataCode)
    query.append('departureDate', searchParams.departureDate)

    navigate(`/flights?${query.toString()}`)
  }

  const handleSwapAirports = () => {
    setSearchParams({
      ...searchParams,
      departureIataCode: searchParams.arrivalIataCode,
      arrivalIataCode: searchParams.departureIataCode,
    })
  }

  const formatAirportOption = (airport) => {
    return `${airport.iataCode} (${airport.city}) - ${airport.name}`
  }

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const calculateDuration = (departureTime, arrivalTime) => {
    const dep = new Date(departureTime)
    const arr = new Date(arrivalTime)
    const diff = arr - dep

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="find-flight-page">
      <div className="container">
        <ErrorDisplay />
        <SuccessDisplay />

        <div className="search-section">
          <h2>Find Your Flight</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-row">
              <div className="form-group">
                <label>From</label>
                <select
                  value={searchParams.departureIataCode}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      departureIataCode: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Departure Airport</option>
                  {airports.map((airport) => (
                    <option
                      key={`dep-${airport.iataCode}`}
                      value={airport.iataCode}
                    >
                      {formatAirportOption(airport)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="swap-cities">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  aria-label="Swap departure and arrival airports"
                >
                  ↔
                </button>
              </div>

              <div className="form-group">
                <label>To</label>
                <select
                  value={searchParams.arrivalIataCode}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      arrivalIataCode: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Arrival Airport</option>
                  {airports
                    .filter(
                      (airport) =>
                        airport.iataCode !== searchParams.departureIataCode,
                    )
                    .map((airport) => (
                      <option
                        key={`arr-${airport.iataCode}`}
                        value={airport.iataCode}
                      >
                        {formatAirportOption(airport)}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Departure Date</label>
                <input
                  required
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      departureDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button type="submit" className="ff-button">
                Search Flights
              </button>
            </div>
          </form>
        </div>

        <div className="results-section">
          {loading ? (
            <div className="loading">Loading flights...</div>
          ) : flights.length > 0 ? (
            <div className="flights-list">
              {flights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-header">
                    <div className="flight-number">{flight.flightNumber}</div>
                    <div
                      className={`flight-status ${flight.status.toLowerCase()}`}
                    >
                      {flight.status}
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="departure">
                      <div className="time">
                        {formatTime(flight.departureTime)}
                      </div>
                      <div className="date">
                        {formatDate(flight.departureTime)}
                      </div>
                      <div className="airport">
                        {flight.departureAirport.iataCode} -{' '}
                        {flight.departureAirport.name}
                      </div>
                    </div>

                    <div className="duration">
                      <div className="line"></div>
                      <div className="duration-text">
                        {calculateDuration(
                          flight.departureTime,
                          flight.arrivalTime,
                        )}
                      </div>
                      <div className="line"></div>
                    </div>

                    <div className="arrival">
                      <div className="time">
                        {formatTime(flight.arrivalTime)}
                      </div>
                      <div className="date">
                        {formatDate(flight.arrivalTime)}
                      </div>
                      <div className="airport">
                        {flight.arrivalAirport.iataCode} -{' '}
                        {flight.arrivalAirport.name}
                      </div>
                    </div>

                    <div className="price">${flight.basePrice.toFixed(2)}</div>
                  </div>

                  <div className="flight-actions">
                    <Link
                      to={`/book-flight/${flight.id}`}
                      state={{ flight }}
                      className="book-button"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-flights">
              {searchParams.departureIataCode ||
              searchParams.arrivalIataCode ? (
                <p>No flights found matching your criteria</p>
              ) : (
                <p>Enter departure and arrival cities to search for flights</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindFlightsPage
