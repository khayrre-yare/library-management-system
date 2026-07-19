import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import useNotifications from '../../hooks/useNotifications';
import SearchBar from '../ui/SearchBar';
import Icon from '../ui/Icon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeCleared, setActiveCleared] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const { notifications } = useNotifications();
  const adminRequestCount = notifications.pendingBorrowRequests + notifications.pendingPurchaseRequests;
  const searchValue = location.pathname === '/books'
    ? new URLSearchParams(location.search).get('search') || ''
    : '';
  const searchBooks = (query) => {
    navigate(query ? `/books?search=${encodeURIComponent(query)}` : '/books');
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    setActiveCleared(false);
  }, [location.pathname]);

  useEffect(() => {
    const clearOnOutsideArea = (event) => {
      const target = event.target;
      const insideNavbar = target.closest?.('.navbar-wrap');
      const insideCurrentContent = target.closest?.('.app-main .container, .app-main .auth-page');
      if (!insideNavbar && !insideCurrentContent) setActiveCleared(true);
    };
    document.addEventListener('pointerdown', clearOnOutsideArea);
    return () => document.removeEventListener('pointerdown', clearOnOutsideArea);
  }, []);

  const path = location.pathname;
  const activeNav = path === '/'
    ? 'home'
    : path.startsWith('/books')
      ? 'books'
      : path.startsWith('/branches')
        ? 'branches'
      : path.startsWith('/contact')
        ? 'contact'
        : path.startsWith('/dashboard')
          ? 'dashboard'
        : path.startsWith('/admin')
            ? 'admin'
            : path.startsWith('/orders')
              ? 'orders'
            : null;
  const navClass = (id) => `navbar__link ${!activeCleared && activeNav === id ? 'is-active' : ''}`;

  return (
    <header className="navbar-wrap" onPointerDown={() => setActiveCleared(false)}>
      <nav className="navbar container" aria-label="Primary navigation">
        <Link to="/" className="brand" aria-label="Jamhuuriyo Library home">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="presentation">
              <path d="M9 11.5c5.8 0 10.6 1.7 15 5.2v22.1c-4.4-3.2-9.2-4.8-15-4.8V11.5Z" />
              <path d="M39 11.5c-5.8 0-10.6 1.7-15 5.2v22.1c4.4-3.2 9.2-4.8 15-4.8V11.5Z" />
              <path className="brand__page-line" d="M13.5 17.5c3.1.3 5.7 1.2 8 2.7M34.5 17.5c-3.1.3-5.7 1.2-8 2.7" />
            </svg>
          </span>
          <span>
            <strong>Jamhuuriyo</strong>
            <small>Library</small>
          </span>
        </Link>

        <div className="navbar__mobile-search">
          <SearchBar value={searchValue} onSearch={searchBooks} placeholder="Search books..." buttonLabel="Go" />
        </div>

        <button
          type="button"
          className={`navbar__toggle ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="primary-links"
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <div id="primary-links" className={`navbar__content ${open ? 'is-open' : ''}`}>
          <div className="navbar__links">
            <NavLink className={navClass('home')} to="/" end>
              Home
            </NavLink>
            <NavLink className={navClass('books')} to="/books">
              Books
            </NavLink>
            <NavLink className={navClass('branches')} to="/branches">
              Branches
            </NavLink>
            <NavLink className={navClass('contact')} to="/contact">
              Contact
            </NavLink>
            {isAuthenticated && !isAdmin && (
              <NavLink className={navClass('dashboard')} to="/dashboard">
                Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <>
                <NavLink className={navClass('admin')} to="/admin">
                  Admin
                </NavLink>
                <NavLink className={navClass('orders')} to="/orders">
                  Orders
                  {adminRequestCount > 0 && <span className="nav-notification-count">{adminRequestCount}</span>}
                </NavLink>
              </>
            )}
          </div>

          <div className="navbar__search">
            <SearchBar
              value={searchValue}
              onSearch={searchBooks}
              placeholder="Search books..."
              buttonLabel="Search"
            />
          </div>

          <div className="navbar__actions">
            {!isAdmin && (
              <NavLink className="cart-link" to="/cart" aria-label={`Book cart with ${count} books`}>
                <Icon name="cart" size={18} />
                Cart
                {count > 0 && <span className="cart-link__count">{count}</span>}
              </NavLink>
            )}

            {isAuthenticated ? (
              <div className="navbar__account">
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="navbar__auth">
                <Link className="button button--ghost button--sm" to="/login">
                  Login
                </Link>
                <Link className="button button--primary button--sm" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
