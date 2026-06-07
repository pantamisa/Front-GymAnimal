// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MembersPage from "./pages/MembersPage";
import TrainersPage from "./pages/TrainersPage";
import ClassesPage from "./pages/ClassesPage";
import MembershipsPage from "./pages/MembershipsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/members" />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
