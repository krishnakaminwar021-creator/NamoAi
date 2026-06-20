import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Temporarily disable smooth scroll behavior on html element
    const htmlElement = document.documentElement;
    const originalScrollBehavior = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";

    // 2. Perform the instant scroll reset on window
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // 3. Reset scroll position on common scroll containers (html, body, #root, #main-content)
    htmlElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.scrollTop = 0;
    }

    const mainElement = document.getElementById("main-content");
    if (mainElement) {
      mainElement.scrollTop = 0;
    }

    // 4. Restore smooth scroll behavior in the next tick
    const timeoutId = setTimeout(() => {
      htmlElement.style.scrollBehavior = originalScrollBehavior;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}