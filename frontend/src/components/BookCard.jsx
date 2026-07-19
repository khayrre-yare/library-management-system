import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getBookCover } from '../utils/bookCovers';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatPrice } from '../utils/currency';

export default function BookCard({ book }) {
  const { addBook, addPurchase, isInCart } = useCart();
  const { showToast } = useToast();
  const inCart = isInCart(book.id);
  const available = book.availableCopies > 0;
  const hasPrice = Number(book.price) > 0;
  const inBuyCart = isInCart(book.id, 'BUY');

  const handleAdd = () => {
    const added = addBook(book);
    if (added) showToast(`${book.title} was added to your borrow cart.`, 'success');
  };

  const handleBuy = () => {
    if (addPurchase(book)) showToast(`${book.title} was added to your purchase cart.`, 'success');
  };

  return (
    <article className="book-card">
      <Link className="book-card__cover-link" to={`/books/${book.id}`}>
        <img
          className="book-card__cover"
          src={getBookCover(book)}
          alt={`Cover of ${book.title}`}
          loading="lazy"
        />
      </Link>
      <div className="book-card__content">
        <div className="book-card__meta">
          <Badge variant="soft">{book.category}</Badge>
          <Badge variant={available ? 'success' : 'danger'}>
            {available ? `${book.availableCopies} available` : 'Unavailable'}
          </Badge>
        </div>
        <div>
          <h3 className="book-card__title">
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="book-card__author">by {book.author}</p>
          <strong className={`book-card__price ${hasPrice ? '' : 'book-card__price--missing'}`}>
            {formatPrice(book.price)}
          </strong>
        </div>
        <div className="book-card__actions">
          <Link className="text-link" to={`/books/${book.id}`}>
            View details
          </Link>
          <Button
            size="sm"
            variant={inCart ? 'secondary' : 'primary'}
            onClick={handleAdd}
            disabled={!available || inCart}
          >
            {inCart ? 'In cart' : 'Borrow'}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleBuy} disabled={!available || !hasPrice || inBuyCart}>
            {inBuyCart ? 'In cart' : 'Buy'}
          </Button>
        </div>
      </div>
    </article>
  );
}
