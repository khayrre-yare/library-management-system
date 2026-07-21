import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import branches, { getBranch } from '../data/branches';

export default function BranchDetails() {
  const { branchId } = useParams();
  const branch = getBranch(branchId);

  if (!branch) return <Navigate to="/branches" replace />;

  const otherBranches = branches.filter((item) => item.id !== branch.id);

  return (
    <div className="branch-profile">
      <section className="branch-profile__hero">
        <img src={branch.image} alt={branch.alt} />
        <div className="branch-profile__overlay" />
        <div className="container branch-profile__hero-content">
          <nav className="branch-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/branches">Branches</Link><span>/</span><span>{branch.name}</span>
          </nav>
          <span className="branch-profile__number">Branch {branch.number}</span>
          <h1>{branch.name}</h1>
          <p><Icon name="location" size={19} />{branch.location}</p>
        </div>
      </section>

      <section className="section branch-profile__body">
        <div className="container branch-profile__layout">
          <main className="branch-profile__main">
            <span className="eyebrow">About this branch</span>
            <h2>A meel ku wacan wax aqriska iyo waxbarashada</h2>
            <p className="branch-profile__lead">{branch.description}</p>

            <div className="branch-service-grid">
              {branch.services.map((service) => (
                <article className="branch-service-card" key={service.title}>
                  <span><Icon name={service.icon} size={22} /></span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </main>

          <aside className="branch-profile__visit">
            <span className="branch-profile__visit-icon"><Icon name="location" size={23} /></span>
            <h2>Plan your visit</h2>
            <div className="branch-profile__visit-row">
              <small>Location</small>
              <strong>{branch.location}</strong>
            </div>
            <div className="branch-profile__visit-row">
              <small>Opening hours</small>
              <strong>{branch.hours}</strong>
            </div>
            <a className="button button--primary" href={branch.mapsUrl} target="_blank" rel="noreferrer">
              <Icon name="location" size={17} />Open in Google Maps
            </a>
            <Link className="button button--secondary" to="/branches">View all branches</Link>
          </aside>
        </div>
      </section>

      <section className="section branch-more-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Also nearby</span><h2>Explore another branch</h2></div>
          </div>
          <div className="branch-more-grid">
            {otherBranches.map((item) => (
              <Link to={`/branches/${item.id}`} className="branch-more-card" key={item.id}>
                <img src={item.image} alt="" loading="lazy" />
                <div><span>{item.area}</span><h3>{item.name}</h3><strong>View details →</strong></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
