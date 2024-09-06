// App.js
import React, { useState } from "react";
import "./App.css";

// Components for different views
function Home() {
  return <div>This is the Home component</div>;
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

function Finance() {
  return <div>This is the Finance component</div>;
}

function WeekGoals() {
  return <div>This is the WeekGoals component</div>;
}

function MonthGoals() {
  return <div>This is the Month Goals component</div>;
}

function Settings() {
  return <div>This is the Settings component</div>;
}

function App() {
  const [activeComponent, setActiveComponent] = useState("Home");

  // Function to render the selected component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home />;
      case "Profile":
        return <Profile />;
      case "Finance":
        return <Finance />;
      case "WeekGoals":
        return <WeekGoals />;
      case "MonthGoals":
        return <MonthGoals />;
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
        <h1>Website Name</h1>
      </div>

      {/* Layout with Sidebar and Content Area */}
      <div className="layout">
        {/* Sidebar with buttons */}
        <nav className="sidebar">
          <button onClick={() => setActiveComponent("Home")}>Home</button>
          <button onClick={() => setActiveComponent("Profile")}>Profile</button>
          <button onClick={() => setActiveComponent("Finance")}>Finance</button>
          <button onClick={() => setActiveComponent("WeekGoals")}>
            Week Goals
          </button>
          <button onClick={() => setActiveComponent("MonthGoals")}>
            Month Goals
          </button>
          <button onClick={() => setActiveComponent("Settings")}>
            Settings
          </button>
        </nav>

        {/* Content Area */}
        <div className="content">{renderComponent()}</div>
      </div>
    </div>
  );
}

export default App;
