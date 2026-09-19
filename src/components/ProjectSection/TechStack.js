import data from "../../JsonFolders/portfolio.json";

// A project's "stack" lists names from the Tools & Technologies carousel,
// so the logos stay in one place. Names without a logo show as a text label.
const LOGOS = Object.fromEntries(data.images.languages.map((l) => [l.alt, l.src]));

export default function TechStack({ stack, active, className = "" }) {
  if (!stack?.length) return null;

  return (
    <ul className={`tech-stack ${className}`} aria-label="Tech stack">
      {stack.map((name) =>
        LOGOS[name] ? (
          <li key={name} className={`tech-stack-item ${name === active ? "is-active" : ""}`} title={name}>
            <img src={LOGOS[name]} alt={name} loading="lazy" />
          </li>
        ) : (
          <li key={name} className={`tech-stack-item tech-stack-text ${name === active ? "is-active" : ""}`}>
            {name}
          </li>
        )
      )}
    </ul>
  );
}
