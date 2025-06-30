import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function BeginingOfDay({ currentUser }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bedTime, setBedTime] = useState("");
  const [upTime, setUpTime] = useState("");
  const [restedRating, setRestedRating] = useState("");
  const [morningMoodRating, setMorningMoodRating] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [toDo, setToDo] = useState("");
  const [errors, setErrors] = useState({
    restedRating: "",
    morningMoodRating: "",
  });

  console.log("BeginingOfDay component loaded!");

  const fetchDayData = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:5000/dayData?date=${formattedDate}`
      );
      if (response.data) {
        const data = response.data;
        setBedTime(data.bed_time || "");
        setUpTime(data.up_time || "");
        setRestedRating(data.rested_rating || "");
        setMorningMoodRating(data.morning_mood_rating || "");
        setJournalEntry(data.journal_entry || "");
        setToDo(data.to_do_list || "");
      } else {
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

  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);

  const handleSubmit = async () => {
    let formErrors = { restedRating: "", morningMoodRating: "" };

    if (!isValidRating(restedRating)) {
      formErrors.restedRating =
        "Rested Rating must be an integer between 1 and 5";
    }
    if (!isValidRating(morningMoodRating)) {
      formErrors.morningMoodRating =
        "Morning Mood Rating must be an integer between 1 and 5";
    }

    if (formErrors.restedRating || formErrors.morningMoodRating) {
      setErrors(formErrors);
      return;
    }

    const data = {
      userId: currentUser.id,
      timestamp: selectedDate.toISOString(),
      bedTime,
      upTime,
      restedRating: parseInt(restedRating),
      morningMoodRating: parseInt(morningMoodRating),
      journalEntry,
      toDo,
      entryType: "beginningOfDay",
      submitted: true,
    };

    try {
      const response = await axios.post("http://localhost:5000/submit", data);
      console.log("Data from server:", response.data.message);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const isValidRating = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1 && num <= 5;
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile Details</h2>

        <div className="input-group">
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
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
            className={errors.restedRating ? "error" : ""}
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
            value={toDo}
            onChange={(e) => setToDo(e.target.value)}
            rows="10"
            cols="50"
            style={{ resize: "vertical" }}
          />
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default BeginingOfDay;
