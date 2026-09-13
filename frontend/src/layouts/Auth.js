import React from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import AuthNavbar from "components/Navbars/AuthNavbar";
import AuthFooter from "components/Footers/AuthFooter";

import Register from "views/examples/Register";
import Login from "views/examples/Login";

import "../views/examples/Auth.css";

const Auth = ({ refresh }) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default");

    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }

    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <div className="auth-page" ref={mainContent}>
      <AuthNavbar />

      <main className="auth-main">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <span className="auth-eyebrow">
              <i className="fas fa-seedling" />
              Farmer Helper
            </span>

            <h1>Welcome to Farmer Helper</h1>

            <p>A single portal connecting farmers and consumers directly.</p>
          </div>
        </div>

        <section className="auth-content" aria-label="Authentication">
          <div className="auth-card-container">
            <Routes>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login refresh={refresh} />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </div>
        </section>
      </main>

      <footer className="auth-footer">
        <AuthFooter />
      </footer>
    </div>
  );
};

export default Auth;
