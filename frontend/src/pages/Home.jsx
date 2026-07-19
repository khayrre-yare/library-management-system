import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksApi } from '../api/client';
import BookCard from '../components/BookCard';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import libraryStoryAbout from '../assets/library-story-about.png';
import libraryStoryReading from '../assets/library-story-reading.png';
import libraryStoryResearch from '../assets/library-story-research.png';
import libraryStoryLifelong from '../assets/library-story-lifelong.png';

const libraryStories = [
  {
    category: 'Our library',
    title: 'A clearer way to reach knowledge',
    description: 'Jamhuuriyo Library brings discovery, borrowing, purchases, and account activity into one welcoming experience. It is designed to make every step—from finding a title to following a request—simple, transparent, and accessible.',
    image: libraryStoryAbout,
    alt: 'A welcoming Jamhuuriyo Library reading hall with organized bookshelves and study tables',
    featured: true,
  },
  {
    category: 'Reading & wellbeing',
    title: 'Reading strengthens the mind',
    description: 'Regular reading builds focus, expands vocabulary, reduces everyday stress, and gives the imagination room to grow. Even a few thoughtful pages each day can become a lasting habit of personal development.',
    image: libraryStoryReading,
    alt: 'A student reading quietly in a comfortable library chair',
  },
  {
    category: 'Research & discovery',
    title: 'Curiosity becomes understanding',
    description: 'Great research begins with a good question. Books, shared ideas, and careful evidence help learners move beyond quick answers and develop knowledge they can trust and use.',
    image: libraryStoryResearch,
    alt: 'University students collaborating on research together in a library',
  },
  {
    category: 'Lifelong learning',
    title: 'Learning has no finish line',
    description: 'Knowledge remains valuable at every stage of life. A library connects generations through ideas, encourages continuous learning, and keeps curiosity active long after formal education ends.',
    image: libraryStoryLifelong,
    alt: 'Readers from different generations enjoying books in a warm library',
  },
];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    booksApi
      .list({ page: 0, size: 4 })
      .then((data) => setBooks(data.content))
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow">Jamhuuriyo Library</span>
            <h1>Find the right book and manage every loan clearly.</h1>
            <p>
              Browse the catalogue, place borrowing requests, and follow their status from one
              responsive system.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary button--lg" to="/books">
                Browse books
              </Link>
              <Link className="button button--secondary button--lg" to="/register">
                Create account
              </Link>
            </div>
            <div className="hero__trust">
              <span>✓ Searchable catalogue</span>
              <span>✓ Secure member accounts</span>
              <span>✓ Clear borrowing status</span>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero-book hero-book--one">
              <span>Knowledge</span>
            </div>
            <div className="hero-book hero-book--two">
              <span>Research</span>
            </div>
            <div className="hero-book hero-book--three">
              <span>Learning</span>
            </div>
            <div className="hero__visual-card">
              <strong>Simple borrowing</strong>
              <small>Browse → add to cart → request</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Catalogue</span>
              <h2>Recently added books</h2>
              <p>Start with the latest titles available in the library.</p>
            </div>
            <Link className="text-link text-link--arrow" to="/books">
              View all books
            </Link>
          </div>

          {error && <Alert type="error">{error}</Alert>}

          {loading ? (
            <div className="book-grid">
              {[1, 2, 3, 4].map((item) => (
                <div className="book-card-skeleton" key={item}>
                  <Skeleton height="320px" />
                  <Skeleton height="20px" width="70%" />
                  <Skeleton height="16px" width="45%" />
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="book-grid">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="home-empty">
              <h3>The catalogue is ready for books.</h3>
              <p>An administrator can add the first book from the administration page.</p>
              <Button disabled>
                No books yet
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="section stories-section">
        <div className="container">
          <div className="section-heading stories-heading">
            <div>
              <span className="eyebrow">Beyond the shelves</span>
              <h2>Ideas that stay with you</h2>
              <p>Explore the role a modern library and a steady reading habit can play in learning, research, and everyday life.</p>
            </div>
            <Link className="text-link text-link--arrow" to="/books">
              Explore the catalogue
            </Link>
          </div>

          <div className="stories-grid">
            {libraryStories.map((story) => (
              <article className={`story-card ${story.featured ? 'story-card--featured' : ''}`} key={story.title}>
                <div className="story-card__media">
                  <img src={story.image} alt={story.alt} loading="lazy" decoding="async" />
                </div>
                <div className="story-card__content">
                  <span className="story-card__category">{story.category}</span>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
