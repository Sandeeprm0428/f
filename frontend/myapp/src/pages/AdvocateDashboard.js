// ============================================================
//  AdvocateDashboard.js  —  Law4u Advocate Account Page
//  Shows the logged-in advocate's own profile (from advocatesStore)
//  plus a list of REAL client "connection requests" sent to them
//  via Profile.js's "Book Consultation" form.
//
//  No demo/fake data is seeded here — if an advocate has no
//  requests yet, the list is simply empty until a real client
//  books a consultation.
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdvocateDashboard.css";
import { getAdvocateById } from "../data/Advocatesstore";

const SESSION_KEY  = "law4u_advocate_id";
const REQUESTS_KEY = "law4u_requests"; // { [advocateId]: Request[] }

function loadAllRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllRequests(all) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ── Small UI bits ─────────────────────────────────────────────
function StatBox({ icon, label, value }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-icon">{icon}</div>
      <div>
        <div className="ad-stat-value">{value}</div>
        <div className="ad-stat-label">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const MAP = {
    pending:  { label: "Pending",  bg: "#fef3c7", c: "#92400e" },
    accepted: { label: "Accepted", bg: "#dcfce7", c: "#14532d" },
    declined: { label: "Declined", bg: "#fee2e2", c: "#7f1d1d" },
  };
  const s = MAP[status] || MAP.pending;
  return <span className="ad-status-badge" style={{ background: s.bg, color: s.c }}>{s.label}</span>;
}

function RequestCard({ req, onAccept, onDecline }) {
  return (
    <div className="ad-request-card">
      <div className="ad-request-top">
        <div className="ad-request-avatar">{req.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
        <div className="ad-request-info">
          <div className="ad-request-name">{req.clientName}</div>
          <div className="ad-request-meta">
            {req.clientCity ? `${req.clientCity} · ` : ""}{formatDate(req.requestedAt)}
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {(req.clientPhone || req.clientEmail) && (
        <div className="ad-request-contact">
          {req.clientPhone && <span className="ad-request-contact-item">📱 {req.clientPhone}</span>}
          {req.clientEmail && <span className="ad-request-contact-item">✉️ {req.clientEmail}</span>}
        </div>
      )}

      <p className="ad-request-msg">{req.message}</p>

      {req.status === "pending" && (
        <div className="ad-request-actions">
          <button className="ad-btn-accept" onClick={() => onAccept(req.id)}>✓ Accept</button>
          <button className="ad-btn-decline" onClick={() => onDecline(req.id)}>✕ Decline</button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN ADVOCATE DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdvocateDashboard() {
  const navigate = useNavigate();
  const [advocateId, setAdvocateId] = useState(null);
  const [requests, setRequests]     = useState([]);
  const [filter, setFilter]         = useState("all"); // all | pending | accepted | declined
  const [ready, setReady]           = useState(false);

  // ── Resolve logged-in advocate from session/local storage ──
  useEffect(() => {
    const idStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!idStr) {
      navigate("/login");
      return;
    }
    setAdvocateId(Number(idStr));
    setReady(true);
  }, [navigate]);

  // Always read the live record — reflects any admin edits instantly
  const advocate = useMemo(
    () => (advocateId ? getAdvocateById(advocateId) : null),
    [advocateId]
  );

  // If the admin revoked approval while this advocate was logged in,
  // sign them out rather than showing a broken dashboard.
  useEffect(() => {
    if (ready && advocate && advocate.status !== "approved") {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      navigate("/login");
    }
  }, [ready, advocate, navigate]);

  // ── Load this advocate's REAL connection requests (no seeding) ──
  useEffect(() => {
    if (!advocateId) return;

    const refresh = () => {
      const all = loadAllRequests();
      setRequests(all[advocateId] || []);
    };

    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [advocateId]);

  const updateRequestStatus = (reqId, status) => {
    const all = loadAllRequests();
    const list = (all[advocateId] || []).map(r => r.id === reqId ? { ...r, status } : r);
    all[advocateId] = list;
    saveAllRequests(all);
    setRequests(list);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/login");
  };

  const filteredRequests = requests.filter(r => filter === "all" ? true : r.status === filter);
  const pendingCount = requests.filter(r => r.status === "pending").length;

  if (!ready) return null;

  if (!advocate) {
    return (
      <div className="ad-page">
        <div className="ad-card ad-notfound">
          <h2>Account not found</h2>
          <p>We couldn't find an advocate profile for this session.</p>
          <button className="ad-btn-primary" onClick={handleLogout}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-page">
      {/* ── Top bar ── */}
      <div className="ad-topbar">
        <Link to="/" className="ad-logo">
          <span style={{ color:"#2563eb", fontWeight:800 }}>Law</span>
          <span style={{ color:"#dc2626", fontWeight:800 }}>4</span>
          <span style={{ color:"#16a34a", fontWeight:800 }}>u</span>
        </Link>
        <button className="ad-logout-btn" onClick={handleLogout}>Logout ↩</button>
      </div>

      <div className="ad-container">

        {/* ── Profile card ── */}
        <div className="ad-card ad-profile-card">
          <div className="ad-profile-top">
            <div className="ad-avatar" style={{ background: advocate.avatar ? "transparent" : "#eff6ff" }}>
              {advocate.avatar ? (
                <img src={advocate.avatar} alt={advocate.name} className="ad-avatar-img" />
              ) : (
                advocate.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("")
              )}
            </div>
            <div className="ad-profile-main">
              <h1 className="ad-profile-name">{advocate.name}</h1>
              <p className="ad-profile-spec">{advocate.speciality} · {advocate.city}</p>
              <div className="ad-availability">🟢 {advocate.availability}</div>
            </div>
            <div className="ad-rating-pill">⭐ {advocate.rating}</div>
          </div>

          <p className="ad-bio">{advocate.bio}</p>

          <div className="ad-stats-row">
            <StatBox icon="📁" label="Cases Handled" value={advocate.cases} />
            <StatBox icon="⏳" label="Experience" value={advocate.experience} />
            <StatBox icon="💰" label="Fee" value={advocate.fee} />
            <StatBox icon="📨" label="Pending Requests" value={pendingCount} />
          </div>

          <div className="ad-contact-row">
            <div className="ad-contact-item">📱 {advocate.phone}</div>
            <div className="ad-contact-item">✉️ {advocate.email}</div>
          </div>

          <div className="ad-languages">
            {(advocate.languages || []).map(l => (
              <span key={l} className="ad-lang-chip">{l}</span>
            ))}
          </div>
        </div>

        {/* ── Connection requests ── */}
        <div className="ad-card ad-requests-card">
          <div className="ad-requests-header">
            <h2>Client Connection Requests</h2>
            <div className="ad-filter-tabs">
              {["all", "pending", "accepted", "declined"].map(f => (
                <button
                  key={f}
                  className={`ad-filter-tab ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="ad-empty">
              {filter === "all"
                ? "No consultation requests yet. When a client books a consultation on your profile, it'll show up here."
                : `No ${filter} requests to show.`}
            </div>
          ) : (
            <div className="ad-requests-list">
              {filteredRequests.map(req => (
                <RequestCard
                  key={req.id}
                  req={req}
                  onAccept={(id) => updateRequestStatus(id, "accepted")}
                  onDecline={(id) => updateRequestStatus(id, "declined")}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}