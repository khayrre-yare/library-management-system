import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { booksApi } from '../api/client';
import { formatPrice } from '../utils/currency';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getBookCover } from '../utils/bookCovers';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addBook, addPurchase, isInCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    booksApi
      .get(id)
      .then(setBook)
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="section page-section">
        <div className="container book-details book-details--loading">
          <Skeleton height="520px" />
          <div>
            <Skeleton height="24px" width="130px" />
            <Skeleton height="58px" width="80%" />
            <Skeleton height="20px" width="45%" />
            <Skeleton height="150px" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="section page-section">
        <div className="container narrow-container">
          <Alert type="error" title="Book could not be loaded">
            {error || 'The requested book does not exist.'}
          </Alert>
          <Link className="text-link text-link--arrow" to="/books">
            Return to catalogue
          </Link>
        </div>
      </section>
    );
  }

  const available = book.availableCopies > 0;
  const inCart = isInCart(book.id);
  const inBuyCart = isInCart(book.id, 'BUY');
  const hasPrice = Number(book.price) > 0;

  const handleAdd = () => {
    if (addBook(book)) {
      showToast(`${book.title} was added to your borrow cart.`, 'success');
    }
  };

  const handleBuy = () => {
    if (addPurchase(book)) showToast(`${book.title} was added to your purchase cart.`, 'success');
  };

  return (
    <section className="section page-section">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/books">Books</Link>
          <span>/</span>
          <span>{book.title}</span>
        </div>

        <article className="book-details">
          <div className="book-details__cover-wrap">
            <img
              className="book-details__cover"
              src={getBookCover(book)}
              alt={`Cover of ${book.title}`}
            />
          </div>

          <div className="book-details__content">
            <div className="book-details__badges">
              <Badge variant="soft">{book.category}</Badge>
              <Badge variant={available ? 'success' : 'danger'}>
                {available ? `${book.availableCopies} available` : 'Unavailable'}
              </Badge>
            </div>
            <h1>{book.title}</h1>
            <p className="book-details__author">by {book.author}</p>
            <p className={`book-details__price ${hasPrice ? '' : 'book-card__price--missing'}`}>
              {formatPrice(book.price)}
            </p>

            <dl className="book-details__facts">
              <div>
                <dt>ISBN</dt>
                <dd>{book.isbn}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{book.publishedYear || 'Not specified'}</dd>
              </div>
              <div>
                <dt>Collection</dt>
                <dd>{book.category}</dd>
              </div>
              <div>
                <dt>Total copies</dt>
                <dd>{book.totalCopies}</dd>
              </div>
            </dl>

            <div className="book-details__description">
              <h2>About this book</h2>
              <p>{book.description || 'No description has been added for this book.'}</p>
            </div>

            <div className="book-details__actions">
              <Button
                size="lg"
                onClick={handleAdd}
                disabled={!available || inCart}
                variant={inCart ? 'secondary' : 'primary'}
              >
                {inCart ? 'Already in borrow cart' : available ? 'Add to borrow cart' : 'Currently unavailable'}
              </Button>
              <Link className="button button--ghost button--lg" to="/books">
                Continue browsing
              </Link>
              <Button size="lg" variant="secondary" onClick={handleBuy} disabled={!available || !hasPrice || inBuyCart}>
                {inBuyCart ? 'Already in purchase cart' : 'Add to purchase cart'}
              </Button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
