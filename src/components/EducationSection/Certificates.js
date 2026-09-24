import { useEffect, useRef } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { FaArrowRight, FaAward, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { CERTIFICATES } from "../../data/profile";
import "./Certificates.css";

const completionDate = (date) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-IE", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

function CertificateDialog({ certificate, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    const title = document.title;
    document.title = `${certificate.title} | Diarmuid Hession`;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      document.title = title;
      opener?.focus?.({ preventScroll: true });
    };
  }, [certificate]);

  return (
    <dialog
      ref={dialogRef}
      className="cert-dialog"
      aria-labelledby="certificate-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="cert-dialog-content">
        <button type="button" className="cert-close" onClick={onClose} aria-label="Close certificate details" autoFocus>
          <FaTimes aria-hidden="true" />
        </button>
        <p className="cert-eyebrow">Certificate of completion</p>
        <h2 id="certificate-title">{certificate.title}</h2>
        <p className="cert-meta">{certificate.issuer} · <time dateTime={certificate.completed}>{completionDate(certificate.completed)}</time></p>
        <p className="cert-meta">{certificate.detail}</p>
        <img className="cert-preview" src={`/certificates/${certificate.slug}.png`} alt={`Certificate awarded to Diarmuid Hession for completing ${certificate.title}`} />
        <a className="btn-brand" href={`/certificates/${certificate.slug}.pdf`} target="_blank" rel="noopener noreferrer">
          Open certificate PDF <FaExternalLinkAlt aria-hidden="true" />
        </a>
      </div>
    </dialog>
  );
}

export default function Certificates() {
  const match = useMatch("/certificates/:slug");
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const selected = CERTIFICATES.find((certificate) => certificate.slug === match?.params.slug);

  useEffect(() => {
    if (match && !selected) navigate("/", { replace: true });
    if (selected) sectionRef.current?.scrollIntoView({ block: "start" });
  }, [match, selected, navigate]);

  return (
    <section ref={sectionRef} id="certificates" className="certificates" aria-labelledby="certificates-title">
      <h3 id="certificates-title">Professional Development</h3>
      <p className="cert-intro">Completed courses in software requirements, testing and Git.</p>
      <div className="cert-grid">
        {CERTIFICATES.map((certificate) => (
          <Link key={certificate.slug} to={`/certificates/${certificate.slug}`} className="cert-card">
            <FaAward className="cert-icon" aria-hidden="true" />
            <div>
              <h4>{certificate.title}</h4>
              <p className="cert-meta">{certificate.issuer}</p>
              <time className="cert-meta" dateTime={certificate.completed}>{completionDate(certificate.completed)}</time>
              <span className="cert-cta">View certificate <FaArrowRight aria-hidden="true" /></span>
            </div>
          </Link>
        ))}
      </div>
      {selected && <CertificateDialog certificate={selected} onClose={() => navigate("/", { replace: true })} />}
    </section>
  );
}
