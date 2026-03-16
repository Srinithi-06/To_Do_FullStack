import React, { useState } from "react";
import axios from "axios";

const Add = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [tasks, setTasks] = useState([""]);

  // Add new task input
  const addTaskField = () => {
    setTasks([...tasks, ""]);
  };

  // Update task value
  const handleTaskChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };

  // Save tasks to backend (USER-SPECIFIC FIX)
  const handleSave = async () => {
    if (!month || !day || tasks.some(t => t.trim() === "")) {
      alert("Please fill all fields");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/todos/bulk", {
        month,
        day,
        tasks,
        userId        // ✅ IMPORTANT FIX
      });

      alert("Tasks saved successfully");

      // reset form
      setMonth("");
      setDay("");
      setTasks([""]);
    } catch (error) {
      console.error("Error saving tasks:", error);
      alert("Failed to save tasks");
    }
  };

  return (
    <div className="page">
      <h2>Add Tasks</h2>

      {/* Month Selection */}
      <select
        className="input"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">Select Month</option>
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Day Selection */}
      <select
        className="input"
        value={day}
        onChange={(e) => setDay(e.target.value)}
      >
        <option value="">Select Day</option>
        {days.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Task Inputs */}
      <h4>Tasks</h4>

      {tasks.map((task, index) => (
        <input
          key={index}
          className="input"
          type="text"
          placeholder={`Task ${index + 1}`}
          value={task}
          onChange={(e) => handleTaskChange(index, e.target.value)}
        />
      ))}

      <button className="btn" onClick={addTaskField}>
        + Add Another Task
      </button>

      <br /><br />

      <button className="btn" onClick={handleSave}>
        Save Tasks
      </button>
    </div>
  );
};

export default Add;
