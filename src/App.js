import React, { useState } from "react";
import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for the editor
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importing react-datepicker styles
import levelUpImage from "./assets/images/levelUpImage256.png"; // Import the image
import axios from "axios";

// Components for different views
function Home() {
  return <div>This is the Home component</div>;
}

function BeginingOfDay() {
  const [bedTime, setBedTime] = useState("");
  const [upTime, setUpTime] = useState("");
  const [restedRating, setRestedRating] = useState("");
  const [morningMoodRating, setmorningMoodRating] = useState("");
  const [journalEntry, setJournalEntry] = useState(""); // State for journal entry
  const [toDo, setToDo] = useState(""); // State for journal entry

  // Function to handle button click and submit data
  const handleSubmit = async () => {
    // Generate the current timestamp
    const timestamp = new Date().toISOString(); // Current date and time in ISO format
    const entryType = "beginningOfDay";

    const data = {
      timestamp, // Add the timestamp to the data object
      bedTime,
      upTime,
      restedRating,
      morningMoodRating,
      journalEntry,
      toDo,
      entryType,
    };

    // For now, log the data to console (this will be replaced with actual database logic)
    console.log("Data to submit:", data);

    try {
      const response = await axios.post("http://localhost:5000/submit", data);
      console.log("Data from server:", response.data.message);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }

    // Here, you'd send the data to your backend/database
    // Example: axios.post('/api/submit', data);
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile Details</h2>
        <div className="input-group">
          <label htmlFor="BedTime">
            Bed time last night? Example: 10:00 PM:
          </label>
          <input
            type="text"
            id="BedTime"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="UpTime">
            Up time this morning? Example: 8:00 AM:
          </label>
          <input
            type="text"
            id="UpTime"
            value={upTime}
            onChange={(e) => setUpTime(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="RestedQuestion">
            How rested do you feel? (1 - 5):
          </label>
          <input
            type="text"
            id="RestedQuestion"
            value={restedRating}
            onChange={(e) => setRestedRating(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="morningMoodRating">
            How is your mood today? (1 - 5):
          </label>
          <input
            type="text"
            id="morningMoodRating"
            value={morningMoodRating}
            onChange={(e) => setmorningMoodRating(e.target.value)}
          />
        </div>
        {/* Simple Textarea for Journal Entry */}
        <div className="input-group">
          <label htmlFor="journalEntry">Journal Entry:</label>
          <textarea
            id="journalEntry"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            rows="10" // Number of visible text lines
            cols="50" // Number of visible characters per line
            style={{ resize: "vertical" }} // Allows resizing vertically only
          />
        </div>
        <div className="input-group">
          <label htmlFor="toDo">ToDo List:</label>
          <textarea
            id="toDo"
            className="todo-list"
            value={toDo}
            onChange={(e) => setToDo(e.target.value)}
            rows="10" // Number of visible text lines
            cols="50" // Number of visible characters per line
            style={{ resize: "vertical" }} // Allows resizing vertically only
          />
        </div>
        {/* Submit Button */}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

function EndOfDay() {
  return <div>This is the End of Day component</div>;
}

function WeekGoals() {
  return <div>This is the WeekGoals component</div>;
}

function MonthGoals() {
  return <div>This is the Month Goals component</div>;
}

function Finance() {
  return <div>This is the Finance component</div>;
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
  const [activeComponent, setActiveComponent] = useState("Home");

  // Function to render the selected component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home />;
      case "BeginingOfDay":
        return <BeginingOfDay />;
      case "EndOfDay":
        return <EndOfDay />;
      case "WeekGoals":
        return <WeekGoals />;
      case "MonthGoals":
        return <MonthGoals />;
      case "Finance":
        return <Finance />;
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
        <button className="menu-button">Log In</button>
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

          {/* Second group */}
          <div className="group">
            <h3>Goals & Finance</h3>
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
