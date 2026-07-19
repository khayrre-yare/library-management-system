import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../ui/Icon';

export default function DashboardShell({ title, description, children, actions, hideProfile = false, sidebarContent }) {
  const { user, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="dashboard-page section">
      <div className="container dashboard-shell">
        <button type="button" className="dashboard-menu-toggle" aria-expanded={menuOpen}
          aria-controls="dashboard-mobile-menu" onClick={() => setMenuOpen((current) => !current)}>
          <Icon name="menu" size={18} />
          Menu
        </button>
        {menuOpen && <button type="button" className="dashboard-menu-overlay" aria-label="Close dashboard menu" onClick={() => setMenuOpen(false)} />}
        <aside id="dashboard-mobile-menu" className={`dashboard-sidebar ${menuOpen ? 'is-open' : ''}`}
          onClick={(event) => { if (event.target.closest('button, a')) setMenuOpen(false); }}>
          {!hideProfile && <div className="dashboard-profile">
            <span className="dashboard-profile__avatar" aria-hidden="true">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <div>
              <strong>{user?.fullName}</strong>
              <span>{user?.role === 'ADMIN' ? 'Administrator' : 'Library member'}</span>
            </div>
          </div>}
          {sidebarContent || <nav className="dashboard-nav" aria-label="Dashboard navigation">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <Icon name="dashboard" size={18} />
              My dashboard
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <Icon name="dashboard" size={18} />
                Administration
              </NavLink>
            )}
            <NavLink to="/books" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <Icon name="books" size={18} />
              Browse books
            </NavLink>
          </nav>}
        </aside>

        <div className="dashboard-content">
          <header className="dashboard-content__header">
            <div>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {actions && <div className="dashboard-content__actions">{actions}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
