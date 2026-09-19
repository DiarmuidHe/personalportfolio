import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./NotFound.css";

export default function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = "Page not found | Diarmuid Hession";
  }, []);

  return (
    <main className="nf">
      <div className="container">
        <p className="nf-code">404</p>
        <h1 className="nf-title">That page doesn't exist</h1>
        <p className="nf-text">
          There's nothing at <code>{pathname}</code>. It may have moved, or the link has a typo.
        </p>
        <Link to="/" className="btn-brand">
          <FaArrowLeft aria-hidden="true" /> Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
