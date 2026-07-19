import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">Jamhuuriyo Library</div>
          <p>A clear system for browsing books, requesting loans, and managing library activity.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/books">Books</Link>
          <Link to="/branches">Branches</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h3>Account</h3>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/cart">Borrow cart</Link>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Jamhuuriyo Library</span>
        <span>Spring Boot + React</span>
      </div>
    </footer>
  );
}
