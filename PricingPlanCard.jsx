import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ============================================
// PricingPlanCard — Premium Glassmorphism Card
// ============================================

export default function PricingPlanCard({ plan, index }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card || !shine) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    shine.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`;
  };

  return (
    <motion.div
      ref={cardRef}
      className={`pricing-card ${
        plan?.popular ? "pricing-card--popular" : ""
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Shine */}
      <div ref={shineRef} className="pricing-card__shine" />

      {/* Border Glow */}
      <div className="pricing-card__border-glow" />

      {/* Popular Badge */}
      {plan?.popular && (
        <div className="pricing-badge">
          <span className="pricing-badge__dot" />
          MOST POPULAR
        </div>
      )}

      {/* Plan Name */}
      <div className="pricing-card__name">
        {plan?.name}
      </div>

      {/* Price */}
      <div className="pricing-card__price">
        {plan?.price}

        {plan?.period && (
          <span className="pricing-card__period">
            {plan.period === "one-time"
              ? " (one-time)"
              : plan.period.startsWith("/")
              ? ` ${plan.period}`
              : ` / ${plan.period}`}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="pricing-card__desc">
        {plan?.description}
      </p>

      {/* Divider */}
      <div className="pricing-card__divider" />

      {/* Features */}
      <ul className="pricing-card__features">
        {plan?.features?.map((feature, i) => (
          <li key={i}>
            <svg
              className="pricing-card__check"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 10l3 3 5-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {feature}
          </li>
        ))}
      </ul>

      {/* Meta */}
      <div className="pricing-card__meta">
        <div className="pricing-card__meta-item">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            width="16"
            height="16"
          >
            <circle
              cx="10"
              cy="10"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 6v4l2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <span>{plan?.timeline}</span>
        </div>

        <div className="pricing-card__meta-item">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            width="16"
            height="16"
          >
            <path
              d="M10 18c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 1.657.504 3.195 1.367 4.472L2 18l3.528-1.367A7.96 7.96 0 0010 18z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>{plan?.support}</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to="/contact#contact-form"
        className={`pricing-card__cta ${
          plan?.popular
            ? "pricing-card__cta--glow"
            : ""
        }`}
      >
        Get Started →
      </Link>
    </motion.div>
  );
}