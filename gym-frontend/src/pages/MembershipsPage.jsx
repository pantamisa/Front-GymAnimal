// src/pages/MembershipsPage.jsx
import { useState, useEffect } from "react";
import { getMembers, getMembershipPlans, createMembership, getMemberships, cancelMembership, deleteMembership } from "../services/api";
import { MembershipStatus } from "../utils/enums";

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ memberId: "", membershipPlanId: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [memsRes, mbrsRes, plansRes] = await Promise.all([
        getMemberships(),
        getMembers(),
        getMembershipPlans()
      ]);
      setMemberships(memsRes.data);
      setMembers(mbrsRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMembership(form);
      loadData();
      setForm({ memberId: "", membershipPlanId: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error al asignar membresía");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("¿Seguro que deseas cancelar esta membresía?")) return;
    try {
      await cancelMembership(id);
      loadData();
    } catch (err) {
      alert("Error al cancelar membresía");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas ELIMINAR permanentemente esta membresía?")) return;
    try {
      await deleteMembership(id);
      loadData();
    } catch (err) {
      alert("Error al eliminar membresía");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-4">Membresías</h2>

      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
        <h5>Asignar Nueva Membresía</h5>
        <div className="row g-2">
          <div className="col-md-5">
            <select className="form-select" value={form.memberId}
              onChange={e => setForm({ ...form, memberId: e.target.value })}
              required>
              <option value="">Seleccionar Miembro</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.email})</option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <select className="form-select" value={form.membershipPlanId}
              onChange={e => setForm({ ...form, membershipPlanId: e.target.value })}
              required>
              <option value="">Seleccionar Plan</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Asignar</button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Miembro</th><th>Plan</th><th>Vencimiento</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.memberName || `ID: ${m.memberId}`}</td>
                <td>{m.planName || `ID: ${m.membershipPlanId}`}</td>
                <td>{new Date(m.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge bg-${m.status === 0 ? "success" : "secondary"}`}>
                    {MembershipStatus[m.status]}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    {m.status === 0 && (
                      <button className="btn btn-sm btn-outline-warning" onClick={() => handleCancel(m.id)}>
                        Cancelar
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
