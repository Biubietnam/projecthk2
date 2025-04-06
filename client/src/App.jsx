import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './Components/Homepage';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>

        <body>
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<h1>About Us</h1>} />
              <Route path="/contact" element={<h1>Contact Us</h1>} />
            </Routes>
          </main>
        </body>

        <footer>
          <p>&copy; 2023 Your Company</p>
          <p>All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
