import React from "react";

const Home = () => {
  const username = localStorage.getItem("username");

  return (
    <div className="page">
      <h1> Welcome{username ? `, ${username}` : ""} 👋 </h1>

      <div
        style={{
          marginTop: "40px",
          padding: "30px",
          background: "linear-gradient(135deg, #ffb3d9, #ffe6f0)",
          borderRadius: "18px",
          maxWidth: "520px",
          marginInline: "auto",
          boxShadow: "0 12px 30px rgba(255, 95, 162, 0.35)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            fontStyle: "italic",
            color: "#6a1b4d",
            marginBottom: "15px",
          }}
        >
          “Success is the sum of small efforts repeated day in and day out.”
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#8e145a",
            fontWeight: "500",
          }}
        >
          — Stay consistent, stay focused 💗
        </p>
      </div>

      {/* Small encouragement line */}
      <p
        style={{
          marginTop: "25px",
          textAlign: "center",
          color: "#7a1f4b",
          fontSize: "15px",
        }}
      >
        🌱 Every task you complete today builds a better tomorrow.
      </p>
    </div>
  );
};

export default Home;
