import React, { useState, useEffect } from "react";
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
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [bedTime, setBedTime] = useState("");
  const [upTime, setUpTime] = useState("");
  const [restedRating, setRestedRating] = useState("");
  const [morningMoodRating, setMorningMoodRating] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [toDo, setToDo] = useState("");

  // Function to handle the API call and fetch data for the selected date
  const fetchDayData = async (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    try {
      const response = await axios.get(
        `http://localhost:5000/dayData?date=${formattedDate}`
      );
      if (response.data) {
        // If data exists, populate form fields
        const data = response.data;
        setBedTime(data.bed_time || "");
        setUpTime(data.up_time || "");
        setRestedRating(data.rested_rating || "");
        setMorningMoodRating(data.morning_mood_rating || "");
        setJournalEntry(data.journal_entry || "");
        setToDo(data.to_do_list || "");
      } else {
        // If no data exists, clear form fields
        setBedTime("");
        setUpTime("");
        setRestedRating("");
        setMorningMoodRating("");
        setJournalEntry("");
        setToDo("");
      }
    } catch (error) {
      console.error("Error fetching day data:", error);
    }
  };

  // UseEffect to fetch data when the component mounts or when the date changes
  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);

  // State to track validation errors
  const [errors, setErrors] = useState({
    restedRating: "",
    morningMoodRating: "",
  });

  // Function to handle button click and submit data
  const handleSubmit = async () => {
    console.log("Submit button clicked");

    // Reset error messages
    let formErrors = { restedRating: "", morningMoodRating: "" };

    // Validate restedRating and morningMoodRating
    if (!isValidRating(restedRating)) {
      formErrors.restedRating =
        "Rested Rating must be an integer between 1 and 5";
    }
    if (!isValidRating(morningMoodRating)) {
      formErrors.morningMoodRating =
        "Morning Mood Rating must be an integer between 1 and 5";
    }

    // If there are errors, prevent form submission
    if (formErrors.restedRating || formErrors.morningMoodRating) {
      setErrors(formErrors);
      console.log("Validation failed");
      return;
    }

    // Generate the current timestamp
    const timestamp = new Date().toISOString();
    const entryType = "beginningOfDay";
    const submitted = true;

    const data = {
      timestamp,
      bedTime,
      upTime,
      restedRating: parseInt(restedRating),
      morningMoodRating: parseInt(morningMoodRating),
      journalEntry,
      toDo,
      entryType,
      submitted,
    };

    console.log("Data to submit:", data);

    try {
      const response = await axios.post("http://localhost:5000/submit", data);
      console.log("Data from server:", response.data.message);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  // Helper function to validate the ratings
  const isValidRating = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1 && num <= 5;
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile Details</h2>

        {/* Calendar Widget */}
        <div className="input-group">
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)} // Update selected date
            dateFormat="yyyy-MM-dd"
          />
        </div>

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
            className={errors.restedRating ? "error" : ""} // Apply error class if there's an error
          />
          {errors.restedRating && (
            <span className="error-text">{errors.restedRating}</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="morningMoodRating">
            How is your mood today? (1 - 5):
          </label>
          <input
            type="text"
            id="morningMoodRating"
            value={morningMoodRating}
            onChange={(e) => setMorningMoodRating(e.target.value)}
            className={errors.morningMoodRating ? "error" : ""}
          />
          {errors.morningMoodRating && (
            <span className="error-text">{errors.morningMoodRating}</span>
          )}
        </div>

        {/* Simple Textarea for Journal Entry */}
        <div className="input-group">
          <label htmlFor="journalEntry">Journal Entry:</label>
          <textarea
            id="journalEntry"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            rows="10"
            cols="50"
            style={{ resize: "vertical" }}
          />
        </div>
        <div className="input-group">
          <label htmlFor="toDo">ToDo List:</label>
          <textarea
            id="toDo"
            className="todo-list"
            value={toDo}
            onChange={(e) => setToDo(e.target.value)}
            rows="10"
            cols="50"
            style={{ resize: "vertical" }}
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
