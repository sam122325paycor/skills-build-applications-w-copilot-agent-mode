import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

const navItems = [
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' }
];

const Home = () => (
  <div className="card border-0 shadow-sm page-card">
    <div className="card-body p-4 p-lg-5">
      <h1 className="display-6 fw-bold text-primary-emphasis mb-3">Welcome to OctoFit Tracker</h1>
      <p className="lead text-secondary mb-4">
        Track workouts, monitor team progress, and compete on a single fitness dashboard.
      </p>
      <div className="d-flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className="btn btn-primary">
            Open {item.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-shell min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark app-navbar mb-4">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              OctoFit Tracker
            </Link>
            <div className="navbar-nav ms-auto gap-1 flex-row flex-wrap">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="container pb-5">
          <Routes>
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
