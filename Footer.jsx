import { NavLink, Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />

      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="brand">
            <img src={logo} alt="" className="logo" />
            <span className="brand-text">
              NAMO<span className="brand-dim"> AI DIGITAL</span>
            </span>
          </div>

          <p className="footer-tag">
            Performance-driven digital solutions company delivering scalable,
            creative, and technology-powered systems for modern brands.
          </p>

          <div className="footer-socials">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/namoai_digital?igsh=eXRlNXM3YmtzNTVy"
              target="_blank"
              rel="noopener noreferrer"
              className="social-instagram"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/namoai-digital/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-linkedin"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-facebook"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        {/* Services */}
        <nav className="footer-col">
          <div className="footer-h">Services</div>
          <Link to="/services">Web & App Development</Link>
          <Link to="/services">AI Automation Solution</Link>
          <Link to="/services">Business Growth & Consulting</Link>
          <Link to="/services">Performance Marketing</Link>
          <Link to="/services">Digital Marketing</Link>
          <Link to="/services">Creative Branding Services</Link>
        </nav>

        {/* Company */}
        <nav className="footer-col">
          <div className="footer-h">Company</div>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/work">Our Work</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Legal */}
        <nav className="footer-col">
          <div className="footer-h">Legal</div>

          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/refund">Refund Policy</Link>
          <Link to="/support">Support</Link>

          {/* ONLY ADMIN TEXT LINK */}
          <Link to="/login">Admin</Link>
        </nav>

        {/* Blog */}
        <nav className="footer-col">
          <div className="footer-h">Blog</div>
          <Link to="#">AI Insights</Link>
          <Link to="#">Tech Trends</Link>
          <Link to="#">Case Studies</Link>
        </nav>

        {/* Affiliate */}
        <nav className="footer-col">
          <div className="footer-h">Affiliate</div>
          <Link to="/affiliate">Become Affiliate Partner</Link>
        </nav>

        {/* Career */}
        <nav className="footer-col">
          <div className="footer-h">Career</div>
          <NavLink to="/careers/open-roles">Open Roles</NavLink>
          <NavLink to="/careers/culture">Our Culture</NavLink>
        </nav>

        {/* Contact */}
        <div className="footer-col">
          <div className="footer-h">Contact</div>

        <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=namoaidigital09@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Send email to NAMOAI Digital"
>
  digitalnamoai@gmail.com
</a>

          <a
            href="https://wa.me/919579057085"
            target="_blank"
            rel="noopener noreferrer"
          >
            +91 95790 57085
          </a>

          <a
            href="https://calendly.com/namoai-team"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a Call
          </a>

          <span className="footer-location">
            Nanded, Maharashtra, India
          </span>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-copyright">
          <span>
            © {new Date().getFullYear()} NAMOAI Digital Private Limited.
          </span>
        </div>

        <span className="muted">
          All rights reserved. <br /> Made with ❤️ in India
        </span>
      </div>
    </footer>
  );
}