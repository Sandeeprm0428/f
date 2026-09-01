// ============================================================
//  clientsStore.js — Shared client data layer
//  Backed by localStorage. Used by Signup.js so client
//  registrations actually persist.
//
//  Client shape:
//  { id, name, email, password, phone, city, legalIssue }
// ============================================================

const STORE_KEY = "law4u_clients";

function persist(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

export function getClients() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getClientByEmail(email) {
  const e = email.trim().toLowerCase();
  return getClients().find((c) => c.email.toLowerCase() === e) || null;
}

export function addClient(client) {
  const list = getClients();
  const nextId = list.length ? Math.max(...list.map((c) => c.id)) + 1 : 1;
  const newClient = { id: nextId, ...client };
  persist([...list, newClient]);
  return newClient;
}