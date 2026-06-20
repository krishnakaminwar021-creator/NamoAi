import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./InteractionManager.css";

export default function InteractionManager() {
  const location = useLocation();
  const spotlightRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // Detect mobile device or prefers-reduced-motion
  useEffect(() => {
    const isMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isMobile || prefersReducedMotion) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, []);

  // Global mousemove tracker & spotlight tracking logic with spring physics
  useEffect(() => {
    if (isDisabled) return;

    // Mouse positions
    let targetMouse = { x: -300, y: -300 };
    let currentMouse = { x: -300, y: -300 };
    
    // Parallax variables
    let targetParallax = { x: 0, y: 0 };
    let currentParallax = { x: 0, y: 0 };



    // Interactive card tracking
    let currentCard = null;
    let lastCard = null;
    let cardTilt = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    let cardGlow = { x: 0, y: 0 };

    let animationId = null;
    let hasMoved = false;

    const handleMouseMove = (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;

      // Parallax offsets (range from -1 to 1)
      targetParallax.x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetParallax.y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      hasMoved = true;

      // Interactive button tracking selector
      const hoveredLink = e.target.closest("a, button, .btn, .floating-btn, .portfolio-btn, .mobile-link, .link-arrow, .portfolio-arrow");
      
      // Interactive card tilt selector
      const hoveredCard = e.target.closest(
        ".service-card, .why-card, .portfolio-card, .testimonial-card, .cta-card, .portfolio-link-card, .work-card, .svc-card, .dept-card"
      );

      // Card 3D Tilting Target Coords
      if (hoveredCard) {
        currentCard = hoveredCard;
        lastCard = hoveredCard;
        
        const rect = hoveredCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const normX = x / rect.width - 0.5;
        const normY = y / rect.height - 0.5;
        
        // Limit tilt to 5 degrees
        cardTilt.targetX = -normY * 5;
        cardTilt.targetY = normX * 5;
        
        cardGlow.x = x;
        cardGlow.y = y;
      } else {
        currentCard = null;
        cardTilt.targetX = 0;
        cardTilt.targetY = 0;
      }


    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Request Animation Frame Loop for premium 60FPS spring animations
    const updatePosition = () => {
      if (hasMoved) {
        // Slow lerp for global spotlight backdrop
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;

        // Inertial lerp for parallax variables
        currentParallax.x += (targetParallax.x - currentParallax.x) * 0.08;
        currentParallax.y += (targetParallax.y - currentParallax.y) * 0.08;

        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate3d(${currentMouse.x}px, ${currentMouse.y}px, 0)`;
        }

        // Set global CSS custom properties for page background layers
        document.documentElement.style.setProperty("--parallax-x", currentParallax.x.toFixed(4));
        document.documentElement.style.setProperty("--parallax-y", currentParallax.y.toFixed(4));
        document.documentElement.style.setProperty("--mouse-x", `${currentMouse.x}px`);
        document.documentElement.style.setProperty("--mouse-y", `${currentMouse.y}px`);
      }



      // Update Card Tilt with Smooth Lerp
      cardTilt.currentX += (cardTilt.targetX - cardTilt.currentX) * 0.15;
      cardTilt.currentY += (cardTilt.targetY - cardTilt.currentY) * 0.15;

      if (lastCard) {
        let glow = lastCard.querySelector(".spotlight-glow");
        if (!glow) {
          glow = document.createElement("div");
          glow.className = "spotlight-glow";
          lastCard.appendChild(glow);
        }

        if (currentCard) {
          glow.classList.add("active");
          lastCard.style.setProperty("--tilt-x", `${cardTilt.currentX}deg`);
          lastCard.style.setProperty("--tilt-y", `${cardTilt.currentY}deg`);
          lastCard.style.setProperty("--mouse-x", `${cardGlow.x}px`);
          lastCard.style.setProperty("--mouse-y", `${cardGlow.y}px`);
          lastCard.classList.add("card-tilt-active");
        } else {
          lastCard.style.setProperty("--tilt-x", `${cardTilt.currentX}deg`);
          lastCard.style.setProperty("--tilt-y", `${cardTilt.currentY}deg`);
          if (Math.abs(cardTilt.currentX) < 0.05 && Math.abs(cardTilt.currentY) < 0.05) {
            glow.classList.remove("active");
            lastCard.classList.remove("card-tilt-active");
            lastCard.style.removeProperty("--tilt-x");
            lastCard.style.removeProperty("--tilt-y");
            lastCard = null;
          }
        }
      }

      animationId = requestAnimationFrame(updatePosition);
    };

    animationId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isDisabled]);

  // Dynamic Button Ripple Effect on Click
  useEffect(() => {
    const handleButtonClick = (e) => {
      const btn = e.target.closest(".btn, .floating-btn, .portfolio-btn, button:not(.mobile-only)");
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple-span";

      const size = Math.max(rect.width, rect.height);
      const radius = size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - radius}px`;
      ripple.style.top = `${e.clientY - rect.top - radius}px`;

      // Clean old ripple
      const oldRipple = btn.querySelector(".ripple-span");
      if (oldRipple) oldRipple.remove();

      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, []);

  // Scroll Reveal Auto-binding on route transition
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );

      const items = document.querySelectorAll(".reveal");
      items.forEach((item) => observer.observe(item));

      return () => observer.disconnect();
    }, 120);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isDisabled) return null;

  return (
    <div ref={spotlightRef} className="premium-spotlight" />
  );
}
