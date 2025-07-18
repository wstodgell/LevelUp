import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import * as Checkbox from "@radix-ui/react-checkbox";

function EndOfDay({ currentUser }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalEntry, setJournalEntry] = useState("");
  const [todos, setTodos] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const isDisabled = submitted && !editMode;

  const fetchDayData = async (date) => {
    if (!currentUser || !currentUser.id) {
      console.warn("❌ currentUser not ready yet", currentUser);
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:5000/dayData?userId=${currentUser.id}&date=${formattedDate}`
      );
      console.log("Fetched day data (end of day):", response.data); // 👈 Add this

      if (response.data?.entry?.entry_type === "endOfDay") {
        const data = response.data.entry;
        setJournalEntry(data.journal_entry || "");
        setSubmitted(data.submitted);
        setEditMode(false);
      } else {
        setJournalEntry("");
        setSubmitted(false);
        setEditMode(false);
      }

      const todoList = response.data.todos || [];
      setTodos(todoList);
    } catch (error) {
      console.error("Error fetching day data:", error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.id && selectedDate) {
      console.log("✅ Fetching day data...", { currentUser, selectedDate });
      fetchDayData(selectedDate);
    } else {
      console.log("⏳ Waiting for currentUser or selectedDate to be ready", {
        currentUser,
        selectedDate,
      });
    }
  }, [selectedDate, currentUser]);

  const toggleTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleSubmit = async () => {
    const data = {
      userId: currentUser.id,
      timestamp: selectedDate.toISOString(),
      journalEntry,
      entryType: "endOfDay",
      submitted: true,
      todos: todos.map((todo) => ({
        content: todo.content,
        completed: todo.completed,
      })),
    };

    try {
      await axios.post("http://localhost:5000/endOfDay", data);
      setSubmitted(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error submitting end-of-day data:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>End of Day Summary</h2>

        <div className="input-group always-editable">
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="input-group">
          <label htmlFor="journalEntry">Journal Entry:</label>
          <textarea
            id="journalEntry"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            disabled={isDisabled}
            rows="5"
          />
        </div>

        <div className="input-group">
          <label>ToDo Items:</label>
          {todos.length === 0 ? (
            <p>No tasks for today.</p>
          ) : (
            todos.map((item, index) => (
              <div key={item.id || index} className="todo-item">
                <div key={item.id || index} className="radix-checkbox">
                  <Checkbox.Root
                    className="radix-checkbox-box"
                    checked={item.completed}
                    disabled={isDisabled}
                    onCheckedChange={() => toggleTodo(index)}
                  >
                    <Checkbox.Indicator>✔️</Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="radix-checkbox-label">{item.content}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="form-button-group">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitted && !editMode}
          >
            Submit
          </button>
          <button
            className="edit-button"
            onClick={() => setEditMode(true)}
            disabled={editMode}
          >
            Edit
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setEditMode(false);
              fetchDayData(selectedDate);
            }}
            disabled={!editMode}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndOfDay;
