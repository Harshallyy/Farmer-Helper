import React from "react";

function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="fh-footer fh-footer-auth">
      <div className="fh-footer-inner">
        <div className="fh-footer-copy">© {year} Farmer Helper</div>
        <div className="fh-footer-brand">Connecting farmers and consumers</div>
      </div>
    </footer>
  );
}

export default AuthFooter;
