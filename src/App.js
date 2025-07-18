import React, { useState, useEffect } from "react";
import "./App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importing react-datepicker styles
import levelUpImage from "./assets/images/levelUpImage256.png"; // Import the image
import axios from "axios";
import BeginingOfDay from "./views/BeginingOfDay";
import EndOfDay from "./views/EndOfDay";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import BudgetTable from "./views/BudgetTable";

// Components for different views
function Home() {
  return <div>This is the Home component</div>;
}

function WeekGoals() {
  return <div>This is the WeekGoals component</div>;
}

function MonthGoals() {
  return <div>This is the Month Goals component</div>;
}

function Summary() {
  return <div>This is the Summary component</div>;
}

function Budget({ currentUser }) {
  return (
    <div style={{ padding: "2rem" }}>
      <BudgetTable currentUser={currentUser} />
    </div>
  );
}

function Transactions() {
  return <div>This is the Transactions component</div>;
}

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile Details</h2>
        <div className="input-group">
          <label htmlFor="textbox1">Textbox 1:</label>
          <input type="text" id="textbox1" />
        </div>
        <div className="input-group">
          <label htmlFor="textbox2">Textbox 2:</label>
          <input type="text" id="textbox2" />
        </div>
        <div className="input-group">
          <label htmlFor="textbox3">Textbox 3:</label>
          <input type="text" id="textbox3" />
        </div>
        <div className="input-group">
          <label htmlFor="textbox4">Textbox 4:</label>
          <input type="text" id="textbox4" />
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return <div>This is the Settings component</div>;
}

function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="calendar-widget">
      {/* The display box showing the selected date */}
      <div className="calendar-display" onClick={toggleCalendar}>
        {selectedDate.toLocaleDateString()}{" "}
        {/* Format the date as MM/DD/YYYY */}
      </div>

      {/* Conditionally render the datepicker when isOpen is true */}
      {isOpen && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setIsOpen(false); // Close dropdown after selecting date
          }}
          inline
        />
      )}
    </div>
  );
}

function App() {
  const [activeComponent, setActiveComponent] = useState("Login");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    console.log("Logged-in user data:", userData); // 🔍 Check this in your browser console
    setCurrentUser(userData);
  };

  // Function to render the selected component
  const renderComponent = () => {
    if (!currentUser) {
      switch (activeComponent) {
        case "SignUp":
          return <SignUp setActiveComponent={setActiveComponent} />;
        case "Login":
        default:
          return (
            <Login
              setActiveComponent={setActiveComponent}
              onLoginSuccess={handleLoginSuccess}
            />
          );
      }
    }

    // Logged-in user views
    switch (activeComponent) {
      case "Home":
        return <Home />;
      case "BeginingOfDay":
        return <BeginingOfDay currentUser={currentUser} />;
      case "EndOfDay":
        return <EndOfDay currentUser={currentUser} />;
      case "WeekGoals":
        return <WeekGoals />;
      case "MonthGoals":
        return <MonthGoals />;
      case "Summary":
        return <Summary />;
      case "Budget":
        console.log("Logged-in user data:", currentUser);
        return <Budget currentUser={currentUser} />;
      case "Transactions":
        return <Transactions />;
      case "Profile":
        return <Profile />;
      case "Settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {/* Top Banner */}
      <div className="banner">
        <div className="banner-content">
          <img src={levelUpImage} alt="Level Up" className="banner-image" />
          <h1>Level Up</h1>
        </div>
      </div>

      {/* Menu Bar with Log In button */}
      <div className="menu-bar">
        {currentUser ? (
          <>
            <div className="menu-welcome">Welcome, {currentUser.username}!</div>
            <button
              className="menu-button"
              onClick={() => setCurrentUser(null)}
            >
              Log Out
            </button>
          </>
        ) : (
          <button
            className="menu-button"
            onClick={() => setActiveComponent("Login")}
          >
            Log In / Sign Up
          </button>
        )}
        <button className="menu-button">Analysis</button>
      </div>

      {/* Layout with Sidebar and Content Area */}
      <div className="layout">
        {/* Sidebar with grouped buttons */}
        <nav className="sidebar">
          {/* Calendar Widget */}
          <CalendarWidget />

          <button
            className={activeComponent === "Home" ? "active" : ""}
            onClick={() => setActiveComponent("Home")}
          >
            Home
          </button>

          {/* First group */}
          <div className="group">
            <h3>Day Overview</h3>
            <button
              className={activeComponent === "BeginingOfDay" ? "active" : ""}
              onClick={() => setActiveComponent("BeginingOfDay")}
            >
              Begining of Day
            </button>
            <button
              className={activeComponent === "EndOfDay" ? "active" : ""}
              onClick={() => setActiveComponent("EndOfDay")}
            >
              End of Day
            </button>
          </div>

          {/* Goals */}
          <div className="group">
            <h3>Goals</h3>
            <button
              className={activeComponent === "WeekGoals" ? "active" : ""}
              onClick={() => setActiveComponent("WeekGoals")}
            >
              Week Goals
            </button>
            <button
              className={activeComponent === "MonthGoals" ? "active" : ""}
              onClick={() => setActiveComponent("MonthGoals")}
            >
              Month Goals
            </button>
            <button
              className={activeComponent === "Finance" ? "active" : ""}
              onClick={() => setActiveComponent("Finance")}
            >
              Finance
            </button>
          </div>

          {/* Finance */}
          <div className="group">
            <h3>Finance</h3>
            <button
              className={activeComponent === "Summary" ? "active" : ""}
              onClick={() => setActiveComponent("Summary")}
            >
              Summary
            </button>
            <button
              className={activeComponent === "Budget" ? "active" : ""}
              onClick={() => setActiveComponent("Budget")}
            >
              Budget
            </button>
            <button
              className={activeComponent === "Transactions" ? "active" : ""}
              onClick={() => setActiveComponent("Transactions")}
            >
              Transactions
            </button>
          </div>

          {/* Third group */}
          <div className="group">
            <h3>User Settings</h3>
            <button
              className={activeComponent === "Profile" ? "active" : ""}
              onClick={() => setActiveComponent("Profile")}
            >
              Profile
            </button>
            <button
              className={activeComponent === "Settings" ? "active" : ""}
              onClick={() => setActiveComponent("Settings")}
            >
              Settings
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="content">{renderComponent()}</div>
      </div>
    </div>
  );
}

export default App;
