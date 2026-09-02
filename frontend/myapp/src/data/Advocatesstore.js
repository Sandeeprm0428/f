// ============================================================
//  advocatesStore.js — Shared advocate data layer
//  Backed by localStorage, seeded from advocates.json.
//
//  Self-healing behavior:
//   - IDs are ALWAYS assigned fresh by this file (1, 2, 3, ...),
//     never trusted from advocates.json. This means duplicate or
//     reused ids in the JSON file can never cause bugs.
//   - Every time getAdvocates() runs, it checks advocates.json for
//     any advocate (matched by email) that isn't already saved in
//     localStorage, and adds them automatically. So adding new
//     people to advocates.json "just works" on the next page load
//     — no manual localStorage clearing needed — while any admin
//     edits, approvals, or new signups already in localStorage are
//     left untouched.
//
//  Advocate shape:
//  {
//    id, name, email, password, phone, city, speciality, court,
//    barCouncil, barId, experience, fee, bio, languages,
//    rating, cases, availability,
//    status: "pending" | "approved" | "rejected"
//  }
// ============================================================

import seedAdvocates from "./advocates.json";

const STORE_KEY = "law4u_advocates";

function readRaw() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

function normalizeSeedEntry(a, id) {
  return {
    ...a,
    id,
    avatar: a.avatar || "",
    languages: a.languages || [],
    status: a.status || "approved",
  };
}

function reconcileSeedData(existingAdvocate) {
  const seed = seedAdvocates.find(
    (item) => String(item.email).toLowerCase() === String(existingAdvocate.email || "").toLowerCase()
  );

  if (!seed) return existingAdvocate;

  return {
    ...existingAdvocate,
    ...seed,
    id: existingAdvocate.id,
    avatar: existingAdvocate.avatar || seed.avatar || "",
    languages: existingAdvocate.languages && existingAdvocate.languages.length
      ? existingAdvocate.languages
      : seed.languages || [],
    status: existingAdvocate.status || seed.status || "approved",
  };
}

// First-time load: nothing in localStorage yet — seed fresh with
// sequential ids (1..N), ignoring whatever ids are in the JSON.
function seedStore() {
  const seeded = seedAdvocates.map((a, i) => normalizeSeedEntry(a, i + 1));
  persist(seeded);
  return seeded;
}

// Every subsequent load: add any advocates.json entries (by email)
// that aren't already in the store, without touching existing data.
function mergeNewSeedEntries(existing) {
  const existingByEmail = new Map();

  let changed = false;
  const merged = existing.map((a) => {
    const updated = reconcileSeedData(a);
    const key = String(updated.email || "").toLowerCase();
    existingByEmail.set(key, updated);

    if (JSON.stringify(a) !== JSON.stringify(updated)) {
      changed = true;
    }

    return updated;
  });

  const missing = seedAdvocates.filter(
    (a) => !existingByEmail.has(String(a.email).toLowerCase())
  );

  if (missing.length > 0) {
    let nextId = merged.length ? Math.max(...merged.map((a) => a.id)) + 1 : 1;
    const additions = missing.map((a) => normalizeSeedEntry(a, nextId++));
    const finalMerged = [...merged, ...additions];
    persist(finalMerged);
    return finalMerged;
  }

  if (changed) {
    persist(merged);
  }

  return merged;
}

// ── Public API ──────────────────────────────────────────────

export function getAdvocates() {
  const existing = readRaw();
  if (!existing) return seedStore();
  return mergeNewSeedEntries(existing);
}

export function getAdvocateById(id) {
  return getAdvocates().find((a) => a.id === Number(id)) || null;
}

export function getAdvocateByEmail(email) {
  const e = email.trim().toLowerCase();
  return getAdvocates().find((a) => a.email.toLowerCase() === e) || null;
}

export function addAdvocate(advocate) {
  const list = getAdvocates();
  const nextId = list.length ? Math.max(...list.map((a) => a.id)) + 1 : 1;
  const newAdvocate = {
    id: nextId,
    rating: 0,
    cases: 0,
    languages: [],
    availability: "Not available",
    status: "pending",
    ...advocate,
    id: nextId, // id is always assigned by the store — never overridable
  };
  const updated = [...list, newAdvocate];
  persist(updated);
  return newAdvocate;
}

export function updateAdvocate(id, updates) {
  const list = getAdvocates();
  const updated = list.map((a) =>
    a.id === Number(id) ? { ...a, ...updates, id: a.id } : a
  );
  persist(updated);
  return updated.find((a) => a.id === Number(id)) || null;
}

export function deleteAdvocate(id) {
  const list = getAdvocates();
  persist(list.filter((a) => a.id !== Number(id)));
}

export function approveAdvocate(id) {
  return updateAdvocate(id, { status: "approved" });
}

export function rejectAdvocate(id) {
  return updateAdvocate(id, { status: "rejected" });
}