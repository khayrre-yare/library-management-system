import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { borrowingsApi, purchasesApi } from '../api/client';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getBookCover } from '../utils/bookCovers';
import { formatPrice } from '../utils/currency';

export default function Cart() {
  const { items, removeBook, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const borrowItems = items.filter((item) => item.action === 'BORROW');
  const purchaseItems = items.filter((item) => item.action === 'BUY');
  const purchaseTotal = purchaseItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const submitCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setSubmitting(true);
    try {
      if (purchaseItems.length) await purchasesApi.buyAll(purchaseItems.map((item) => item.id));
      if (borrowItems.length) await borrowingsApi.create(borrowItems.map((item) => item.id));
      clearCart();
      setConfirmOpen(false);
      showToast('Your request was sent to the administrator for review.', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.userMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section page-section">
      <div className="container">
        <PageHeader
          eyebrow="Book cart"
          title="Review your selected books"
          description="Review books selected for purchase or borrowing before submitting your request."
        />

        {items.length === 0 ? (
          <EmptyState
            icon="cart"
            title="Your cart is empty"
            message="Browse the catalogue and add an available book before submitting a request."
            action={
              <Link className="button button--primary button--md" to="/books">
                Browse books
              </Link>
            }
          />
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((book) => (
                <article className="cart-item" key={`${book.action}-${book.id}`}>
                  <img src={getBookCover(book)} alt={`Cover of ${book.title}`} />
                  <div className="cart-item__content">
                    <span className="cart-item__label">{book.action === 'BUY' ? 'Purchase' : 'Borrow request'}</span>
                    <h2>
                      <Link to={`/books/${book.id}`}>{book.title}</Link>
                    </h2>
                    <p>by {book.author}</p>
                    {book.action === 'BUY' && <strong>{formatPrice(book.price)}</strong>}
                  </div>
                  <Button variant="ghost-danger" size="sm" onClick={() => removeBook(book.id, book.action)}>
                    Remove
                  </Button>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Request summary</h2>
              <div className="cart-summary__row">
                <span>Selected books</span>
                <strong>{items.length}</strong>
              </div>
              {purchaseItems.length > 0 && (
                <div className="cart-summary__row"><span>Purchase total</span><strong>{formatPrice(purchaseTotal)}</strong></div>
              )}
              <p>
                Purchase and borrowing requests remain pending until the administrator approves or rejects them.
              </p>
              <Button size="lg" onClick={() => setConfirmOpen(true)}>
                Review and submit
              </Button>
              <Button variant="ghost" onClick={clearCart}>
                Clear cart
              </Button>
            </aside>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={submitCart}
        loading={submitting}
        variant="primary"
        title="Confirm your cart?"
        message={`You selected ${items.length} book${items.length === 1 ? '' : 's'}: ${purchaseItems.length} to buy and ${borrowItems.length} to borrow.`}
        confirmLabel="Confirm and submit"
      />
    </section>
  );
}
