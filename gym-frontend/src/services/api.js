// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5291/api",
});

// ---- MIEMBROS ----
export const getMembers = () => api.get("/Member");
export const getMemberById = (id) => api.get(`/Member/${id}`);
export const createMember = (data) => api.post("/Member", data);
export const updateMember = (id, data) => api.put(`/Member/${id}`, data);
export const deleteMember = (id) => api.delete(`/Member/${id}`);

// ---- ENTRENADORES ----
export const getTrainers = () => api.get("/Trainer");
export const getTrainerById = (id) => api.get(`/Trainer/${id}`);
export const createTrainer = (data) => api.post("/Trainer", data);
export const updateTrainer = (id, data) => api.put(`/Trainer/${id}`, data);
export const deleteTrainer = (id) => api.delete(`/Trainer/${id}`);

// ---- CLASES ----
export const getClasses = () => api.get("/GymClass");
export const getClassById = (id) => api.get(`/GymClass/${id}`);
export const createClass = (data) => api.post("/GymClass", data);
export const updateClassStatus = (id, status) => api.patch(`/GymClass/${id}/status`, { status });
export const enrollMember = (classId, memberId) => api.post(`/GymClass/${classId}/enroll`, { memberId });
export const unenrollMember = (classId, memberId) => api.delete(`/GymClass/${classId}/unenroll/${memberId}`);
export const getClassMembers = (classId) => api.get(`/GymClass/${classId}/members`);

// ---- PLANES ----
export const getMembershipPlans = () => api.get("/MembershipPlan");
export const createMembershipPlan = (data) => api.post("/MembershipPlan", data);

// ---- MEMBRESÍAS ----
export const getMemberships = () => api.get("/Membership");
export const getMembershipsByMember = (memberId) => api.get(`/Membership/member/${memberId}`);
export const createMembership = (data) => api.post("/Membership", data);
export const cancelMembership = (id) => api.patch(`/Membership/${id}/cancel`);
export const deleteMembership = (id) => api.delete(`/Membership/${id}`);

export default api;
