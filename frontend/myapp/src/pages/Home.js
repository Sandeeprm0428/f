// Home.js — Law4u Main Page (7 sections)
import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import AdvocatesList from "./AdvocatesList";
import { getAdvocates } from "../data/Advocatesstore";


const PRACTICE_TYPES = [
  { icon:"👨‍👩‍👧",       label:"Person / Family",        desc:"Divorce, custody, marriage, adoption, maintenance" },
  { icon:"🔒",      label:"Criminal / Property",   desc:"FIR, bail, property disputes, POCSO, cybercrime" },
  { icon:"⚖️",      label:"Civil / Debt Matter",   desc:"Civil suits, debt recovery, money recovery, NI Act" },
  { icon:"🏢",      label:"Corporate Law",          desc:"Company registration, GST, tax, compliance, IPR" },
];

// Read through advocatesStore (not raw advocates.json) so ids stay
// consistent with Login.js / AdvocateDashboard.js / Profile.js.
// Only "approved" advocates are shown publicly.
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

const FAQS = [
  { q:"What is Advocates Hub?",                              a:"Advocates Hub is India's best legal platform connecting citizens with trusted advocates and providing legal information, bare acts, and AI-powered legal guidance." },
  { q:"How do I find a lawyer on Advocates Hub?",            a:"Use the 'Find A Lawyer' section to search by city, practice area, or legal issue. Browse profiles, check ratings, and connect directly." },
  { q:"Is consulting a lawyer on Advocates Hub free?",       a:"Initial consultation charges vary by advocate. Many offer free first consultations. You can check individual advocate profiles for their fee structure." },
  { q:"Can I get legal advice online?",              a:"Yes! Advocates Hub provides an AI-powered Legal Advisor and also lets you post legal questions that experienced advocates can answer." },
  { q:"What types of lawyers are available?",        a:"Criminal, family, property, civil, corporate, tax, consumer, cyber, immigration, labour, and many more practice areas are covered." },
];

const HOW_IT_WORKS = [
  { step:"01", icon:"🔍", title:"Search",       desc:"Select your city and legal issue to find matching advocates in your area." },
  { step:"02", icon:"👤", title:"Choose",        desc:"View advocate profiles, experience, ratings, and fees. Pick the best fit." },
  { step:"03", icon:"💬", title:"Connect",       desc:"Chat, call, or schedule a consultation directly with your chosen advocate." },
  { step:"04", icon:"✅", title:"Resolve",       desc:"Get expert legal guidance and resolve your matter with confidence." },
];

const STATS = [
  { value:"50,000+", label:"Registered Advocates" },
  { value:"5 Lakh+", label:"Happy Clients"         },
  { value:"700+",    label:"Cities Covered"         },
  { value:"4.9★",    label:"Average Rating"         },
];

export default function Home() {
  const navigate   = useNavigate();
  const [city,     setCity]     = useState("");
  const [practice, setPractice] = useState("");
  const [openFaq,  setOpenFaq]  = useState(null);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [showAllAdvocates, setShowAllAdvocates] = useState(false);
  const [searchResults, setSearchResults] = useState(ADVOCATES.slice(0, 6));

  const filterAdvocates = (selectedCity = "", selectedPractice = "") => {
    return ADVOCATES.filter((person) => {
      const cityMatch = !selectedCity || normalize(person.city) === normalize(selectedCity);
      const practiceMatch = !selectedPractice || normalize(person.practiceArea) === normalize(selectedPractice);
      return cityMatch && practiceMatch;
    });
  };

  const handleSearch = () => {
    const results = filterAdvocates(city, practice);
    setShowAllAdvocates(false);
    setSearchResults(results.slice(0, 6));
    setSelectedAdvocate(null);

    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (practice) params.set("area", practice);
    navigate(`/find-lawyer?${params.toString()}`);
  };

  const handlePopularClick = (value) => {
    setPractice(value);
    const results = filterAdvocates(city, value);
    setShowAllAdvocates(false);
    setSearchResults(results.slice(0, 6));
    setSelectedAdvocate(null);
  };

  const handleSeeMoreAdvocates = () => {
    const nextShowAll = !showAllAdvocates;
    setShowAllAdvocates(nextShowAll);
    setSelectedAdvocate(null);

    const results = filterAdvocates(city, practice);
    setSearchResults(nextShowAll ? results : results.slice(0, 6));
  };

  return (
    <div className="home-page">

      {/* ── SECTION 1: Hero ── */}
      <section className="lw-hero">
        <div className="lw-hero-inner">
          <div className="lw-hero-text">
            <div className="lw-hero-badge">100% Best Indian Law Platform</div>
            <h1 className="lw-hero-title">
              Advocates Hub – Find Trusted<br/>Advocates
            </h1>
            <h2 className="lw-hero-sub">
              Get Expert Legal Advice & Learn<br/>Indian Law Easily
            </h2>
            <p className="lw-hero-desc">
              Advocates Hub helps you find advocates, understand Indian laws, and learn your legal rights. Explore justice, legal updates, and expert guidance in one app.
            </p>
            <div className="lw-hero-btns">
              <button className="lw-btn-primary" onClick={() => navigate("/AdvocatesList")}>
                Talk with Advocate
              </button>
              <button className="lw-btn-outline" onClick={() => navigate("/download")}>
                Download the App
              </button>
            </div>
          </div>
          <div className="lw-hero-phone">
            <div className="lw-phone-frame">
              <div className="lw-phone-notch" />
              <div className="lw-phone-status">
                <span>12:40</span>
                <span>📶 5G</span>
              </div>
              <div className="lw-phone-screen">
                <div className="lw-phone-header">
                  <span style={{fontSize:11,color:"#555"}}>☰</span>
                  <div style={{fontSize:13,fontWeight:700}}><span style={{color:"#2563eb"}}>Advocates</span><span style={{color:"#dc2626"}}> Hub</span></div>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"#2563eb",color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>V</div>
                </div>
                {[
                  {icon:"📜",title:"COI",sub:"The Constitution of India"},
                  {icon:"📚",title:"Bare Acts",sub:"BNS, BNSS, BSA, pocso, etc...",badge:"Updated"},
                  {icon:"❓",title:"Question Answer",sub:"Legal Question & Answer"},
                ].map(item=>(
                  <div key={item.title} className="lw-phone-item">
                    <span style={{fontSize:20}}>{item.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600}}>{item.title}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>{item.sub}</div>
                    </div>
                    {item.badge&&<span style={{background:"#16a34a",color:"#fff",fontSize:9,padding:"1px 5px",borderRadius:4}}>{item.badge}</span>}
                    <span style={{color:"#9ca3af",fontSize:14}}>›</span>
                  </div>
                ))}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,padding:"4px 8px"}}>
                  {["⚖️ Judgment","🤖 Judgment AI","💬 Legal advice","📄 11000+ Drafting","📋 New Act","📋 Old Act"].map(item=>(
                    <div key={item} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:6,padding:"6px 8px",fontSize:10,fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
                      {item} <span style={{marginLeft:"auto",color:"#9ca3af"}}>›</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<AdvocatesList 
  searchResults={searchResults}
  showAllAdvocates={showAllAdvocates}
  handleSeeMoreAdvocates={handleSeeMoreAdvocates}
  getAvatarColor={getAvatarColor}
  getInitials={getInitials}
/>

      {/* ── SECTION 3: Practice Types ── */}
      <section className="lw-section lw-practice-section">
        <div className="lw-section-inner">
          <div className="lw-section-head">
            <h2 className="lw-section-title">Find A Lawyer By Category</h2>
            <p className="lw-section-sub">Choose your legal matter type to find the right advocate</p>
          </div>
          <div className="lw-practice-grid">
            {PRACTICE_TYPES.map(pt => (
              <button key={pt.label} className="lw-practice-card"
                onClick={() => navigate(`/find-lawyer?cat=${pt.label.toLowerCase().replace(/\s+/g,"-")}`)}>
                <span className="lw-practice-icon">{pt.icon}</span>
                <div className="lw-practice-label">{pt.label}</div>
                <div className="lw-practice-desc">{pt.desc}</div>
                <div className="lw-practice-cta">Find Lawyers →</div>
              </button>
            ))}
          </div>
          <div className="lw-talk-row">
            <button className="lw-btn-primary lw-btn-lg" onClick={() => navigate("/AdvocatesList")}>
              💬 Talk to Lawyer Next
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Stats ── */}
      <section className="lw-stats-section">
        <div className="lw-section-inner">
          <div className="lw-stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="lw-stat-card">
                <div className="lw-stat-value">{s.value}</div>
                <div className="lw-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ── SECTION 6: How It Works ── */}
      <section className="lw-section lw-how-section">
        <div className="lw-section-inner">
          <div className="lw-section-head" style={{textAlign:"center"}}>
            <h2 className="lw-section-title">How Advocates Hub Works</h2>
            <p className="lw-section-sub">Get legal help in 4 simple steps</p>
          </div>
          <div className="lw-how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="lw-how-card">
                <div className="lw-how-step">{step.step}</div>
                <div className="lw-how-icon">{step.icon}</div>
                <div className="lw-how-title">{step.title}</div>
                <div className="lw-how-desc">{step.desc}</div>
                {i < HOW_IT_WORKS.length - 1 && <div className="lw-how-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQs ── */}
      <section className="lw-section">
        <div className="lw-section-inner lw-narrow">
          <div className="lw-section-head" style={{textAlign:"center"}}>
            <h2 className="lw-section-title">Frequently Asked Questions</h2>
            <p className="lw-section-sub">Everything you need to know about Advocates Hub</p>
          </div>
          <div className="lw-faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`lw-faq-item ${openFaq === i ? "open" : ""}`}>
                <button className="lw-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="lw-faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="lw-faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedAdvocate && (
        <div className="lw-detail-overlay" onClick={() => setSelectedAdvocate(null)}>
          <div className="lw-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lw-detail-close" type="button" onClick={() => setSelectedAdvocate(null)}>×</button>
            <div className="lw-detail-header">
              <div
                className="lw-detail-avatar"
                style={{ background: selectedAdvocate.avatar ? 'transparent' : getAvatarColor(selectedAdvocate.name) }}
              >
                {selectedAdvocate.avatar ? (
                  <img src={selectedAdvocate.avatar} alt={selectedAdvocate.name} className="lw-detail-avatar-img" />
                ) : (
                  getInitials(selectedAdvocate.name)
                )}
              </div>
              <div>
                <div className="lw-detail-name">{selectedAdvocate.name}</div>
                <div className="lw-detail-speciality">{selectedAdvocate.speciality}</div>
                <div className="lw-detail-meta">{selectedAdvocate.city} · {selectedAdvocate.experience}</div>
              </div>
            </div>

            <div className="lw-detail-grid">
              <div className="lw-detail-box">
                <span>Rating</span>
                <strong>⭐ {selectedAdvocate.rating}</strong>
              </div>
              <div className="lw-detail-box">
                <span>Cases</span>
                <strong>{selectedAdvocate.cases}</strong>
              </div>
              <div className="lw-detail-box">
                <span>Fee</span>
                <strong>{selectedAdvocate.fee}</strong>
              </div>
              <div className="lw-detail-box">
                <span>Availability</span>
                <strong>{selectedAdvocate.availability}</strong>
              </div>
            </div>

            <div className="lw-detail-section">
              <h4>About</h4>
              <p>{selectedAdvocate.bio}</p>
            </div>

            <div className="lw-detail-section">
              <h4>Languages</h4>
              <div className="lw-detail-tags">
                {selectedAdvocate.languages.map((lang) => (
                  <span key={lang} className="lw-detail-tag">{lang}</span>
                ))}
              </div>
            </div>

            <div className="lw-detail-contact">
              <div>
                <span>Phone</span>
                <strong>{selectedAdvocate.phone}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedAdvocate.email}</strong>
              </div>
            </div>

            <div className="lw-detail-actions">
              <button type="button" className="lw-btn-primary" onClick={() => navigate(`/profile/${selectedAdvocate.id}`)}>
                Book Consultation
              </button>
              <button type="button" className="lw-btn-outline-dark" onClick={() => setSelectedAdvocate(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer strip */}
      <footer className="lw-footer">
        <div className="lw-section-inner">
          <div className="lw-footer-logo">
            <span style={{color:"#2563eb",fontWeight:800}}>Advocates</span>
            <span style={{color:"#dc2626",fontWeight:800}}> Hub</span>
          </div>
          <p className="lw-footer-tagline">India's Most Trusted Legal Platform</p>
          <div className="lw-footer-links">
            {[
              "Privacy Policy",
              "Terms of Use",
              "Contact Us",
              "About Us",
              "Lawyer Signup",
            ].map((l) => (
              <button key={l} type="button" className="lw-footer-link">
                {l}
              </button>
            ))}
          </div>
          <p className="lw-footer-copy">© 2026 Advocates Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}