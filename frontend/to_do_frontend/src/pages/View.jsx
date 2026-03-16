import React, { useState } from "react";
import axios from "axios";

const View = () => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const [selectedMonth, setSelectedMonth] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newDay, setNewDay] = useState("");

  // Fetch tasks by month
const fetchTasks = async (month) => {
  console.log("Fetching tasks for:", month); // 👈 add this
  setSelectedMonth(month);

  try {
    const res = await axios.get(
      `http://localhost:4000/api/todos/month/${month}`
    );
    console.log("Tasks from backend:", res.data); // 👈 add this
    setTasks(res.data);
  } catch (err) {
    console.error(err);
  }
};


  // Toggle completed
  const toggleCompleted = async (id) => {
    await axios.put(`http://localhost:4000/api/todos/${id}/toggle`);
    fetchTasks(selectedMonth);
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:4000/api/todos/${id}`);
    fetchTasks(selectedMonth);
  };

  // Save edited task
  const saveEdit = async (id) => {
    await axios.put(`http://localhost:4000/api/todos/${id}`, {
      task: editedTask
    });
    setEditingId(null);
    fetchTasks(selectedMonth);
  };

  // Add new task from View page
 const addNewTask = async () => {
  if (!newTask || !newDay || !selectedMonth) {
    alert("Select month, day and enter task");
    return;
  }

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("User not logged in");
    return;
  }

  try {
    await axios.post("http://localhost:4000/api/todos", {
      task: newTask,
      month: selectedMonth,
      day: newDay,
      userId      // ✅ IMPORTANT FIX
    });

    setNewTask("");
    setNewDay("");
    fetchTasks(selectedMonth);
  } catch (err) {
    console.error(err);
    alert("Failed to add task");
  }
};

  return (
    <div className="page">
      <h2>View Tasks</h2>

      {/* Month Selection */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {months.map((m) => (
          <button
            key={m}
            className="btn"
            style={{
              backgroundColor: selectedMonth === m ? "#ff4d6d" : "#555"
            }}
            onClick={() => fetchTasks(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <br />

      {/* Add New Task */}
      {selectedMonth && (
        <div className="card">
          <h4>Add New Task</h4>
          <input
            className="input"
            placeholder="Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            className="input"
            placeholder="Day (1-31)"
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
          />
          <button className="btn" onClick={addNewTask}>
            Add Task
          </button>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((t) => (
          <div className="card" key={t._id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleCompleted(t._id)}
            />

            {editingId === t._id ? (
              <>
                <input
                  className="input"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button className="btn" onClick={() => saveEdit(t._id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>{t.task}</strong> (Day {t.day})
                </p>
                <p>
                  Status: {t.completed ? "✅ Completed" : "❌ Incomplete"}
                </p>

                <button
                  className="btn"
                  onClick={() => {
                    setEditingId(t._id);
                    setEditedTask(t.task);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn"
                  style={{ backgroundColor: "#444" }}
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default View;
