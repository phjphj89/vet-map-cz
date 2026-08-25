import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router does NOT reset scroll position on navigation by default -
// it just leaves the window wherever it was on the previous page/view.
// So clicking a clinic while scrolled down on the home page (list or map)
// opens the detail page still at that same scroll offset, instead of at
// the top like a real page load would. This has no visible UI - it just
// watches the current path and jumps the window to the top whenever it
// changes.
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
