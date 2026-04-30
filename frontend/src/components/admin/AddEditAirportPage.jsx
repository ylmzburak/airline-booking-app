import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../services/ApiService'
import { useMessage } from '../common/MessageDisplay'

const AddEditAirportPage = () => {
  const { id } = useParams()
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage()
  const navigate = useNavigate()
  const [airport, setAirport] = useState({
    name: '',
    city: '',
    country: '',
    iataCode: '',
  })
  const [cities, setCities] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cities and countries in parallel
        const [citiesRes, countriesRes] = await Promise.all([
          ApiService.getAllCities(),
          ApiService.getAllCountries(),
        ])

        setCities(citiesRes.data || [])
        setCountries(countriesRes.data || [])

        if (id) {
          const airportRes = await ApiService.getAirportById(id)
          setAirport(airportRes.data)
          setIsEditMode(true)
        }
      } catch (error) {
        showError(error.response?.data?.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setAirport((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditMode) {
        await ApiService.updateAirport({
          id: airport.id,
          ...airport,
        })
        showSuccess('Airport updated successfully!')
      } else {
        await ApiService.createAirport(airport)
        showSuccess('Airport created successfully!')
      }
      navigate('/admin?tab=airports')
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save airport')
    }
  }

  if (loading) return <div className="airport-form-loading">Loading...</div>

  return (
    <div className="airport-form-container">
      <div className="airport-form-card">
        <ErrorDisplay />
        <SuccessDisplay />

        <h2 className="airport-form-title">
          {isEditMode ? 'Edit Airport' : 'Add New Airport'}
        </h2>

        <form onSubmit={handleSubmit} className="airport-form">
          <div className="form-group">
            <label htmlFor="name">Airport Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={airport.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={airport.city}
              onChange={handleChange}
              required
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={airport.country}
              onChange={handleChange}
              required
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="iataCode">IATA Code</label>
            <input
              type="text"
              id="iataCode"
              name="iataCode"
              value={airport.iataCode}
              onChange={handleChange}
              maxLength="3"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {isEditMode ? 'Update Airport' : 'Create Airport'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin?tab=airports')}
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
export default AddEditAirportPage
