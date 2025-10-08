import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../styles/ViewerPage.css'; // Adjust the path as necessary
import { useEffect, useState } from 'react';
import axios from 'axios';

function ViewerPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Example: clear session/token if any
    // localStorage.removeItem('authToken');
    navigate('/'); // Redirect to Home (where login/signup are handled)
  };

const [matches, setMatches] = useState([]);

useEffect(() => {
    const fetchMatches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/matches'); // Replace with your backend API URL
            const formattedMatches = response.data.map(match => ({
                date: new Date(match.matchDate).toLocaleDateString(),
                time: new Date(match.matchDate).toLocaleTimeString(),
                team1: match.teamA.name,
                team2: match.teamB.name,
                location: match.venue,
            }));
            setMatches(formattedMatches);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    fetchMatches();
}, []);

  return (
    <div className="sports-page">
      <header className="header">
        <h1 className="logo">🏆 League Pro</h1>
        <nav className="nav-links">
          <Link to="/Teams">Teams</Link>
          <Link to="/Fixtures">Fixtures</Link>
          <Link to="/Results">Results</Link>
          <Link to="/PointsTable">Points Table</Link>
          <Link to="/">Home</Link>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <section className="live-fixtures">
        <h2>⚡️ Live Fixtures</h2>
        <p>Stay up-to-date with the latest matches and times</p>
        <div className="match-list live">
          {matches.map((match, index) => (
            <div key={index} className="match-card live-card">
              <div className="match-header">
                <span className="match-date">{match.date}</span>
                <span className="match-time">{match.time}</span>
              </div>
              <div className="teams">
                <span className="team">{match.team1}</span>
                <span className="vs">vs</span>
                <span className="team">{match.team2}</span>
              </div>
              <p className="location">{match.location}</p>
              <span className="status live">Live</span>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <h3>Manage Your League</h3>
        <p>Everything you need to run your sports league in one place</p>
        <div className="feature-cards">
          <div className="card">
            <h4>🏐 Teams</h4>
            <p>View and manage all teams in the league.</p>
            <Link to="/Teams">Learn more →</Link>
          </div>
          <div className="card">
            <h4>📅 Matches</h4>
            <p>Check upcoming fixtures and past results.</p>
            <Link to="/Matches">Learn more →</Link>
          </div>
          <div className="card">
            <h4>📊 Standings</h4>
            <p>See the current league table and team rankings.</p>
            <Link to="/PointsTable">Learn more →</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>League Manager &copy; 2025 | Managing your league with ease</p>
        <div className="footer-links">
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default ViewerPage;