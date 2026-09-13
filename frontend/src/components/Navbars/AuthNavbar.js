import React from "react";
import { Link } from "react-router-dom";

function AuthNavbar() {
  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-inner">
        <Link
          className="auth-brand"
          to="/auth/login"
          aria-label="Farmer Helper home"
        >
          <span className="auth-brand-icon">
            <i className="fas fa-seedling" />
          </span>
          <span>Farmer Helper</span>
        </Link>

        <div className="auth-nav-actions">
          <Link className="auth-nav-btn" to="/auth/login">
            <i className="fas fa-sign-in-alt me-1" />
            Login
          </Link>

          <Link
            className="auth-nav-btn auth-nav-btn-primary"
            to="/auth/register"
          >
            <i className="fas fa-user-plus me-1" />
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
