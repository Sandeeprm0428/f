// Home.js — Law4u Main Page with Chatbot
import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";

const CITIES = ["Bengaluru","Mumbai","Delhi","Chennai","Hyderabad","Kolkata",
  "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Kochi","Bhopal","Nagpur","Surat"];

const PRACTICE_AREAS = ["Divorce","Criminal","Property","Cheque Bounce","Civil",
  "GST","Tax","Corporate","Family","Labour","Consumer","Cyber","Immigration","Banking","Intellectual Property"];

const POPULAR = ["Divorce","Criminal","Property","Cheque Bounce","Civil","GST","Tax"];

const PRACTICE_TYPES = [
  { icon:"👨‍👩‍👧", label:"Person / Family",      desc:"Divorce, custody, marriage, adoption, maintenance" },
  { icon:"🔒",     label:"Criminal / Property",  desc:"FIR, bail, property disputes, POCSO, cybercrime"  },
  { icon:"⚖️",     label:"Civil / Debt Matter",  desc:"Civil suits, debt recovery, money recovery, NI Act"},
  { icon:"🏢",     label:"Corporate Law",         desc:"Company registration, GST, tax, compliance, IPR"  },
];

const ADVOCATES = [
  { name:"Adv. Rajesh Kumar", exp:"12 yrs", location:"Delhi",     rating:4.9, cases:340, speciality:"Criminal Law",  initials:"RK", color:"#2563eb" },
  { name:"Adv. Priya Sharma", exp:"8 yrs",  location:"Bengaluru", rating:4.8, cases:215, speciality:"Family Law",    initials:"PS", color:"#16a34a" },
  { name:"Adv. Amit Verma",   exp:"15 yrs", location:"Mumbai",    rating:4.9, cases:480, speciality:"Property Law",  initials:"AV", color:"#7c3aed" },
  { name:"Adv. Sneha Nair",   exp:"6 yrs",  location:"Chennai",   rating:4.7, cases:145, speciality:"Corporate Law", initials:"SN", color:"#dc2626" },
  { name:"Adv. Rohit Gupta",  exp:"10 yrs", location:"Hyderabad", rating:4.8, cases:290, speciality:"Civil Law",     initials:"RG", color:"#ea580c" },
  { name:"Adv. Ananya Singh", exp:"9 yrs",  location:"Pune",      rating:4.9, cases:320, speciality:"Tax Law",       initials:"AS", color:"#0891b2" },
];

const FAQS = [
  { q:"What is Law4u?",                              a:"Law4u is India's best legal platform connecting citizens with trusted advocates and providing legal information, bare acts, and AI-powered legal guidance." },
  { q:"How do I find a lawyer on Law4u?",            a:"Use the 'Find A Lawyer' section to search by city, practice area, or legal issue. Browse profiles, check ratings, and connect directly." },
  { q:"Is consulting a lawyer on Law4u free?",       a:"Initial consultation charges vary by advocate. Many offer free first consultations. You can check individual advocate profiles for their fee structure." },
  { q:"Can I get legal advice online?",              a:"Yes! Law4u provides an AI-powered Legal Advisor and also lets you post legal questions that experienced advocates can answer." },
  { q:"What types of lawyers are available?",        a:"Criminal, family, property, civil, corporate, tax, consumer, cyber, immigration, labour, and many more practice areas are covered." },
];

const HOW_IT_WORKS = [
  { step:"01", icon:"🔍", title:"Search",  desc:"Select your city and legal issue to find matching advocates in your area."           },
  { step:"02", icon:"👤", title:"Choose",  desc:"View advocate profiles, experience, ratings, and fees. Pick the best fit."           },
  { step:"03", icon:"💬", title:"Connect", desc:"Chat, call, or schedule a consultation directly with your chosen advocate."          },
  { step:"04", icon:"✅", title:"Resolve", desc:"Get expert legal guidance and resolve your matter with confidence."                  },
];

const STATS = [
  { value:"50,000+", label:"Registered Advocates" },
  { value:"5 Lakh+", label:"Happy Clients"         },
  { value:"700+",    label:"Cities Covered"         },
  { value:"4.9★",    label:"Average Rating"         },
];

export default function Home() {
  const navigate   = useNavigate();
  const [city,     setCity]    = useState("");
  const [practice, setPractice]= useState("");
  const [openFaq,  setOpenFaq] = useState(null);

  const handleSearch = () => {
    if (!city && !practice) { alert("Please select a city or practice area"); return; }
    const params = new URLSearchParams();
    if (city)     params.set("city", city);
    if (practice) params.set("area", practice);
    navigate(`/advocates-list?${params.toString()}`);
  };

  return (
    <div className="home-page">

      {/* ── SECTION 1: Hero ── */}
      <section className="lw-hero">
        <div className="lw-hero-inner">
          <div className="lw-hero-text">
            <div className="lw-hero-badge">100% Best Indian Law Platform</div>
            <h1 className="lw-hero-title">Law4u – Find Trusted<br/>Advocates</h1>
            <h2 className="lw-hero-sub">Get Expert Legal Advice &amp; Learn<br/>Indian Law Easily</h2>
            <p className="lw-hero-desc">
              Law4u helps you find advocates, understand Indian laws, and learn your legal rights.
              Explore justice, legal updates, and expert guidance in one app.
            </p>
            <div className="lw-hero-btns">
              <button className="lw-btn-primary" onClick={() => navigate("/talk-to-advocate")}>Talk with Advocate</button>
              <button className="lw-btn-outline" onClick={() => navigate("/advocates-list")}>Find Advocates</button>
            </div>

            {/* ── AI Chatbot CTA ── */}
            <div className="lw-chatbot-cta">
              <div className="lw-chatbot-cta-icon">🤖</div>
              <div className="lw-chatbot-cta-text">
                <strong>AI Legal Assistant</strong>
                <span>Ask me anything about law, advocates, or navigate to any page</span>
              </div>
              <div className="lw-chatbot-cta-arrow">→ Chat below ↘</div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="lw-hero-phone">
            <div className="lw-phone-frame">
              <div className="lw-phone-notch" />
              <div className="lw-phone-status">
                <span>12:40</span><span>📶 5G</span>
              </div>
              <div className="lw-phone-screen">
                <div className="lw-phone-header">
                  <span style={{fontSize:11,color:"#555"}}>☰</span>
                  <div style={{fontSize:13,fontWeight:700}}>
                    <span style={{color:"#2563eb"}}>Law</span>
                    <span style={{color:"#dc2626"}}>4</span>
                    <span style={{color:"#16a34a"}}>u</span>
                    <span style={{fontSize:10,color:"#888"}}> Law of India</span>
                  </div>
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
                  {["⚖️ Judgment","🤖 AI","💬 Legal advice","📄 Drafting","📋 New Act","📋 Old Act"].map(item=>(
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

      {/* ── SECTION 2: Search ── */}
      <section className="lw-search-section">
        <p className="lw-search-headline">
          Hire India's best and most trusted lawyers for District Court, High Court, and Supreme Court cases with Law4u
        </p>
        <div className="lw-search-bar">
          <div className="lw-search-field">
            <span className="lw-search-field-icon">📍</span>
            <select value={city} onChange={e=>setCity(e.target.value)} className="lw-select">
              <option value="">Select City</option>
              {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="lw-search-field">
            <span className="lw-search-field-icon">🏛️</span>
            <select value={practice} onChange={e=>setPractice(e.target.value)} className="lw-select">
              <option value="">Select Practice Area</option>
              {PRACTICE_AREAS.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button className="lw-search-btn" onClick={handleSearch}>SEARCH</button>
        </div>
        <div className="lw-popular-searches">
          <strong>Popular: </strong>
          {POPULAR.map((p,i)=>(
            <span key={p}>
              <span className="lw-popular-tag" onClick={()=>setPractice(p)}>{p}</span>
              {i<POPULAR.length-1 && " · "}
            </span>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: Practice Types ── */}
      <section className="lw-section lw-practice-section">
        <div className="lw-section-inner">
          <div className="lw-section-head">
            <h2 className="lw-section-title">Find A Lawyer By Category</h2>
            <p className="lw-section-sub">Choose your legal matter type to find the right advocate</p>
          </div>
          <div className="lw-practice-grid">
            {PRACTICE_TYPES.map(pt=>(
              <button key={pt.label} className="lw-practice-card"
                onClick={()=>navigate(`/advocates-list?cat=${pt.label.toLowerCase().replace(/\s+/g,"-")}`)}>
                <span className="lw-practice-icon">{pt.icon}</span>
                <div className="lw-practice-label">{pt.label}</div>
                <div className="lw-practice-desc">{pt.desc}</div>
                <div className="lw-practice-cta">Find Lawyers →</div>
              </button>
            ))}
          </div>
          <div className="lw-talk-row">
            <button className="lw-btn-primary lw-btn-lg" onClick={()=>navigate("/talk-to-advocate")}>
              💬 Talk to Lawyer Next
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Stats ── */}
      <section className="lw-stats-section">
        <div className="lw-section-inner">
          <div className="lw-stats-grid">
            {STATS.map(s=>(
              <div key={s.label} className="lw-stat-card">
                <div className="lw-stat-value">{s.value}</div>
                <div className="lw-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Advocates ── */}
      <section className="lw-section">
        <div className="lw-section-inner">
          <div className="lw-section-head lw-flex-between">
            <div>
              <h2 className="lw-section-title">Meet Our Advocates</h2>
              <p className="lw-section-sub">Connect with experienced lawyers across India through Law4u.</p>
            </div>
            <button className="lw-btn-primary" onClick={()=>navigate("/advocates-list")}>See More →</button>
          </div>
          <div className="lw-advocates-grid">
            {ADVOCATES.map(adv=>(
              <div key={adv.name} className="lw-adv-card" onClick={()=>navigate("/talk-to-advocate")}>
                <div className="lw-adv-top">
                  <div className="lw-adv-avatar" style={{background:adv.color}}>{adv.initials}</div>
                  <div className="lw-adv-info">
                    <div className="lw-adv-name">{adv.name}</div>
                    <div className="lw-adv-spec">{adv.speciality}</div>
                    <div className="lw-adv-meta">{adv.location} · {adv.exp}</div>
                  </div>
                </div>
                <div className="lw-adv-stats">
                  <span className="lw-adv-rating">⭐ {adv.rating}</span>
                  <span className="lw-adv-cases">{adv.cases} cases</span>
                </div>
                <button className="lw-adv-btn">Consult Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CHATBOT SECTION ── */}
      <section className="lw-section lw-chatbot-section">
        <div className="lw-section-inner" style={{textAlign:"center"}}>
          <div className="lw-chatbot-banner">
            <div className="lw-chatbot-banner-icon">🤖⚖️</div>
            <h2 className="lw-chatbot-banner-title">AI Legal Assistant</h2>
            <p className="lw-chatbot-banner-desc">
              Ask our AI assistant to find advocates, navigate to any page, answer legal questions,
              or open advocate profiles — all from one chat window.
            </p>
            <div className="lw-chatbot-demo-queries">
              {[
                "Find criminal lawyers in Delhi",
                "Open profile of Adv. Priya Sharma",
                "What is anticipatory bail?",
                "Show me all family lawyers",
                "Go to Bare Acts",
              ].map(q=>(
                <span key={q} className="lw-chatbot-demo-q">"{q}"</span>
              ))}
            </div>
            <div className="lw-chatbot-banner-cta">
              👉 Click the <strong>⚖️ button</strong> at the bottom-right corner to start chatting!
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: How it works ── */}
      <section className="lw-section lw-how-section">
        <div className="lw-section-inner">
          <div className="lw-section-head" style={{textAlign:"center"}}>
            <h2 className="lw-section-title">How Law4u Works</h2>
            <p className="lw-section-sub">Get legal help in 4 simple steps</p>
          </div>
          <div className="lw-how-grid">
            {HOW_IT_WORKS.map((step,i)=>(
              <div key={step.step} className="lw-how-card">
                <div className="lw-how-step">{step.step}</div>
                <div className="lw-how-icon">{step.icon}</div>
                <div className="lw-how-title">{step.title}</div>
                <div className="lw-how-desc">{step.desc}</div>
                {i<HOW_IT_WORKS.length-1 && <div className="lw-how-arrow">→</div>}
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
            <p className="lw-section-sub">Everything you need to know about Law4u</p>
          </div>
          <div className="lw-faq-list">
            {FAQS.map((faq,i)=>(
              <div key={i} className={`lw-faq-item ${openFaq===i?"open":""}`}>
                <button className="lw-faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  {faq.q}
                  <span className="lw-faq-icon">{openFaq===i?"−":"+"}</span>
                </button>
                {openFaq===i && <div className="lw-faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lw-footer">
        <div className="lw-section-inner">
          <div className="lw-footer-logo">
            <span style={{color:"#2563eb",fontWeight:800}}>Law</span>
            <span style={{color:"#dc2626",fontWeight:800}}>4</span>
            <span style={{color:"#16a34a",fontWeight:800}}>u</span>
          </div>
          <p className="lw-footer-tagline">India's Most Trusted Legal Platform</p>
          <div className="lw-footer-links">
            {["Privacy Policy","Terms of Use","Contact Us","About Us","Lawyer Signup"].map(l=>(
              <a key={l} href="#" className="lw-footer-link">{l}</a>
            ))}
          </div>
          <p className="lw-footer-copy">© 2026 Law4u. All rights reserved.</p>
        </div>
      </footer>

      {/* ── FLOATING CHATBOT — renders on every page via App.js ── */}
      <Chatbot />
    </div>
  );
}