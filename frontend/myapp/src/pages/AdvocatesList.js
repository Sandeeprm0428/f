import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdvocates } from "../data/Advocatesstore";
import "./AdvocatesList.css";

const CITIES = ["Bengaluru","Gokak","Delhi","Hyderabad","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Kochi","Bhopal","Nagpur","Surat"];
const PRACTICE_AREAS = ["Divorce","Criminal","Property","Cheque Bounce","Civil","GST","Tax","Corporate","Family","Labour","Consumer","Cyber","Immigration","Banking","Intellectual Property"];
const POPULAR = ["Divorce","Criminal","Property","Cheque Bounce","Civil","GST","Tax"];

// Read through advocatesStore (not raw advocates.json) so the id
// used for profile links always matches the id AdvocateDashboard.js
// and Login.js look up by. Only "approved" advocates are shown to
// the public — pending/rejected signups stay hidden from clients.
const ADVOCATES = getAdvocates().filter((a) => a.status === "approved");

const normalize = (value = "") => value.toString().trim().toLowerCase();

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const getAvatarColor = (name = "") => {
  const palette = ["#2563eb", "#16a34a", "#7c3aed", "#dc2626", "#ea580c", "#0891b2", "#0f766e", "#9333ea"];
  const sum = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
};

export default function AdvocatesList() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [practice, setPractice] = useState("");
  const [showAllAdvocates, setShowAllAdvocates] = useState(false);

  // Keep track of all items that match the filters
  const [filteredResults, setFilteredResults] = useState(ADVOCATES);

  const filterAdvocates = (selectedCity = "", selectedPractice = "") => {
    return ADVOCATES.filter((person) => {
      const cityMatch = !selectedCity || normalize(person.city) === normalize(selectedCity);
      const personPractice = person.practiceArea || person.speciality || "";
      const practiceMatch = !selectedPractice || normalize(personPractice) === normalize(selectedPractice);
      return cityMatch && practiceMatch;
    });
  };

  const handleSearch = () => {
    const results = filterAdvocates(city, practice);
    setShowAllAdvocates(false); // Reset to collapsed view on a new search
    setFilteredResults(results);
  };

  const handlePopularClick = (value) => {
    setPractice(value);
    const results = filterAdvocates(city, value);
    setShowAllAdvocates(false); // Reset to collapsed view on a new filter tag click
    setFilteredResults(results);
  };

  const handleSeeMoreAdvocates = () => {
    setShowAllAdvocates((prev) => !prev);
  };

  // Only show more than 6 if there are more than 6 total matches AND the user clicked "See More"
  const displayedList = showAllAdvocates ? filteredResults : filteredResults.slice(0, 6);

  return (
    <div className="home-page">
      {/* ── Search Bar Section ── */}
      <section className="lw-search-section">
        <p className="lw-search-headline">
          Hire India's best and most trusted lawyers for District Court, High Court, and Supreme Court cases with Advocates Hub
        </p>
        <div className="lw-search-bar">
          <div className="lw-search-field">
            <span className="lw-search-field-icon">📍</span>
            <select value={city} onChange={e => setCity(e.target.value)} className="lw-select">
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="lw-search-field">
            <span className="lw-search-field-icon">🏛️</span>
            <select value={practice} onChange={e => setPractice(e.target.value)} className="lw-select">
              <option value="">Select Practice Areas</option>
              {PRACTICE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button className="lw-search-btn" onClick={handleSearch}>SEARCH</button>
        </div>
        <div className="lw-popular-searches">
          <strong>Popular Searches: </strong>
          {POPULAR.map((p, i) => (
            <span key={p}>
              <span className="lw-popular-tag" onClick={() => handlePopularClick(p)}>{p}</span>
              {i < POPULAR.length - 1 && " , "}
            </span>
          ))}
        </div>
      </section>

      {/* ── Advocates List Section ── */}
      <section className="lw-section">
        <div className="lw-section-inner">
          <div className="lw-section-head lw-flex-between">
            <div>
              <h2 className="lw-section-title">Meet Our Advocates</h2>
            </div>
            {/* Show button ONLY if there are more than 6 matches in total */}
            {filteredResults.length > 6 && (
              <button className="lw-btn-primary" onClick={handleSeeMoreAdvocates}>
                {showAllAdvocates ? "See Less Advocates" : "See More Advocates"} ›
              </button>
            )}
          </div>

          {displayedList.length === 0 ? (
            <div className="lw-no-results">
              No advocates found for the selected city and practice area.
            </div>
          ) : (
            <div className="lw-advocates-grid">
              {displayedList.map((adv) => (
                <div
                  key={adv.id}
                  className="lw-adv-card"
                  onClick={() => navigate(`/profile/${adv.id}`)}
                >
                  <div className="lw-adv-top">
                    <div
                      className="lw-adv-avatar"
                      style={{ background: adv.avatar ? 'transparent' : getAvatarColor(adv.name) }}
                    >
                      {adv.avatar ? (
                        <img src={adv.avatar} alt={adv.name} className="lw-adv-avatar-img" />
                      ) : (
                        getInitials(adv.name)
                      )}
                    </div>
                    <div className="lw-adv-info">
                      <div className="lw-adv-name">{adv.name}</div>
                      <div className="lw-adv-spec">{adv.speciality || adv.practiceArea}</div>
                      <div className="lw-adv-meta">{adv.city} · {adv.experience}</div>
                    </div>
                  </div>

                  <div className="lw-adv-stats">
                    <span className="lw-adv-rating">⭐ {adv.rating}</span>
                    <span className="lw-adv-cases">{adv.cases} cases</span>
                  </div>

                  <button
                    className="lw-adv-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${adv.id}`);
                    }}
                  >
                    Consult Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}