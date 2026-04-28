import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Cpu, Heart, BarChart3, Instagram, Twitter, Facebook, CircleAlert } from 'lucide-react';
import heroWomen from '../assets/hero-women-rashes.png';

export default function LandingPage({ onStart, onLogin, onAbout }: { onStart: () => void, onLogin: () => void, onAbout?: () => void }) {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <header style={{ background: 'linear-gradient(90deg, #020B18 0%, #0A1628 40%, #0E2044 70%, #0D3060 100%)', borderBottom: '2px solid rgba(56, 189, 248, 0.35)', position: 'sticky', top: 0, zIndex: 999, backdropFilter: 'blur(14px)', boxShadow: '0 4px 24px rgba(2, 11, 24, 0.7)' }}>
        <nav className="container nav">
          <div className="flex items-center gap-1">
            <div className="logo-icon">
              <ShieldCheck size={28} />
            </div>
            <span className="logo-text">Cure<span style={{ color: '#4CAF72' }}>Skin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onAbout} className="button-text" style={{ opacity: 0.85 }}>About Us</button>
            <button onClick={onLogin} className="button-text">Login</button>
            <button onClick={onStart} className="button button-primary">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <div className="container grid-2 items-center">
          <div className="hero-content">
            <div className="badge">
              <span className="dot"></span>
              Smart Skin Care Helper
            </div>
            <h1>
              Smart Skin Disease Detection <br />
              <span className="text-primary" style={{ background: 'rgba(74, 143, 168, 0.4)', padding: '0 12px', borderRadius: '8px', color: '#D4A855' }}>& PRODUCT RECOMMENDATION</span> System
            </h1>
            <p className="hero-description">
              Check your skin problems in seconds. Just take a photo and get expert advice on how to fix it. Fast, easy, and accurate.
            </p>
            <div className="hero-actions">
              <button onClick={onStart} className="button button-primary hero-btn">
                Check My Skin Now
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="hero-image-container">
            <div className="image-card">
              <img
                src={heroWomen}
                alt="Skin Condition Analysis"
                className="hero-image"
              />

            </div>
          </div>
        </div>
      </main>


      {/* Our Features (Technical & AI Focus) */}
      <section className="section bg-dark">
        <div className="container grid-2 items-center">
          <div className="hero-image-container">
            <img 
               src="/images/landing/features-ai.png" 
               alt="Technical Features AI" 
               className="feature-image-side"
            />
          </div>
          <div className="feature-content" style={{ paddingLeft: '40px' }}>
            <div className="tag tag-primary" style={{ marginBottom: '16px' }}>Technical & AI Core</div>
            <h2>Smart Analysis with MERN + AI</h2>
            <p style={{ fontSize: '18px', marginBottom: '24px' }}>
              Our system utilizes a powerful MERN stack integrated with cutting-edge Google Gemini AI APIs to process skin images with remarkable precision and speed.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="stats-icon-wrapper bg-blue-light" style={{ width: '40px', height: '40px' }}><Cpu size={20} /></div>
                <span>Real-time Neural Analysis</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="stats-icon-wrapper bg-pink-light" style={{ width: '40px', height: '40px' }}><BarChart3 size={20} /></div>
                <span>Data-driven Medical Insights</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* How it Works Section */}
      <section className="section bg-black-light">
        <div className="container text-center">
          <div className="mb-4">
            <h2 className="text-gradient" style={{ fontSize: '42px', marginBottom: '16px' }}>How <span style={{ color: '#fff' }}>CureSkin</span> Works</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-gray)', maxWidth: '600px', margin: '0 auto 40px' }}>
              Simple three-step infographic visual for professional skin health monitoring
            </p>
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src="/images/landing/how-it-works.png" 
              alt="How it Works Steps" 
              className="how-it-works-full"
            />
          </div>
          <div className="grid-3 gap-3" style={{ marginTop: '40px' }}>
            {[
              { title: "Upload Photo", desc: "Snap a clear photo of your skin rash using your phone.", icon: "📸" },
              { title: "AI Analysis", desc: "Our Gemini AI processes the data with neural networks.", icon: "🧠" },
              { title: "Get Results", desc: "View recommended products and treatment plans instantly.", icon: "📋" }
            ].map((item, i) => (
              <div key={i} className="card feature-card">
                <div className="feature-icon">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Footer */}
      <footer className="footer-redesign">
        <div className="container">
          <div className="footer-grid">
            {/* Left Column: Logo & Info */}
            <div className="footer-column">
              <div className="flex items-center gap-1" style={{ marginBottom: '24px' }}>
                <div className="logo-icon">
                  <ShieldCheck size={28} />
                </div>
                <span className="logo-text">Cure<span style={{ color: '#4CAF72' }}>Skin</span></span>
              </div>
              <p className="footer-info-text">
                Using advanced AI APIs and the MERN stack to provide instant skin health insights and personalized product recommendations for a healthier you.
              </p>
              <div className="flex gap-2" style={{ marginTop: '30px' }}>
                <button className="button-icon"><Instagram size={18} /></button>
                <button className="button-icon"><Twitter size={18} /></button>
                <button className="button-icon"><Facebook size={18} /></button>
              </div>
            </div>

            {/* Middle Column: Quick Links */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links-list">
                <li><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); onAbout?.(); }}>About Project</a></li>
                <li><a href="#scan" onClick={(e) => { e.preventDefault(); onStart(); }}>Skin Scan</a></li>
                <li><a href="#store" onClick={(e) => { e.preventDefault(); onStart(); }}>Product Store</a></li>
              </ul>
            </div>

            {/* Right Column: Services */}
            <div className="footer-column">
              <h4>Services</h4>
              <ul className="footer-links-list">
                <li><a href="#analysis">AI Analysis</a></li>
                <li><a href="#routine">Routine Planning</a></li>
                <li><a href="#history">History Tracking</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="footer-copyright">Copyright © 2026 | All rights reserved.</p>
            <div className="medical-disclaimer">
              <CircleAlert size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Medical Disclaimer: This is an AI-supported tool, not a doctor's replacement.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
