// ============================================================
//  AdminPage.js  —  Law4u Admin Page
//  Password-protected admin console:
//   - Approve / reject pending advocate signups
//   - Add / edit / delete any advocate account
//   - View Contact & Partners form submissions as messages
//
//  ⚠️ Demo-only auth: the admin credentials below are hardcoded
//  and checked entirely client-side. For a real deployment, move
//  admin auth to a backend with hashed passwords and a real
//  session/token — never ship credentials in client code.
// ============================================================

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdvocates,
  addAdvocate,
  updateAdvocate,
  deleteAdvocate,
  approveAdvocate,
  rejectAdvocate,
} from "../data/Advocatesstore";
import { getMessages, markAsRead, deleteMessage } from "../data/MessageStore";
import "./AdminPage.css";

const ADMIN_SESSION_KEY = "law4u_admin_session";
// Demo-only credentials — replace with real backend auth in production.
const ADMIN_CREDENTIALS = { email: "admin@law4u.in", password: "Admin@123" };

const CITIES = [
  "Bengaluru","Mumbai","Delhi","Chennai","Hyderabad","Kolkata",
  "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Kochi",
  "Bhopal","Nagpur","Surat","Indore","Patna","Vadodara",
];

const PRACTICE_AREAS = [
  "Criminal Law","Family Law","Property Law","Civil Law",
  "Corporate Law","Tax Law","Labour Law","Consumer Law",
  "Cyber Law","Immigration","Banking Law","Intellectual Property",
  "Divorce","Cheque Bounce","NRI Matters","Supreme Court",
];

const COURTS = [
  "District Court","High Court","Supreme Court",
  "Family Court","Consumer Forum","Labour Court",
  "Civil Court","Criminal Court","Revenue Court",
];

const EMPTY_FORM = {
  name: "", email: "", phone: "", password: "",
  city: "", speciality: "", court: "", experience: "",
  fee: "", bio: "", barId: "", status: "approved",
};

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^\d{10}$/.test(String(p).replace(/\s|-/g, "")); }

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Admin Login Gate ────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr]   = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      form.password === ADMIN_CREDENTIALS.password
    ) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setErr("");
      onLogin();
    } else {
      setErr("Invalid admin email or password.");
    }
  };

  return (
    <div className="am-login-page">
      <form className="am-login-card" onSubmit={handleSubmit}>
        <div className="am-login-icon">🛡️</div>
        <h1 className="am-login-title">Admin Console</h1>
        <p className="am-login-sub">Law4u — Advocate Management</p>

        <div className="am-field">
          <label>Admin Email</label>
          <input
            type="email"
            placeholder="admin@law4u.in"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div className="am-field">
          <label>Password</label>
          <div className="am-pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter admin password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
            <button type="button" className="am-eye" onClick={() => setShowPw((p) => !p)}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {err && <p className="am-err">⚠ {err}</p>}

        <button type="submit" className="am-btn-primary">Login to Admin →</button>

        <Link to="/" className="am-back-link">← Back to site</Link>
      </form>
    </div>
  );
}

// ── Stat card ───────────────────────────────────────────────
function StatCard({ icon, label, value, tone }) {
  return (
    <div className={`am-stat-card ${tone || ""}`}>
      <div className="am-stat-icon">{icon}</div>
      <div>
        <div className="am-stat-value">{value}</div>
        <div className="am-stat-label">{label}</div>
      </div>
    </div>
  );
}

// ── Advocate row (All Advocates tab) ───────────────────────
function AdvocateRow({ adv, onEdit, onDelete }) {
  const STATUS_MAP = {
    approved: { bg: "#dcfce7", c: "#14532d", label: "Approved" },
    pending:  { bg: "#fef3c7", c: "#92400e", label: "Pending" },
    rejected: { bg: "#fee2e2", c: "#7f1d1d", label: "Rejected" },
  };
  const s = STATUS_MAP[adv.status] || STATUS_MAP.pending;

  return (
    <div className="am-row">
      <div className="am-row-main">
        <div className="am-row-avatar">{adv.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("").slice(0,2)}</div>
        <div>
          <div className="am-row-name">{adv.name}</div>
          <div className="am-row-sub">{adv.speciality} · {adv.city}</div>
        </div>
      </div>
      <div className="am-row-contact">
        <div>{adv.email}</div>
        <div>{adv.phone}</div>
      </div>
      <span className="am-status-pill" style={{ background: s.bg, color: s.c }}>{s.label}</span>
      <div className="am-row-actions">
        <button className="am-btn-edit" onClick={() => onEdit(adv)}>✎ Edit</button>
        <button className="am-btn-delete" onClick={() => onDelete(adv)}>🗑 Delete</button>
      </div>
    </div>
  );
}

// ── Pending approval card ──────────────────────────────────
function PendingCard({ adv, onApprove, onReject, onEdit }) {
  return (
    <div className="am-pending-card">
      <div className="am-row-main">
        <div className="am-row-avatar">{adv.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("").slice(0,2)}</div>
        <div>
          <div className="am-row-name">{adv.name}</div>
          <div className="am-row-sub">{adv.speciality} · {adv.city}</div>
        </div>
      </div>

      <div className="am-pending-details">
        <div><strong>Email:</strong> {adv.email}</div>
        <div><strong>Phone:</strong> {adv.phone}</div>
        <div><strong>Bar ID:</strong> {adv.barId}</div>
        <div><strong>Court:</strong> {adv.court}</div>
        <div><strong>Experience:</strong> {adv.experience}</div>
        <div><strong>Fee:</strong> {adv.fee}</div>
      </div>
      {adv.bio && <p className="am-pending-bio">{adv.bio}</p>}

      <div className="am-pending-actions">
        <button className="am-btn-approve" onClick={() => onApprove(adv.id)}>✓ Approve</button>
        <button className="am-btn-reject" onClick={() => onReject(adv.id)}>✕ Reject</button>
        <button className="am-btn-edit" onClick={() => onEdit(adv)}>✎ Edit first</button>
      </div>
    </div>
  );
}

// ── Add / Edit modal ────────────────────────────────────────
function AdvocateFormModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial, password: "" } : EMPTY_FORM);
  const [err, setErr] = useState({});

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!isEdit && !form.password) e.password = "Password is required for a new account";
    if (!form.city) e.city = "Select a city";
    if (!form.speciality) e.speciality = "Select a practice area";
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password; // keep existing password if left blank
    onSave(payload);
  };

  return (
    <div className="am-modal-overlay" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-modal-header">
          <h3>{isEdit ? "Edit Advocate" : "Add New Advocate"}</h3>
          <button className="am-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="am-modal-form">
          <div className="am-modal-grid">
            <div className="am-field">
              <label>Full Name *</label>
              <input value={form.name} onChange={(e) => setF("name", e.target.value)} />
              {err.name && <p className="am-err">⚠ {err.name}</p>}
            </div>

            <div className="am-field">
              <label>Phone *</label>
              <input value={form.phone} onChange={(e) => setF("phone", e.target.value)} maxLength={10} />
              {err.phone && <p className="am-err">⚠ {err.phone}</p>}
            </div>
          </div>

          <div className="am-field">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} />
            {err.email && <p className="am-err">⚠ {err.email}</p>}
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>City *</label>
              <select value={form.city} onChange={(e) => setF("city", e.target.value)}>
                <option value="">Select city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {err.city && <p className="am-err">⚠ {err.city}</p>}
            </div>

            <div className="am-field">
              <label>Practice Area *</label>
              <select value={form.speciality} onChange={(e) => setF("speciality", e.target.value)}>
                <option value="">Select speciality</option>
                {PRACTICE_AREAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {err.speciality && <p className="am-err">⚠ {err.speciality}</p>}
            </div>
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>Court</label>
              <select value={form.court} onChange={(e) => setF("court", e.target.value)}>
                <option value="">Select court</option>
                {COURTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="am-field">
              <label>Experience</label>
              <input placeholder="e.g. 10 years" value={form.experience} onChange={(e) => setF("experience", e.target.value)} />
            </div>
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>Bar ID</label>
              <input value={form.barId} onChange={(e) => setF("barId", e.target.value)} />
            </div>

            <div className="am-field">
              <label>Fee</label>
              <input placeholder="e.g. ₹2,000 / consult" value={form.fee} onChange={(e) => setF("fee", e.target.value)} />
            </div>
          </div>

          <div className="am-field">
            <label>Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setF("bio", e.target.value)} />
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>{isEdit ? "Reset Password (optional)" : "Password *"}</label>
              <input
                type="text"
                placeholder={isEdit ? "Leave blank to keep current password" : "Set a password"}
                value={form.password}
                onChange={(e) => setF("password", e.target.value)}
              />
              {err.password && <p className="am-err">⚠ {err.password}</p>}
            </div>

            <div className="am-field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setF("status", e.target.value)}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="am-modal-actions">
            <button type="button" className="am-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="am-btn-primary">
              {isEdit ? "Save Changes" : "Create Advocate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm modal ───────────────────────────────────
function ConfirmDeleteModal({ label, itemName, onCancel, onConfirm }) {
  return (
    <div className="am-modal-overlay" onClick={onCancel}>
      <div className="am-modal am-modal-sm" onClick={(e) => e.stopPropagation()}>
        <h3>{label}</h3>
        <p>
          This will permanently remove <strong>{itemName}</strong>. This can't be undone.
        </p>
        <div className="am-modal-actions">
          <button className="am-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="am-btn-delete-confirm" onClick={onConfirm}>Delete Permanently</button>
        </div>
      </div>
    </div>
  );
}

// ── Message row (Messages tab) ─────────────────────────────
function MessageRow({ msg, onOpen, onDelete }) {
  const isContact = msg.type === "contact";
  const title  = isContact ? msg.name : msg.orgName;
  const sub    = isContact ? (msg.subject || "(No subject)") : `${msg.partnershipType} · ${msg.contactName}`;
  const badge  = isContact
    ? { label: "Contact", bg: "#dbeafe", c: "#1e3a5f" }
    : { label: "Partner", bg: "#ede9fe", c: "#5b21b6" };

  return (
    <div className={`am-msg-row ${msg.read ? "" : "unread"}`} onClick={() => onOpen(msg)}>
      {!msg.read && <span className="am-msg-dot" />}
      <div className="am-msg-avatar">{(title || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</div>
      <div className="am-msg-body">
        <div className="am-msg-top">
          <span className="am-msg-title">{title}</span>
          <span className="am-msg-type-badge" style={{ background: badge.bg, color: badge.c }}>{badge.label}</span>
        </div>
        <div className="am-msg-sub">{sub}</div>
        <div className="am-msg-snippet">{msg.message}</div>
      </div>
      <div className="am-msg-right">
        <span className="am-msg-date">{formatDateTime(msg.createdAt)}</span>
        <button
          className="am-btn-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(msg); }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ── Message detail modal ───────────────────────────────────
function MessageDetailModal({ msg, onClose }) {
  const isContact = msg.type === "contact";
  return (
    <div className="am-modal-overlay" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-modal-header">
          <h3>{isContact ? "Contact Enquiry" : "Partnership Inquiry"}</h3>
          <button className="am-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="am-msg-detail">
          {isContact ? (
            <>
              <div className="am-detail-row"><strong>Name:</strong> {msg.name}</div>
              <div className="am-detail-row"><strong>Email:</strong> {msg.email}</div>
              {msg.phone && <div className="am-detail-row"><strong>Phone:</strong> {msg.phone}</div>}
              <div className="am-detail-row"><strong>Subject:</strong> {msg.subject}</div>
            </>
          ) : (
            <>
              <div className="am-detail-row"><strong>Organization:</strong> {msg.orgName}</div>
              <div className="am-detail-row"><strong>Contact Person:</strong> {msg.contactName}</div>
              <div className="am-detail-row"><strong>Email:</strong> {msg.email}</div>
              <div className="am-detail-row"><strong>Partnership Type:</strong> {msg.partnershipType}</div>
            </>
          )}
          <div className="am-detail-row"><strong>Received:</strong> {formatDateTime(msg.createdAt)}</div>

          <div className="am-detail-message">
            <strong>Message:</strong>
            <p>{msg.message}</p>
          </div>
        </div>

        <div className="am-modal-actions">
          <button className="am-btn-secondary" onClick={onClose}>Close</button>
          <a className="am-btn-primary" href={`mailto:${msg.email}`}>✉️ Reply by Email</a>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN ADMIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [advocates, setAdvocates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("pending"); // pending | all | messages
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [msgTypeFilter, setMsgTypeFilter] = useState("all"); // all | contact | partner

  const [editing, setEditing] = useState(null);       // advocate being edited, or null
  const [adding, setAdding] = useState(false);         // add-new modal open?
  const [deleting, setDeleting] = useState(null);      // advocate pending delete confirm
  const [openMessage, setOpenMessage] = useState(null); // message being viewed
  const [deletingMsg, setDeletingMsg] = useState(null); // message pending delete confirm

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");
  }, []);

  const refreshAdvocates = () => setAdvocates(getAdvocates());
  const refreshMessages  = () => setMessages(getMessages());

  useEffect(() => {
    if (authed) {
      refreshAdvocates();
      refreshMessages();
    }
  }, [authed]);

  // Pick up new submissions if Contact/Partners were filled out in another tab
  useEffect(() => {
    if (!authed) return;
    const onFocus = () => { refreshAdvocates(); refreshMessages(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [authed]);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
  };

  const pending  = useMemo(() => advocates.filter(a => a.status === "pending"), [advocates]);
  const approved = useMemo(() => advocates.filter(a => a.status === "approved"), [advocates]);
  const rejected = useMemo(() => advocates.filter(a => a.status === "rejected"), [advocates]);
  const unreadMessages = useMemo(() => messages.filter(m => !m.read), [messages]);

  const visibleAll = useMemo(() => {
    let list = advocates;
    if (statusFilter !== "all") list = list.filter(a => a.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.city || "").toLowerCase().includes(q) ||
        (a.speciality || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [advocates, statusFilter, search]);

  const visibleMessages = useMemo(() => {
    let list = messages;
    if (msgTypeFilter !== "all") list = list.filter(m => m.type === msgTypeFilter);
    return list;
  }, [messages, msgTypeFilter]);

  const handleApprove = (id) => { approveAdvocate(id); refreshAdvocates(); };
  const handleReject  = (id) => { rejectAdvocate(id); refreshAdvocates(); };

  const handleSaveNew = (form) => {
    addAdvocate(form);
    setAdding(false);
    refreshAdvocates();
  };

  const handleSaveEdit = (form) => {
    updateAdvocate(editing.id, form);
    setEditing(null);
    refreshAdvocates();
  };

  const handleConfirmDelete = () => {
    deleteAdvocate(deleting.id);
    setDeleting(null);
    refreshAdvocates();
  };

  const handleOpenMessage = (msg) => {
    if (!msg.read) {
      markAsRead(msg.id);
      refreshMessages();
    }
    setOpenMessage(msg);
  };

  const handleConfirmDeleteMessage = () => {
    deleteMessage(deletingMsg.id);
    setDeletingMsg(null);
    refreshMessages();
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="am-page">
      <div className="am-topbar">
        <Link to="/" className="am-logo">
          <span style={{ color: "#2563eb", fontWeight: 800 }}>Law</span>
          <span style={{ color: "#dc2626", fontWeight: 800 }}>4</span>
          <span style={{ color: "#16a34a", fontWeight: 800 }}>u</span>
          <span className="am-logo-tag">Admin</span>
        </Link>
        <button className="am-logout-btn" onClick={handleLogout}>
          Logout ↩
        </button>
      </div>

      <div className="am-container">

        {/* ── Stats ── */}
        <div className="am-stats-row">
          <StatCard icon="⚖️" label="Total Advocates" value={advocates.length} />
          <StatCard icon="⏳" label="Pending Approval" value={pending.length} tone="am-tone-warn" />
          <StatCard icon="✅" label="Approved" value={approved.length} tone="am-tone-good" />
          <StatCard icon="✉️" label="Unread Messages" value={unreadMessages.length} tone="am-tone-warn" />
        </div>

        {/* ── Tabs ── */}
        <div className="am-tabs">
          <button className={`am-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
            Pending Approvals {pending.length > 0 && <span className="am-tab-badge">{pending.length}</span>}
          </button>
          <button className={`am-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
            All Advocates
          </button>
          <button className={`am-tab ${tab === "messages" ? "active" : ""}`} onClick={() => setTab("messages")}>
            Messages {unreadMessages.length > 0 && <span className="am-tab-badge">{unreadMessages.length}</span>}
          </button>
        </div>

        {/* ── Pending Approvals tab ── */}
        {tab === "pending" && (
          <div className="am-section">
            {pending.length === 0 ? (
              <div className="am-empty">🎉 No pending applications right now.</div>
            ) : (
              <div className="am-pending-grid">
                {pending.map((adv) => (
                  <PendingCard
                    key={adv.id}
                    adv={adv}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onEdit={setEditing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── All Advocates tab ── */}
        {tab === "all" && (
          <div className="am-section">
            <div className="am-toolbar">
              <input
                className="am-search"
                placeholder="Search by name, email, city, speciality…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="am-status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="am-btn-primary" onClick={() => setAdding(true)}>+ Add Advocate</button>
            </div>

            {visibleAll.length === 0 ? (
              <div className="am-empty">No advocates match your search.</div>
            ) : (
              <div className="am-list">
                {visibleAll.map((adv) => (
                  <AdvocateRow key={adv.id} adv={adv} onEdit={setEditing} onDelete={setDeleting} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Messages tab ── */}
        {tab === "messages" && (
          <div className="am-section">
            <div className="am-toolbar">
              <div className="am-msg-filter-tabs">
                {["all", "contact", "partner"].map((f) => (
                  <button
                    key={f}
                    className={`am-msg-filter-tab ${msgTypeFilter === f ? "active" : ""}`}
                    onClick={() => setMsgTypeFilter(f)}
                  >
                    {f === "all" ? "All" : f === "contact" ? "Contact" : "Partners"}
                  </button>
                ))}
              </div>
            </div>

            {visibleMessages.length === 0 ? (
              <div className="am-empty">📭 No messages yet. Submissions from the Contact and Partners pages will show up here.</div>
            ) : (
              <div className="am-msg-list">
                {visibleMessages.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    onOpen={handleOpenMessage}
                    onDelete={setDeletingMsg}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {adding && (
        <AdvocateFormModal
          initial={null}
          onClose={() => setAdding(false)}
          onSave={handleSaveNew}
        />
      )}

      {editing && (
        <AdvocateFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          label="Delete this advocate?"
          itemName={`${deleting.name}'s account`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {openMessage && (
        <MessageDetailModal
          msg={openMessage}
          onClose={() => setOpenMessage(null)}
        />
      )}

      {deletingMsg && (
        <ConfirmDeleteModal
          label="Delete this message?"
          itemName="this message"
          onCancel={() => setDeletingMsg(null)}
          onConfirm={handleConfirmDeleteMessage}
        />
      )}
    </div>
  );
}