// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">GymManagement</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/members">Miembros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/trainers">Entrenadores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/classes">Clases</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/memberships">Membresías</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
