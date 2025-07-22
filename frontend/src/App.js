import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    name: '',
    address: '',
    city: '',
    contactNumber: '',
    bloodGroup: ''
  });

  // Search form state
  const [searchData, setSearchData] = useState({
    bloodGroup: '',
    city: ''
  });
  const [searchResults, setSearchResults] = useState([]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, registrationData);
      setMessage(response.data.message);
      setMessageType('success');
      setRegistrationData({
        name: '',
        address: '',
        city: '',
        contactNumber: '',
        bloodGroup: ''
      });
      // Redirect to external website after 2 seconds
      // setTimeout(() => {
      //   window.location.href = 'https://www.example.com'; // Change to your desired URL
      // }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSearchResults([]);

    try {
      const params = new URLSearchParams();
      if (searchData.bloodGroup) params.append('bloodGroup', searchData.bloodGroup);
      if (searchData.city) params.append('city', searchData.city);

      const response = await axios.get(`${API_BASE_URL}/users?${params}`);
      setSearchResults(response.data.donors);
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Search failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Animated Blood System */}
      <div className="blood-system">
        <div className="blood-bottle"></div>
        <div className="blood-bottle"></div>
        <div className="blood-pipe">
          <div className="blood-flow"></div>
        </div>
      </div>

      <div className="container">
        <div className="header-section">
          <header className="header">
            <h1>🩸 BloodConnect</h1>
          </header>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register as Donor
            </button>
            <button 
              className={`tab ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Search Donors
            </button>
          </div>
        </div>

        {/* Scrolling Tagline */}
        <div className="scrolling-tagline">
          <div className="scrolling-text">
            Connect blood donors with those in need • Save lives through blood donation • Every drop counts • Join our community of lifesavers • Be a hero, donate blood • Your donation can save up to 3 lives • Blood donation is safe and simple • Make a difference today • Connect blood donors with those in need
          </div>
        </div>

        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="card">
            <h2>Register as a Blood Donor</h2>
            <p className="subtitle">Join our community of lifesavers</p>
            
            <form onSubmit={handleRegistration}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={registrationData.address}
                  onChange={handleRegistrationChange}
                  required
                  placeholder="Enter your address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={registrationData.city}
                  onChange={handleRegistrationChange}
                  required
                  placeholder="Enter your city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={registrationData.contactNumber}
                  onChange={handleRegistrationChange}
                  required
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group *</label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={registrationData.bloodGroup}
                  onChange={handleRegistrationChange}
                  required
                >
                  <option value="">Select your blood group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register as Donor'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="card">
            <h2>Search for Blood Donors</h2>
            <p className="subtitle">Find donors in your area</p>
            
            <form onSubmit={handleSearch}>
              <div className="form-group">
                <label htmlFor="searchBloodGroup">Blood Group Required</label>
                <select
                  id="searchBloodGroup"
                  name="bloodGroup"
                  value={searchData.bloodGroup}
                  onChange={handleSearchChange}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="searchCity">City (Optional)</label>
                <input
                  type="text"
                  id="searchCity"
                  name="city"
                  value={searchData.city}
                  onChange={handleSearchChange}
                  placeholder="Enter city name"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Donors'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="results">
                <h3>Found {searchResults.length} donor(s)</h3>
                <div className="donors-grid">
                  {searchResults.map((donor, index) => (
                    <div key={index} className="donor-card">
                      <div className="donor-header">
                        <h4>{donor.name}</h4>
                        <span className="blood-group">{donor.bloodGroup}</span>
                      </div>
                      <div className="donor-details">
                        <p><strong>📍 Location:</strong> {donor.city}</p>
                        <p><strong>📞 Contact:</strong> {donor.contactNumber}</p>
                        <p><strong>🏠 Address:</strong> {donor.address}</p>
                        <p><strong>📅 Registered:</strong> {new Date(donor.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 