// src/pages/ClassesPage.jsx
import { useState, useEffect } from "react";
import { getClasses, createClass, getTrainers, updateClassStatus, getClassMembers, getMembers, enrollMember, unenrollMember } from "../services/api";
import { ClassStatus } from "../utils/enums";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]); // Para el combo de inscripción
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para inscritos (Ver lista)
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolledMembers, setEnrolledMembers] = useState([]);

  // Estado para inscribir (Formulario)
  const [enrollForm, setEnrollForm] = useState({ memberId: "" });

  const [form, setForm] = useState({
    name: "", description: "", schedule: "",
    durationMinutes: 60, capacity: 20, trainerId: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesRes, trainersRes, membersRes] = await Promise.all([
        getClasses(), 
        getTrainers(),
        getMembers()
      ]);
      setClasses(classesRes.data);
      setTrainers(trainersRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, schedule: new Date(form.schedule).toISOString() };
      await createClass(data);
      loadData();
      setForm({ name: "", description: "", schedule: "", durationMinutes: 60, capacity: 20, trainerId: "" });
    } catch (err) {
      alert("Error al crear clase");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateClassStatus(id, newStatus);
      loadData();
    } catch (err) {
      alert("Error al cambiar estado");
    }
  };

  const handleShowMembers = async (gymClass) => {
    try {
      setSelectedClass(gymClass);
      const res = await getClassMembers(gymClass.id);
      setEnrolledMembers(res.data);
    } catch (err) {
      alert("Error al cargar miembros inscritos");
    }
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    try {
      await enrollMember(selectedClass.id, enrollForm.memberId);
      alert("¡Miembro inscrito con éxito!");
      setEnrollForm({ memberId: "" });
      handleShowMembers(selectedClass); // Refrescar lista de inscritos
    } catch (err) {
      const msg = err.response?.data?.message || "Error al inscribir miembro. Verifica que tenga membresía activa y la clase tenga cupo.";
      alert("Error: " + msg);
    }
  };

  const handleUnenroll = async (memberId) => {
    if (!confirm("¿Seguro que deseas eliminar a este miembro de la clase?")) return;
    try {
      await unenrollMember(selectedClass.id, memberId);
      handleShowMembers(selectedClass); // Refrescar lista
    } catch (err) {
      alert("Error al eliminar miembro de la clase");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-4">Clases</h2>

      {/* Formulario de Nueva Clase */}
      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
        <h5>Nueva Clase</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Nombre de la clase"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={form.trainerId}
              onChange={e => setForm({ ...form, trainerId: e.target.value })}
              required>
              <option value="">Seleccionar Entrenador</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <input className="form-control" type="datetime-local"
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
              required />
          </div>
          <div className="col-md-3">
            <input className="form-control" type="number" placeholder="Duración (min)"
              value={form.durationMinutes}
              onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
              required />
          </div>
          <div className="col-md-3">
            <input className="form-control" type="number" placeholder="Capacidad"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
              required />
          </div>
          <div className="col-md-6">
            <input className="form-control" placeholder="Descripción"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Crear Clase</button>
      </form>

      {/* Tabla de Clases */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Nombre</th><th>Entrenador</th><th>Horario</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.trainerName || `ID: ${c.trainerId}`}</td>
                <td>{new Date(c.schedule).toLocaleString()}</td>
                <td>
                  <span className={`badge bg-${c.status === 0 ? "primary" : c.status === 1 ? "info" : c.status === 2 ? "success" : "secondary"}`}>
                    {ClassStatus[c.status]}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-info text-white" 
                      onClick={() => handleShowMembers(c)}
                      data-bs-toggle="modal" data-bs-target="#membersModal">
                      Inscritos
                    </button>
                    <button className="btn btn-sm btn-success" 
                      onClick={() => setSelectedClass(c)}
                      data-bs-toggle="modal" data-bs-target="#enrollModal">
                      Inscribir
                    </button>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Estado
                      </button>
                      <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => handleStatusChange(c.id, 0)}>Programada</button></li>
                        <li><button className="dropdown-item" onClick={() => handleStatusChange(c.id, 1)}>En Progreso</button></li>
                        <li><button className="dropdown-item" onClick={() => handleStatusChange(c.id, 2)}>Finalizada</button></li>
                        <li><button className="dropdown-item" onClick={() => handleStatusChange(c.id, 3)}>Cancelada</button></li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para ver inscritos */}
      <div className="modal fade" id="membersModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Miembros inscritos en: {selectedClass?.name}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {enrolledMembers.length === 0 ? (
                <p>No hay miembros inscritos aún.</p>
              ) : (
                <ul className="list-group">
                  {enrolledMembers.map(m => (
                    <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {m.firstName} {m.lastName} <br/>
                        <small className="text-muted">{m.email}</small>
                      </div>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleUnenroll(m.id)}>
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para inscribir miembro */}
      <div className="modal fade" id="enrollModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Inscribir Miembro en: {selectedClass?.name}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEnrollSubmit}>
                <div className="mb-3">
                  <label className="form-label">Seleccionar Miembro</label>
                  <select className="form-select" value={enrollForm.memberId}
                    onChange={e => setEnrollForm({ memberId: e.target.value })}
                    required>
                    <option value="">-- Elige un miembro --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.email})</option>
                    ))}
                  </select>
                </div>
                <div className="alert alert-info small">
                  Nota: El miembro debe tener una membresía activa para inscribirse.
                </div>
                <button type="submit" className="btn btn-primary w-100">Confirmar Inscripción</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
