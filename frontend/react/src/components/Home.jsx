import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { FaRegCalendarAlt } from "react-icons/fa";

import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  // Handler to navigate to note page on date click
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const formatted = selectedDate.toISOString().split('T')[0];
    navigate(`/note/${formatted}`);
  };

  return (
    <div className="fullscreen">
      <div className="home-container">
        <header className="home-header">
          <div className="logo">NextHire</div>
          <div className="nav-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </div>
        </header>

        <section className="hero-section">
          <h1>Intervuze</h1>
          <p>Your dream job starts here - Prepare, practice, succeed!</p>

          {/* Calendar Icon */}
          <button
            className="calendar-icon-btn"
            onClick={() => setShowCalendar((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "2rem",
              margin: "1rem 0",
            }}
            title="Show Calendar"
          >
            <FaRegCalendarAlt color="black"/>
          </button>

          {/* Live Calendar */}
          {showCalendar && (
            <div style={{ maxWidth: 350, margin: "0 auto" }}>
              <Calendar onChange={handleDateChange} value={date} />
              <p style={{ textAlign: "center", marginTop: 10 }}>
                Selected date: {date.toDateString()}
              </p>
            </div>
          )}

          <button
            className="get-started-btn"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </button>
        </section>
      </div>
    </div>
  );
}

export default Home;