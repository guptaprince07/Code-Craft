import { useEffect, useRef } from "react";
import { D } from "./data.js";

/* Same scroll-in animation as the rest of the site (.reveal -> .reveal.in). */
function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll(".reveal"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-60px 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

const JOURNEY = [
  { label: "🧮 Aptitude Practice", pct: 85 },
  { label: "💻 Coding Challenges", pct: 70 },
  { label: "🌳 DSA Problems", pct: 60 },
  { label: "🎤 Mock Interviews", pct: 45 },
];

const STATS = [
  { value: "12K+", label: "Topics" },
  { value: "500+", label: "Companies" },
  { value: "1M+", label: "Students" },
];

const CATEGORIES = [
  { icon: "🧮", title: "Aptitude", href: "#/aptitude" },
  { icon: "💻", title: "Programming", href: "#/programming" },
  { icon: "🌳", title: "DSA", href: "#/programming" },
  { icon: "💼", title: "Core Subjects", href: "#/core" },
  { icon: "🎤", title: "HR Interview", href: "#/hr" },
];

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="reveal">
          <span className="hero-badge">🎓 #1 Placement Prep Platform</span>
          <h1>
            Master the Skills.
            <strong>Crack the Interview.</strong>
            Get Placed.
          </h1>
          <p className="hero-lead">
            Everything you need for aptitude, coding, DSA, interviews and company-specific
            placement preparation — all in one place.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#/aptitude">Start Preparing →</a>
            <a className="btn btn-outline" href="#/about">Learn More</a>
          </div>
        </div>

        <aside className="panel-card reveal" style={{ transitionDelay: "150ms" }}>
          <h2>Your Placement Journey</h2>
          {JOURNEY.map((row) => (
            <div className="progress-row" key={row.label}>
              <span>{row.label} <b>{row.pct}%</b></span>
              <span className="bar"><i style={{ "--pct": row.pct + "%" }} /></span>
            </div>
          ))}
          <div className="stat-strip">
            {STATS.map((s) => (
              <span key={s.label}><b>{s.value}</b>{s.label}</span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ModuleCard({ module, index }) {
  return (
    <article className="card module-card reveal" style={{ transitionDelay: index * 70 + "ms" }}>
      <div className="card-icon">{module.icon}</div>
      <h3>{module.title}</h3>
      <p className="desc">{module.description}</p>
      <a className="card-link" href={"#/module/" + module.id}>
        View Module <span>→</span>
      </a>
    </article>
  );
}

function Modules() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal">
          <h2>Demonstrable Modules</h2>
          <p>Explore four fully navigable modules with topic-wise guides, practice and quizzes.</p>
        </div>
        <div className="grid grid-3" id="moduleGrid">
          {D.moduleList.map((m, i) => (
            <ModuleCard module={m} index={i} key={m.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-head reveal">
          <h2>Everything You Need for Placement Preparation</h2>
          <p>
            Build the skills that companies look for and prepare confidently for every stage of
            the hiring process.
          </p>
        </div>
        <div className="grid grid-5" id="categoryGrid">
          {CATEGORIES.map((c, i) => (
            <a
              className="cat reveal"
              style={{ transitionDelay: i * 60 + "ms" }}
              href={c.href}
              key={c.title}
            >
              <span>{c.icon}</span>
              <div>{c.title}</div>
              <small>Explore Now →</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="cta">
      <h2>Your Dream Placement Starts With Preparation.</h2>
      <p>Practice consistently. Build your skills. Walk into your interview with confidence.</p>
      <div className="hero-actions">
        <a className="btn btn-light" href="#/aptitude">Start Preparing →</a>
        <a className="btn btn-glass" href="#/about">Explore More</a>
      </div>
    </section>
  );
}

export default function Home() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  return (
    <div ref={rootRef}>
      <Hero />
      <Modules />
      <Categories />
      <CallToAction />
    </div>
  );
}
