import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";

function Sidebar({ routes, refresh, logo }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const emitSidebarState = (nextState) => {
    window.dispatchEvent(
      new CustomEvent("fh:sidebar-state", { detail: { open: nextState } }),
    );
  };

  const closeSidebar = () => {
    setMobileOpen(false);
    emitSidebarState(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    refresh();
    closeSidebar();
  };

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const toggleSidebar = (event) => {
      const forcedOpen =
        event?.detail && typeof event.detail.open === "boolean"
          ? event.detail.open
          : undefined;

      setMobileOpen((prev) => {
        const nextState = typeof forcedOpen === "boolean" ? forcedOpen : !prev;
        emitSidebarState(nextState);
        return nextState;
      });
    };

    const closeDrawer = () => closeSidebar();

    window.addEventListener("fh:toggle-sidebar", toggleSidebar);
    window.addEventListener("fh:close-sidebar", closeDrawer);

    return () => {
      window.removeEventListener("fh:toggle-sidebar", toggleSidebar);
      window.removeEventListener("fh:close-sidebar", closeDrawer);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const getIcon = (route) => {
    if (route.path === "/logout") return "fas fa-sign-out-alt";
    if (route.path.includes("index")) return "fas fa-chart-line";
    if (route.path.includes("order")) return "fas fa-shopping-cart";
    if (route.path.includes("inventory")) return "fas fa-boxes";
    if (route.path.includes("message")) return "fas fa-comments";
    if (route.path.includes("profile")) return "fas fa-user";
    if (route.path.includes("browse")) return "fas fa-store";
    return "fas fa-circle";
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fh-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
        />
      )}

      <nav
        className={`sidenav navbar navbar-vertical navbar-light fh-sidebar ${
          mobileOpen ? "fh-sidebar-open" : ""
        }`}
        id="sidenav-main"
        aria-label="Main navigation"
      >
        <div className="fh-sidebar-inner">
          <div className="fh-sidebar-brand">
            <Link
              className="fh-brand"
              to={logo.innerLink}
              onClick={closeSidebar}
            >
              <span className="fh-brand-icon">
                <i className="fas fa-seedling" />
              </span>

              <span className="fh-brand-text">Farmer Helper</span>
            </Link>

            <button
              type="button"
              className="fh-sidebar-close"
              aria-label="Close navigation menu"
              onClick={closeSidebar}
            >
              <i className="fas fa-xmark" />
            </button>
          </div>

          <div className="fh-sidebar-divider" />

          <div className="fh-sidebar-menu">
            <ul className="navbar-nav">
              {routes
                .filter((route) => route.layout !== "/auth")
                .map((route) => {
                  const path = `${route.layout}${route.path}`;
                  const isLogout = route.path === "/logout";
                  const isActive = !isLogout && location.pathname === path;

                  return (
                    <li
                      className={`nav-item ${isActive ? "active" : ""}`}
                      key={`${route.layout}${route.path}`}
                    >
                      {isLogout ? (
                        <button
                          type="button"
                          className="nav-link fh-nav-link fh-logout-link"
                          onClick={handleLogout}
                        >
                          <span className="fh-nav-icon">
                            <i className={getIcon(route)} />
                          </span>

                          <span className="nav-link-text">{route.name}</span>
                        </button>
                      ) : (
                        <Link
                          className="nav-link fh-nav-link"
                          to={path}
                          onClick={closeSidebar}
                        >
                          <span className="fh-nav-icon">
                            <i className={getIcon(route)} />
                          </span>

                          <span className="nav-link-text">{route.name}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,

  refresh: PropTypes.func.isRequired,

  logo: PropTypes.shape({
    innerLink: PropTypes.string.isRequired,
  }).isRequired,
};

export default Sidebar;
