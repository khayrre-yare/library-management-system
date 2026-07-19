import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return undefined;

    const selector = [
      '.section:not(.hero) .section-heading',
      '.feature-card',
      '.story-card',
      '.branch-detail',
      '.branch-location-card',
      '.branch-service-card',
      '.branch-profile__visit',
      '.book-card',
      '.card',
      '.management-card',
      '.page-header',
      '.dashboard-content__header',
      '.auth-page__form-wrap',
    ].join(',');
    const observed = new WeakSet();

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -36px' })
      : null;

    const observeWithin = (node) => {
      if (!(node instanceof Element)) return;
      const elements = [
        ...(node.matches(selector) ? [node] : []),
        ...node.querySelectorAll(selector),
      ];
      elements.forEach((element, index) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add('ui-reveal');
        element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`);
        if (observer) observer.observe(element);
        else element.classList.add('is-revealed');
      });
    };

    observeWithin(root);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeWithin));
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main" ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
