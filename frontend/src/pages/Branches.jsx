import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import branches from '../data/branches';

export default function Branches() {
  return (
    <div className="branches-page">
      <section className="branch-network-hero">
        <div className="container branch-network-hero__grid">
          <div className="branch-network-hero__content">
            <span className="eyebrow">Jamhuuriyo Library Network</span>
            <h1>Three branches. One shared place for knowledge.</h1>
            <p>Find the Jamhuuriyo Library branch that best fits your location, schedule, and way of learning.</p>
            <div className="branch-network-hero__facts" aria-label="Library network overview">
              <span><strong>03</strong> Branches</span>
              <span><strong>6 days</strong> Every week</span>
              <span><strong>1 network</strong> Shared service</span>
            </div>
          </div>
          <div className="branch-network-hero__visual" aria-hidden="true">
            {branches.map((branch, index) => (
              <figure className={`branch-network-photo branch-network-photo--${index + 1}`} key={branch.id}>
                <img src={branch.image} alt="" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section branch-directory">
        <div className="container">
          <div className="section-heading branch-directory__heading">
            <div>
              <span className="eyebrow">Our locations</span>
              <h2>Choose your branch</h2>
              <p>Each branch is part of the same library network while offering a distinct local reading and learning environment.</p>
            </div>
          </div>

          <div className="branch-location-grid">
            {branches.map((branch) => (
              <Link className="branch-location-card" to={`/branches/${branch.id}`} key={branch.id}>
                <div className="branch-location-card__media">
                  <img src={branch.image} alt={branch.alt} loading="lazy" decoding="async" />
                  <span className="branch-location-card__number">{branch.number}</span>
                </div>
                <div className="branch-location-card__content">
                  <span className="branch-location-card__area"><Icon name="location" size={15} />{branch.area}</span>
                  <h2>{branch.name}</h2>
                  <p>{branch.summary}</p>
                  <div className="branch-location-card__footer">
                    <span><Icon name="clock" size={15} />{branch.hours}</span>
                    <strong>Explore branch <span aria-hidden="true">→</span></strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section branch-network-cta-section">
        <div className="container">
          <div className="branch-network-cta">
            <div>
              <span className="eyebrow">One catalogue, every branch</span>
              <h2>Start with the books. Visit when you are ready.</h2>
              <p>Browse available titles online, then use the branch information above to plan your library visit.</p>
            </div>
            <Link className="button button--primary button--lg" to="/books">Browse the catalogue</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
