import { useState, useEffect, useRef } from "react";
import "./FloatingCTA.css";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const containerRef = useRef(null);

  // Close when clicking outside or pressing ESC, and lock scroll
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);

    if (isOpen) {
      // Only lock scroll if not already locked by another modal
      if (document.body.style.overflow !== "hidden") {
        document.body.dataset.ctaScrollOwner = "true";
        document.body.style.overflow = "hidden";
      }
      document.addEventListener("keydown", handleKeyDown);
    } else {
      // Only unlock scroll if FloatingCTA was the one who locked it
      if (document.body.dataset.ctaScrollOwner === "true") {
        document.body.style.overflow = "";
        delete document.body.dataset.ctaScrollOwner;
      }
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      // Only restore overflow if FloatingCTA owns the scroll lock
      if (document.body.dataset.ctaScrollOwner === "true") {
        document.body.style.overflow = "";
        delete document.body.dataset.ctaScrollOwner;
      }
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (showPulse) setShowPulse(false); // Disable pulse once interacted
  };

  return (
    <div className="floating-cta-container" ref={containerRef}>
      {/* Floating Menu Pop-up Backdrop */}
      {isOpen && <div className="floating-backdrop" onClick={() => setIsOpen(false)} />}
      
      {/* Floating Menu Pop-up */}
      {isOpen && (
        <div 
          className="floating-menu animate-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Contact options"
        >
          <div className="menu-header">
            <h4>Start a Project</h4>
            <p className="muted">Get in touch directly with our team</p>
          </div>
          <div className="menu-links">
            <a
              href="https://wa.me/919579057085"
              target="_blank"
              rel="noreferrer"
              className="menu-link-item whatsapp"
              onClick={() => setIsOpen(false)}
            >
              <div className="link-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                </svg>
              </div>
              <div className="link-info">
                <span className="link-title">Chat on WhatsApp</span>
                <span className="link-desc">Response time: &lt; 15 mins</span>
              </div>
            </a>

            <a
              href="https://calendly.com/stormtech418/new-meeting"
              target="_blank"
              rel="noreferrer"
              className="menu-link-item calendly"
              onClick={() => setIsOpen(false)}
            >
              <div className="link-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="link-info">
                <span className="link-title">Book Strategy Session</span>
                <span className="link-desc">Schedule a 30-min call</span>
              </div>
            </a>
          </div>
          <div className="menu-footer">
            <a href="mailto:digitalnamoai@gmail.com">digitalnamoai@gmail.com</a>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={handleToggle}
        className={`floating-btn ${isOpen ? "active" : ""}`}
        aria-label="Contact options"
      >
        <div className="btn-ambient-glow" />
        {showPulse && <span className="btn-pulse-badge" />}
        {isOpen ? (
          <svg className="icon-close" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg className="icon-chat" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
