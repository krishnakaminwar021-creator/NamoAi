import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import PricingPlanCard from "./PricingPlanCard";
import pricingData from "../data/pricingData";
import "./ServicePricingModal.css";

export default function ServicePricingModal({
  serviceKey,
  isOpen,
  onClose,
}) {
  const modalRef = useRef(null);
  const glowRef = useRef(null);
  const mouseDownTargetRef = useRef(null);

  const data = serviceKey ? pricingData[serviceKey] : null;

  // Body scroll lock via CSS class
  useEffect(() => {
    if (!isOpen) return;

    // Measure scrollbar width before locking
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--spm-scrollbar-w", sw + "px");
    document.body.classList.add("spm-lock");

    return () => {
      document.body.classList.remove("spm-lock");
      document.documentElement.style.removeProperty("--spm-scrollbar-w");
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleMouseMove = useCallback((e) => {
    if (!glowRef.current || !modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glowRef.current.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
    glowRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && mouseDownTargetRef.current === e.currentTarget) {
      onClose();
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    initial: {
      opacity: 0,
      y: 24,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 16,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          className="spm-overlay"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          onMouseDown={(e) => { mouseDownTargetRef.current = e.target; }}
          onTouchStart={(e) => { mouseDownTargetRef.current = e.target; }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="spm-modal"
            ref={modalRef}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="spm-cursor-glow"
              ref={glowRef}
            />

            <button
              className="spm-close"
              onClick={onClose}
              aria-label="Close pricing modal"
            >
              ✕
            </button>

            <div className="spm-header">
              <span className="spm-label">
                Detailed Plan Breakdown
              </span>

              <h2 className="spm-title">
                {data.title}
              </h2>

              <p className="spm-subtitle">
                {data.subtitle}
              </p>
            </div>

            <div className="spm-divider" />

            <div className="spm-plans">
              {data?.plans?.map((plan, index) => (
                <PricingPlanCard
                  key={plan.name}
                  plan={plan}
                  index={index}
                />
              ))}
            </div>

            <div className="spm-footer">
              <div className="spm-footer__divider" />

              <p className="spm-footer__text">
                Let's synchronize on your business
                objectives and select the ideal
                growth strategy.
              </p>

              <div className="spm-footer__actions">
                <a
                  href="https://wa.me/919579057085"
                  target="_blank"
                  rel="noreferrer"
                  className="spm-btn spm-btn--outline"
                >
                  Request Custom Quote
                </a>

                <a
                  href="https://wa.me/919579057085"
                  target="_blank"
                  rel="noreferrer"
                  className="spm-btn spm-btn--primary"
                >
                  Start Project Discussion →
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}