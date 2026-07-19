export default function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <header className={`page-header ${className}`.trim()}>
      <div>
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
