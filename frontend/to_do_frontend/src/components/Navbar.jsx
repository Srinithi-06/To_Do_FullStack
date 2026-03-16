import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">MENTORA</div>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/add">Add</Link></li>
        <li><Link to="/view">View</Link></li>
        <li><Link to="/report">Report</Link></li>
        <li className="logout">
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
