import React, { useState } from "react";
import axios from "axios";

const Report = () => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const [selectedMonth, setSelectedMonth] = useState("");
  const [status, setStatus] = useState("all");
  const [report, setReport] = useState([]);

  // 👇 get logged-in userId
  const userId = localStorage.getItem("userId");

  const generateReport = async () => {
    if (!selectedMonth) {
      alert("Please select a month");
      return;
    }

    try {
      let url = "";

      const month = selectedMonth.toLowerCase();

      if (status === "all") {
        url = `http://localhost:4000/api/todos/month/${month}/${userId}`;
      } else if (status === "completed") {
        url = `http://localhost:4000/api/todos/month/${month}/${userId}/completed`;
      } else if (status === "incomplete") {
        url = `http://localhost:4000/api/todos/month/${month}/${userId}/incomplete`;
      }

      const res = await axios.get(url);
      setReport(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching report");
    }
  };

  return (
    <div className="page">
      <h2>Monthly Report</h2>

      {/* Month Selection */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {months.map((m) => (
          <button
            key={m}
            className="btn"
            onClick={() => setSelectedMonth(m)}
            style={{
              backgroundColor: selectedMonth === m ? "#ff5fa2" : "#555"
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <br />

      {/* Day filter (future use – whole month only now) */}
      <select className="input" disabled>
        <option>Whole Month</option>
      </select>

      {/* Status Filter */}
      <select
        className="input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>

      <button className="btn" onClick={generateReport}>
        Generate Report
      </button>

      <hr />

      {/* Report Output */}
      {report.length === 0 ? (
        <p>No data found</p>
      ) : (
        report.map((t) => (
          <div className="card" key={t._id}>
            <p><strong>{t.task}</strong> (Day {t.day})</p>
            <p>
              Status: {t.completed ? "✅ Completed" : "❌ Incomplete"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Report;
