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
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({
    restedRating: "",
    morningMoodRating: "",
  });

  const isDisabled = submitted && !editMode;

  const fetchDayData = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:5000/dayData?userId=${currentUser.id}&date=${formattedDate}`
      );

      if (response.data && response.data.entry) {
        const data = response.data.entry;
        setBedTime(data.bed_time || "");
        setUpTime(data.up_time || "");
        setRestedRating(data.rested_rating || "");
        setMorningMoodRating(data.morning_mood_rating || "");
        setJournalEntry(data.journal_entry || "");
        setToDo(response.data.todos.map((t) => t.content).join("\n"));
        setSubmitted(data.submitted); // 💡 get `submitted` from backend
        setEditMode(false); // reset edit mode on new load
      } else {
        // Clear fields if no entry
        setBedTime("");
        setUpTime("");
        setRestedRating("");
        setMorningMoodRating("");
        setJournalEntry("");
        setToDo("");
        setSubmitted(false);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error fetching day data:", error);
    }
  };

  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);

  const isValidRating = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1 && num <= 5;
  };

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
      todos: toDo
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((content) => ({ content, completed: false })),
    };

    try {
      const response = await axios.post("http://localhost:5000/submit", data);
      console.log("Data from server:", response.data.message);
      setSubmitted(true); // ✅ now we consider this locked
      setEditMode(false); // ✅ end edit mode
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile Details</h2>

        <div className="input-group always-editable">
          <label>📅 Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="input-group">
          <label htmlFor="BedTime">🛏️ Bed time last night?</label>
          <input
            type="text"
            id="BedTime"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            disabled={isDisabled}
          />
        </div>

        <div className="input-group">
          <label htmlFor="UpTime">☀️ Up time this morning?</label>
          <input
            type="text"
            id="UpTime"
            value={upTime}
            onChange={(e) => setUpTime(e.target.value)}
            disabled={isDisabled}
          />
        </div>

        <div className="input-group">
          <label>🔋 How rested do you feel? (1 - 5):</label>
          <input
            type="text"
            value={restedRating}
            onChange={(e) => setRestedRating(e.target.value)}
            disabled={isDisabled}
            className={errors.restedRating ? "error" : ""}
          />
          {errors.restedRating && (
            <span className="error-text">{errors.restedRating}</span>
          )}
        </div>

        <div className="input-group">
          <label>😊 How is your mood today? (1 - 5):</label>
          <input
            type="text"
            value={morningMoodRating}
            onChange={(e) => setMorningMoodRating(e.target.value)}
            disabled={isDisabled}
            className={errors.morningMoodRating ? "error" : ""}
          />
          {errors.morningMoodRating && (
            <span className="error-text">{errors.morningMoodRating}</span>
          )}
        </div>

        <div className="input-group">
          <label>📓 Journal Entry:</label>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            disabled={isDisabled}
            rows="5"
          />
        </div>

        <div className="input-group">
          <label>✍️ ToDo List:</label>
          <textarea
            value={toDo}
            onChange={(e) => setToDo(e.target.value)}
            disabled={isDisabled}
            rows="5"
          />
        </div>

        <div className="form-button-group">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitted && !editMode} // greyed out when submitted but not editing
          >
            Submit
          </button>

          <button
            className="edit-button"
            onClick={() => setEditMode(true)}
            disabled={editMode} // greyed out while in edit mode
          >
            Edit
          </button>

          <button
            className="cancel-button"
            onClick={() => {
              setEditMode(false);
              fetchDayData(selectedDate);
            }}
            disabled={!editMode} // greyed out unless in edit mode
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeginingOfDay;
