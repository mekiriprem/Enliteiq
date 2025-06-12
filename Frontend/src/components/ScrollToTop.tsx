// components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top for route changes
    window.scrollTo(0, 0);
    
    // Alternative: Use smooth scrolling with a shorter delay
    // const timer = setTimeout(() => {
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    // }, 100);
    
    // return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
