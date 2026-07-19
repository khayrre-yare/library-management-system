import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { booksApi } from '../api/client';
import BookCard from '../components/BookCard';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState({
    content: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [categories, setCategories] = useState([]);
  const search = searchParams.get('search')?.trim() || '';
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await booksApi.list({
        page,
        size: 8,
        search: search || undefined,
        category: category || undefined,
      });
      setResult(data);
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setLoading(false);
    }
  }, [category, page, search]);

  useEffect(() => {
    booksApi.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleCategory = (event) => {
    setPage(0);
    setCategory(event.target.value);
  };

  return (
    <section className="section page-section">
      <div className="container">
        <PageHeader
          eyebrow="Book catalogue"
          title="Explore the library"
          description="Search the collection and add available books to your borrow cart."
        />

        <div className="catalogue-toolbar">
          <Select
            aria-label="Filter by category"
            value={category}
            onChange={handleCategory}
            className="catalogue-toolbar__select"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="catalogue-summary">
          <span>
            {loading ? 'Loading books…' : `${result.totalElements} book${result.totalElements === 1 ? '' : 's'} found`}
          </span>
          {(search || category) && (
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setSearchParams({});
                setCategory('');
                setPage(0);
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <Alert type="error" className="space-bottom">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="book-grid">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="book-card-skeleton" key={index}>
                <Skeleton height="320px" />
                <Skeleton height="20px" width="72%" />
                <Skeleton height="16px" width="44%" />
              </div>
            ))}
          </div>
        ) : result.content.length > 0 ? (
          <>
            <div className="book-grid">
              {result.content.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          <EmptyState
            icon="search"
            title="No books match these filters"
            message="Try another title, author, ISBN, or category."
          />
        )}
      </div>
    </section>
  );
}
