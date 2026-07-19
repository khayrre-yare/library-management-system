import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  booksApi,
  borrowingsApi,
  purchasesApi,
  contactApi,
  dashboardApi,
} from '../api/client';
import DashboardShell from '../components/layout/DashboardShell';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { getBookCover } from '../utils/bookCovers';
import { formatPrice } from '../utils/currency';
import useNotifications from '../hooks/useNotifications';
import Icon from '../components/ui/Icon';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'books', label: 'Books', icon: 'books' },
  { id: 'messages', label: 'Messages', icon: 'message' },
];

const emptyBookForm = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publishedYear: '',
  totalCopies: '1',
  price: '',
  coverUrl: '',
  description: '',
};

const statusVariant = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  RETURNED: 'neutral',
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
    : '—';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [books, setBooks] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [borrowings, setBorrowings] = useState({
    content: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [purchases, setPurchases] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [messages, setMessages] = useState({
    content: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [bookPage, setBookPage] = useState(0);
  const [borrowingPage, setBorrowingPage] = useState(0);
  const [purchasePage, setPurchasePage] = useState(0);
  const [messagePage, setMessagePage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookModal, setBookModal] = useState({ open: false, book: null });
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [bookErrors, setBookErrors] = useState({});
  const [savingBook, setSavingBook] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();
  const { notifications, refresh: refreshNotifications } = useNotifications();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDashboard(await dashboardApi.admin());
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBooks(
        await booksApi.list({
          page: bookPage,
          size: 10,
        }),
      );
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setLoading(false);
    }
  }, [bookPage]);

  const loadBorrowings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBorrowings(
        await borrowingsApi.all({
          page: borrowingPage,
          size: 10,
          status: statusFilter || undefined,
        }),
      );
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setLoading(false);
    }
  }, [borrowingPage, statusFilter]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMessages(await contactApi.list({ page: messagePage, size: 10 }));
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setLoading(false);
    }
  }, [messagePage]);

  const loadPurchases = useCallback(async () => {
    setLoading(true); setError('');
    try {
      setPurchases(await purchasesApi.all({ page: purchasePage, size: 10, status: purchaseStatusFilter || undefined }));
    } catch (requestError) { setError(requestError.userMessage); }
    finally { setLoading(false); }
  }, [purchasePage, purchaseStatusFilter]);

  useEffect(() => {
    if (activeTab === 'overview') loadDashboard();
    if (activeTab === 'books') loadBooks();
    if (activeTab === 'borrowings') loadBorrowings();
    if (activeTab === 'purchases') loadPurchases();
    if (activeTab === 'messages') loadMessages();
  }, [activeTab, loadBooks, loadBorrowings, loadDashboard, loadMessages, loadPurchases]);

  const openBookModal = (book = null) => {
    setBookErrors({});
    setBookForm(
      book
        ? {
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || '',
            category: book.category || '',
            publishedYear: book.publishedYear ? String(book.publishedYear) : '',
            totalCopies: String(book.totalCopies || 1),
            price: book.price != null ? String(book.price) : '',
            coverUrl: book.coverUrl || '',
            description: book.description || '',
          }
        : emptyBookForm,
    );
    setBookModal({ open: true, book });
  };

  const closeBookModal = () => {
    if (savingBook) return;
    setBookModal({ open: false, book: null });
    setBookForm(emptyBookForm);
    setBookErrors({});
  };

  const updateBookForm = (event) => {
    const { name, value } = event.target;
    setBookForm((current) => ({ ...current, [name]: value }));
    setBookErrors((current) => ({ ...current, [name]: '' }));
  };

  const validateBook = () => {
    const next = {};
    if (bookForm.title.trim().length < 2) next.title = 'Title must contain at least 2 characters.';
    if (bookForm.author.trim().length < 2) next.author = 'Author must contain at least 2 characters.';
    if (bookForm.isbn.trim().length < 10) next.isbn = 'ISBN must contain at least 10 characters.';
    if (bookForm.category.trim().length < 2) next.category = 'Category is required.';
    const copies = Number(bookForm.totalCopies);
    if (!Number.isInteger(copies) || copies < 1) next.totalCopies = 'Total copies must be at least 1.';
    const price = Number(bookForm.price);
    if (!Number.isFinite(price) || price <= 0) next.price = 'Price must be greater than zero.';
    if (bookForm.publishedYear) {
      const year = Number(bookForm.publishedYear);
      if (!Number.isInteger(year) || year < 1000 || year > 2100) {
        next.publishedYear = 'Enter a year between 1000 and 2100.';
      }
    }
    setBookErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveBook = async (event) => {
    event.preventDefault();
    if (!validateBook()) return;

    const payload = {
      ...bookForm,
      publishedYear: bookForm.publishedYear ? Number(bookForm.publishedYear) : null,
      totalCopies: Number(bookForm.totalCopies),
      price: Number(bookForm.price),
    };

    setSavingBook(true);
    try {
      if (bookModal.book) {
        await booksApi.update(bookModal.book.id, payload);
        showToast('Book updated successfully.', 'success');
      } else {
        await booksApi.create(payload);
        showToast('Book added to the catalogue.', 'success');
      }
      setBookModal({ open: false, book: null });
      setBookForm(emptyBookForm);
      setBookErrors({});
      await loadBooks();
    } catch (requestError) {
      setBookErrors((current) => ({ ...current, ...(requestError.validationErrors || {}) }));
      showToast(requestError.userMessage, 'error');
    } finally {
      setSavingBook(false);
    }
  };

  const runConfirmedAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'delete-book') {
        await booksApi.remove(confirmAction.book.id);
        showToast('Book deleted successfully.', 'success');
        await loadBooks();
      }

      if (confirmAction.type === 'borrowing-status') {
        await borrowingsApi.updateStatus(confirmAction.borrowing.id, confirmAction.status);
        showToast(`Borrowing marked as ${confirmAction.status.toLowerCase()}.`, 'success');
        await loadBorrowings();
        if (dashboard) loadDashboard();
      }
      if (confirmAction.type === 'purchase-status') {
        await purchasesApi.updateStatus(confirmAction.purchase.id, confirmAction.status);
        showToast(`Purchase request ${confirmAction.status.toLowerCase()}.`, 'success');
        await loadPurchases();
        await refreshNotifications();
      }
      setConfirmAction(null);
    } catch (requestError) {
      showToast(requestError.userMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const markMessageRead = async (message) => {
    if (message.read) return;
    try {
      await contactApi.markRead(message.id);
      setMessages((current) => ({
        ...current,
        content: current.content.map((item) =>
          item.id === message.id ? { ...item, read: true } : item,
        ),
      }));
      showToast('Message marked as read.', 'success');
    } catch (requestError) {
      showToast(requestError.userMessage, 'error');
    }
  };

  const modalTitle = bookModal.book ? 'Edit book' : 'Add book';
  const confirmDialog = useMemo(() => {
    if (!confirmAction) return null;
    if (confirmAction.type === 'delete-book') {
      return {
        title: 'Delete this book?',
        message: `${confirmAction.book.title} will be removed from the catalogue. This cannot be reversed.`,
        label: 'Delete book',
        variant: 'danger',
      };
    }
    if (confirmAction.type === 'purchase-status') {
      return {
        title: `${confirmAction.status === 'APPROVED' ? 'Approve' : 'Reject'} purchase request?`,
        message: `${confirmAction.purchase.bookTitle} for ${confirmAction.purchase.userName} will be ${confirmAction.status.toLowerCase()}.`,
        label: confirmAction.status === 'APPROVED' ? 'Approve purchase' : 'Reject purchase',
        variant: confirmAction.status === 'APPROVED' ? 'primary' : 'danger',
      };
    }
    return {
      title: `${confirmAction.status === 'APPROVED' ? 'Approve' : confirmAction.status === 'REJECTED' ? 'Reject' : 'Complete'} borrowing?`,
      message: `${confirmAction.borrowing.bookTitle} for ${confirmAction.borrowing.userName} will be marked as ${confirmAction.status.toLowerCase()}.`,
      label:
        confirmAction.status === 'APPROVED'
          ? 'Approve request'
          : confirmAction.status === 'REJECTED'
            ? 'Reject request'
            : 'Mark returned',
      variant: confirmAction.status === 'REJECTED' ? 'danger' : 'primary',
    };
  }, [confirmAction]);

  return (
    <DashboardShell
      title="Administration"
      description="Manage the book catalogue and contact messages."
      actions={
        activeTab === 'books' ? (
          <Button onClick={() => openBookModal()}>Add book</Button>
        ) : null
      }
      hideProfile
      sidebarContent={
        <nav className="dashboard-nav admin-sidebar-nav" aria-label="Administration sections">
          {tabs.map((tab) => {
            const count = tab.id === 'purchases'
              ? notifications.pendingPurchaseRequests
              : tab.id === 'borrowings'
                ? notifications.pendingBorrowRequests
                : 0;
            return (
              <button type="button" key={tab.id} className={activeTab === tab.id ? 'is-active' : ''}
                onClick={() => { setError(''); setActiveTab(tab.id); }}>
                <span aria-hidden="true"><Icon name={tab.icon} size={18} /></span>
                <span>{tab.label}</span>
                {count > 0 && <span className="admin-sidebar-nav__count">{count}</span>}
              </button>
            );
          })}
        </nav>
      }
    >
      {error && (
        <Alert type="error" className="space-bottom">
          {error}
        </Alert>
      )}

      {activeTab === 'overview' && (
        <AdminOverview
          dashboard={dashboard}
          loading={loading}
        />
      )}

      {activeTab === 'books' && (
        <BooksManagement
          books={books}
          loading={loading}
          onEdit={openBookModal}
          onDelete={(book) => setConfirmAction({ type: 'delete-book', book })}
          onPageChange={setBookPage}
          onAdd={() => openBookModal()}
        />
      )}

      {activeTab === 'borrowings' && (
        <BorrowingsManagement
          borrowings={borrowings}
          loading={loading}
          status={statusFilter}
          onStatusChange={(value) => {
            setBorrowingPage(0);
            setStatusFilter(value);
          }}
          onPageChange={setBorrowingPage}
          onAction={(borrowing, status) =>
            setConfirmAction({ type: 'borrowing-status', borrowing, status })
          }
        />
      )}

      {activeTab === 'purchases' && (
        <PurchasesManagement purchases={purchases} loading={loading} status={purchaseStatusFilter}
          onStatusChange={(value) => { setPurchasePage(0); setPurchaseStatusFilter(value); }}
          onPageChange={setPurchasePage}
          onAction={(purchase, status) => setConfirmAction({ type: 'purchase-status', purchase, status })} />
      )}

      {activeTab === 'messages' && (
        <MessagesManagement
          messages={messages}
          loading={loading}
          onPageChange={setMessagePage}
          onMarkRead={markMessageRead}
        />
      )}

      <Modal
        open={bookModal.open}
        onClose={closeBookModal}
        title={modalTitle}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={closeBookModal} disabled={savingBook}>
              Cancel
            </Button>
            <Button type="submit" form="book-form" loading={savingBook}>
              {bookModal.book ? 'Save changes' : 'Add book'}
            </Button>
          </>
        }
      >
        <form id="book-form" className="book-form" onSubmit={saveBook} noValidate>
          <div className="form-grid form-grid--two">
            <Input
              label="Title"
              name="title"
              value={bookForm.title}
              onChange={updateBookForm}
              error={bookErrors.title}
              required
            />
            <Input
              label="Author"
              name="author"
              value={bookForm.author}
              onChange={updateBookForm}
              error={bookErrors.author}
              required
            />
            <Input
              label="ISBN"
              name="isbn"
              value={bookForm.isbn}
              onChange={updateBookForm}
              error={bookErrors.isbn}
              required
            />
            <Input
              label="Category"
              name="category"
              value={bookForm.category}
              onChange={updateBookForm}
              error={bookErrors.category}
              required
            />
            <Input
              label="Published year"
              name="publishedYear"
              type="number"
              min="1000"
              max="2100"
              value={bookForm.publishedYear}
              onChange={updateBookForm}
              error={bookErrors.publishedYear}
            />
            <Input
              label="Total copies"
              name="totalCopies"
              type="number"
              min="1"
              max="999"
              value={bookForm.totalCopies}
              onChange={updateBookForm}
              error={bookErrors.totalCopies}
              required
            />
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={bookForm.price}
              onChange={updateBookForm}
              error={bookErrors.price}
              required
            />
          </div>
          <Input
            label="Cover image URL"
            name="coverUrl"
            type="url"
            value={bookForm.coverUrl}
            onChange={updateBookForm}
            error={bookErrors.coverUrl}
            hint="Leave blank to use the generated library cover."
          />
          <div className="field">
            <label className="field__label" htmlFor="book-description">
              Description
            </label>
            <textarea
              id="book-description"
              name="description"
              className={`field__control field__textarea ${bookErrors.description ? 'field__control--error' : ''}`}
              value={bookForm.description}
              onChange={updateBookForm}
              rows="6"
              maxLength="3000"
            />
            {bookErrors.description && <span className="field__error">{bookErrors.description}</span>}
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={runConfirmedAction}
        loading={actionLoading}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.label}
        variant={confirmDialog?.variant}
      />
    </DashboardShell>
  );
}

function AdminOverview({ dashboard, loading }) {
  if (loading && !dashboard) {
    return (
      <>
        <div className="stats-grid stats-grid--admin">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} height="126px" />
          ))}
        </div>
        <Skeleton height="240px" />
      </>
    );
  }

  if (!dashboard) return null;

  const stats = [
    ['Total books', dashboard.totalBooks, 'books'],
    ['Members', dashboard.totalMembers, 'dashboard'],
    ['Active loans', dashboard.activeLoans, 'borrow'],
    ['Pending requests', dashboard.pendingRequests, 'clock'],
    ['Unread messages', dashboard.unreadMessages, 'message'],
    ['Available copies', dashboard.availableCopies, 'check'],
  ];

  return (
    <div className="admin-overview">
      <div className="stats-grid stats-grid--admin">
        {stats.map(([label, value, icon]) => (
          <Card className="stat-card" key={label}>
            <span className="stat-card__icon"><Icon name={icon} size={21} /></span>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}

function BooksManagement({
  books,
  loading,
  onEdit,
  onDelete,
  onPageChange,
  onAdd,
}) {
  return (
    <Card padding={false} className="management-card">
      <div className="management-toolbar">
        <div>
          <h2>Book catalogue</h2>
          <span>Manage book records and availability.</span>
        </div>
        <span>{books.totalElements} catalogue records</span>
      </div>

      {loading ? (
        <div className="table-loading">
          <Skeleton height="66px" />
          <Skeleton height="66px" />
          <Skeleton height="66px" />
        </div>
      ) : books.content.length > 0 ? (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.content.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="table-book">
                      <img src={getBookCover(book)} alt="" />
                      <div>
                        <strong>{book.title}</strong>
                        <span>{book.author}</span>
                      </div>
                    </div>
                  </td>
                  <td>{book.isbn}</td>
                  <td>
                    <Badge variant="soft">{book.category}</Badge>
                  </td>
                  <td>
                    <strong>{book.availableCopies}</strong> / {book.totalCopies}
                  </td>
                  <td><strong>{formatPrice(book.price)}</strong></td>
                  <td>
                    <div className="table-actions">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(book)}>
                        Edit
                      </Button>
                      <Button variant="ghost-danger" size="sm" onClick={() => onDelete(book)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          compact
          icon="books"
          title="No books found"
          message="Add the first book to the catalogue."
          action={
            <Button size="sm" onClick={onAdd}>Add book</Button>
          }
        />
      )}

      <Pagination
        page={books.page}
        totalPages={books.totalPages}
        onPageChange={onPageChange}
        disabled={loading}
      />
    </Card>
  );
}

export function BorrowingsManagement({
  borrowings,
  loading,
  status,
  onStatusChange,
  onPageChange,
  onAction,
}) {
  return (
    <Card padding={false} className="management-card">
      <div className="management-toolbar">
        <div>
          <h2>Borrowing requests</h2>
          <span>{borrowings.totalElements} records</span>
        </div>
        <Select
          aria-label="Filter borrowing status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="RETURNED">Returned</option>
        </Select>
      </div>

      {loading ? (
        <div className="table-loading">
          <Skeleton height="66px" />
          <Skeleton height="66px" />
          <Skeleton height="66px" />
        </div>
      ) : borrowings.content.length > 0 ? (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.content.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.userName}</strong>
                    <span className="table-subtext">{item.userEmail}</span>
                  </td>
                  <td>
                    <div className="table-book table-book--compact">
                      <img
                        src={getBookCover({
                          id: item.bookId,
                          title: item.bookTitle,
                          author: item.bookAuthor,
                          coverUrl: item.coverUrl,
                        })}
                        alt=""
                      />
                      <div>
                        <strong>{item.bookTitle}</strong>
                        <span>{item.bookAuthor}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={statusVariant[item.status]}>{item.status.toLowerCase()}</Badge>
                  </td>
                  <td>
                    <span className="table-date-line">Requested: {formatDate(item.requestedAt)}</span>
                    <span className="table-date-line">Due: {formatDate(item.dueDate)}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {item.status === 'PENDING' && (
                        <>
                          <Button size="sm" onClick={() => onAction(item, 'APPROVED')}>
                            Approve
                          </Button>
                          <Button
                            variant="ghost-danger"
                            size="sm"
                            onClick={() => onAction(item, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {item.status === 'APPROVED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onAction(item, 'RETURNED')}
                        >
                          Mark returned
                        </Button>
                      )}
                      {(item.status === 'REJECTED' || item.status === 'RETURNED') && (
                        <span className="table-muted">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          compact
          icon="clock"
          title="No borrowing records"
          message="No records match the selected status."
        />
      )}

      <Pagination
        page={borrowings.page}
        totalPages={borrowings.totalPages}
        onPageChange={onPageChange}
        disabled={loading}
      />
    </Card>
  );
}

export function PurchasesManagement({ purchases, loading, status, onStatusChange, onPageChange, onAction }) {
  return (
    <Card padding={false} className="management-card">
      <div className="management-toolbar">
        <div><h2>Purchase requests</h2><span>{purchases.totalElements} records</span></div>
        <Select aria-label="Filter purchase status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="">All statuses</option><option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option>
        </Select>
      </div>
      {loading ? <div className="table-loading"><Skeleton height="66px" /><Skeleton height="66px" /></div>
        : purchases.content.length ? (
          <div className="table-scroll"><table className="data-table">
            <thead><tr><th>Member</th><th>Book</th><th>Price</th><th>Status</th><th>Requested</th><th>Actions</th></tr></thead>
            <tbody>{purchases.content.map((item) => <tr key={item.id}>
              <td><strong>{item.userName}</strong><span className="table-subtext">{item.userEmail}</span></td>
              <td><div className="table-book table-book--compact"><img src={getBookCover({ id: item.bookId, title: item.bookTitle, author: item.bookAuthor, coverUrl: item.coverUrl })} alt="" /><div><strong>{item.bookTitle}</strong><span>{item.bookAuthor}</span></div></div></td>
              <td><strong>{formatPrice(item.price)}</strong></td>
              <td><Badge variant={statusVariant[item.status]}>{item.status.toLowerCase()}</Badge></td>
              <td>{formatDate(item.requestedAt)}</td>
              <td><div className="table-actions">{item.status === 'PENDING' && <>
                <Button size="sm" onClick={() => onAction(item, 'APPROVED')}>Approve</Button>
                <Button variant="ghost-danger" size="sm" onClick={() => onAction(item, 'REJECTED')}>Reject</Button>
              </>}</div></td>
            </tr>)}</tbody>
          </table></div>
        ) : <EmptyState compact icon="purchase" title="No purchase requests" message="No records match the selected status." />}
      <Pagination page={purchases.page} totalPages={purchases.totalPages} onPageChange={onPageChange} disabled={loading} />
    </Card>
  );
}

function MessagesManagement({ messages, loading, onPageChange, onMarkRead }) {
  return (
    <Card padding={false} className="management-card">
      <div className="management-toolbar">
        <div>
          <h2>Contact messages</h2>
          <span>{messages.totalElements} messages</span>
        </div>
      </div>

      {loading ? (
        <div className="message-loading">
          <Skeleton height="150px" />
          <Skeleton height="150px" />
        </div>
      ) : messages.content.length > 0 ? (
        <div className="message-list">
          {messages.content.map((message) => (
            <article className={`message-card ${message.read ? '' : 'message-card--unread'}`} key={message.id}>
              <div className="message-card__header">
                <div>
                  <div className="message-card__name-row">
                    <strong>{message.name}</strong>
                    {!message.read && <Badge variant="warning">unread</Badge>}
                  </div>
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </div>
                <time>{formatDate(message.createdAt)}</time>
              </div>
              <h3>{message.subject}</h3>
              <p>{message.message}</p>
              {!message.read && (
                <Button variant="ghost" size="sm" onClick={() => onMarkRead(message)}>
                  Mark as read
                </Button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          compact
          icon="message"
          title="No contact messages"
          message="Messages sent through the contact page will appear here."
        />
      )}

      <Pagination
        page={messages.page}
        totalPages={messages.totalPages}
        onPageChange={onPageChange}
        disabled={loading}
      />
    </Card>
  );
}
