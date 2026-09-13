import React from "react";

function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="fh-footer">
      <div className="fh-footer-inner">
        <div className="fh-footer-copy">© {year} Farmer Helper</div>
        <div className="fh-footer-brand">Farmer Helper</div>
      </div>
    </footer>
  );
}

export default AdminFooter;
