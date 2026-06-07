// src/pages/TrainersPage.jsx
import { useState, useEffect } from "react";
import { getTrainers, createTrainer, deleteTrainer } from "../services/api";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    specialty: "", bio: ""
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await getTrainers();
      setTrainers(res.data);
    } catch (err) {
      setError("Error al cargar entrenadores");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrainer(form);
      loadTrainers();
      setForm({ firstName: "", lastName: "", email: "", specialty: "", bio: "" });
    } catch (err) {
      alert("Error al crear entrenador");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este entrenador?")) return;
    try {
      await deleteTrainer(id);
      loadTrainers();
    } catch (err) {
      alert("Error al eliminar entrenador");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-4">Entrenadores</h2>

      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
        <h5>Nuevo Entrenador</h5>
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
            <input className="form-control" placeholder="Especialidad"
              value={form.specialty}
              onChange={e => setForm({ ...form, specialty: e.target.value })}
              required />
          </div>
          <div className="col-12 mt-2">
            <textarea className="form-control" placeholder="Biografía"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Crear Entrenador</button>
      </form>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Nombre</th><th>Email</th><th>Especialidad</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.firstName} {t.lastName}</td>
                <td>{t.email}</td>
                <td>{t.specialty}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>
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
