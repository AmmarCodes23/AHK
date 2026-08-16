import { getSession } from "./session";

export async function getAuth() {
  const session = await getSession();
  if (!session.userId) {
    return null;
  }
  return {
    userId: session.userId,
    role: session.role,
    name: session.name,
  };
}

export function isStaffRole(role?: string) {
  return role === "ADMIN" || role === "EMPLOYEE";
}

export function isPatientRole(role?: string) {
  return role === "PATIENT";
}

export async function requireStaff() {
  const auth = await getAuth();
  if (!auth || !isStaffRole(auth.role)) {
    return null;
  }
  return auth;
}

export async function requireAdmin() {
  const auth = await getAuth();
  if (!auth || auth.role !== "ADMIN") {
    return null;
  }
  return auth;
}

export async function requirePatient() {
  const auth = await getAuth();
  if (!auth || !isPatientRole(auth.role)) {
    return null;
  }
  return auth;
}
