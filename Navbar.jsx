import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.dataset.navScrollOwner = "true";
      document.body.style.overflow = "hidden";
    } else {
      if (document.body.dataset.navScrollOwner === "true") {
        document.body.style.overflow = "";
        delete document.body.dataset.navScrollOwner;
      }
    }
    return () => {
      if (document.body.dataset.navScrollOwner === "true") {
        document.body.style.overflow = "";
        delete document.body.dataset.navScrollOwner;
      }
    };
  }, [open]);

  const closeMenu = () => setOpen(false);



  return (
    <header className={`nav-wrap ${scrolled ? "nav-scrolled" : ""}`}>
      <nav
        className="nav"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* BRAND */}
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={logo} alt="NAMO AI Digital Logo" className="logo" />
          <div className="brand-name">
            <span className="brand-text">NAMO AI</span>
            <span className="brand-dim">DIGITAL</span>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="nav-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {l.label}
              <span className="nav-underline" />
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          {/* LOGIN BUTTON */}
          

          {/* MOBILE MENU BUTTON */}
          <button
            className="icon-btn mobile-only"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(!open)}
          >
            <div className={`burger ${open ? "open" : ""}`}>
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${open ? "mobile-menu-open" : ""}`}
        aria-hidden={!open}
      >
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            onClick={closeMenu}
            className={({ isActive }) =>
              "mobile-link" + (isActive ? " active" : "")
            }
          >
            {l.label}
          </NavLink>
        ))}

        {/* MOBILE LOGIN BUTTON */}
      
      </div>

      
    </header>
  );
}