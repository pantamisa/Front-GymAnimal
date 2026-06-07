// src/pages/MembersPage.jsx
import { useState, useEffect } from "react";
import { getMembers, createMember, deleteMember } from "../services/api";
import { MemberStatus } from "../utils/enums";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del formulario
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", birthDate: "", status: 0
  });

  // Cargar datos al entrar a la página
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await getMembers();
      setMembers(res.data);
    } catch (err) {
      setError("Error al cargar miembros");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMember(form);
      loadMembers(); // refrescar lista
      setForm({ firstName: "", lastName: "", email: "", phone: "", birthDate: "", status: 0 });
    } catch (err) {
      if (err.response?.status === 409) {
        alert("El email ya está registrado");
      } else {
        alert("Error al crear miembro");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este miembro?")) return;
    try {
      await deleteMember(id);
      loadMembers();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("No se puede eliminar: tiene membresías activas");
      }
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-4">Miembros</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
        <h5>Nuevo Miembro</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" placeholder="Nombre"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              required />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Apellido"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              required />
          </div>
          <div className="col-md-3">
            <input className="form-control" type="email" placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Teléfono"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small mb-0">Fecha de Nacimiento</label>
            <input className="form-control" type="date"
              value={form.birthDate}
              onChange={e => setForm({ ...form, birthDate: e.target.value })}
              required />
          </div>
          <div className="col-md-3">
            <label className="form-label small mb-0">Estado</label>
            <select className="form-select" value={form.status} onChange={e => setForm({...form, status: parseInt(e.target.value)})}>
                {Object.entries(MemberStatus).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Crear Miembro</button>
      </form>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.firstName} {m.lastName}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>
                  <span className={`badge bg-${m.status === 0 ? "success" : m.status === 2 ? "danger" : "secondary"}`}>
                    {MemberStatus[m.status]}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
