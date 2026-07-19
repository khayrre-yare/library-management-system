import { useEffect, useMemo, useState } from 'react';
import { borrowingsApi, dashboardApi, purchasesApi } from '../api/client';
import DashboardShell from '../components/layout/DashboardShell';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { getBookCover } from '../utils/bookCovers';
import { formatPrice } from '../utils/currency';
import Icon from '../components/ui/Icon';

const sections = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'borrowed', label: 'Borrowed books', icon: 'books' },
  { id: 'purchased', label: 'Purchased books', icon: 'purchase' },
  { id: 'pending', label: 'Pending requests', icon: 'clock' },
];

const badgeVariant = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger', RETURNED: 'neutral' };
const formatDate = (value) => value
  ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
  : '—';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      dashboardApi.user(),
      borrowingsApi.mine({ page: 0, size: 100 }),
      purchasesApi.mine({ page: 0, size: 100 }),
    ])
      .then(([summaryData, borrowingData, purchaseData]) => {
        setSummary(summaryData);
        setBorrowings(borrowingData.content || []);
        setPurchases(purchaseData.content || []);
      })
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, []);

  const borrowedBooks = useMemo(
    () => borrowings.filter((item) => item.status === 'APPROVED' || item.status === 'RETURNED'),
    [borrowings],
  );
  const purchasedBooks = useMemo(
    () => purchases.filter((item) => item.status === 'APPROVED'),
    [purchases],
  );
  const pendingItems = useMemo(
    () => [
      ...borrowings.filter((item) => item.status === 'PENDING').map((item) => ({ ...item, requestType: 'Borrow' })),
      ...purchases.filter((item) => item.status === 'PENDING').map((item) => ({ ...item, requestType: 'Purchase' })),
    ].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)),
    [borrowings, purchases],
  );

  return (
    <DashboardShell
      title="My dashboard"
      description="Track your borrowed books, purchases, and requests awaiting review."
      hideProfile
      sidebarContent={
        <nav className="dashboard-nav admin-sidebar-nav" aria-label="My dashboard sections">
          {sections.map((section) => {
            const count = section.id === 'pending' ? pendingItems.length : 0;
            return (
              <button type="button" key={section.id} className={activeSection === section.id ? 'is-active' : ''}
                onClick={() => setActiveSection(section.id)}>
                <span aria-hidden="true"><Icon name={section.icon} size={18} /></span>
                <span>{section.label}</span>
                {count > 0 && <span className="admin-sidebar-nav__count">{count}</span>}
              </button>
            );
          })}
        </nav>
      }
    >
      {error && <Alert type="error" className="space-bottom">{error}</Alert>}
      {loading ? <DashboardLoading /> : (
        <>
          {activeSection === 'overview' && (
            <div className="stats-grid">
              <Stat icon="books" label="Borrowed books" value={borrowedBooks.length} />
              <Stat icon="purchase" label="Purchased books" value={purchasedBooks.length} />
              <Stat icon="clock" label="Pending requests" value={pendingItems.length} />
              <Stat icon="alert" label="Overdue loans" value={summary?.overdueLoans || 0} />
            </div>
          )}
          {activeSection === 'borrowed' && <BorrowedBooks items={borrowedBooks} />}
          {activeSection === 'purchased' && <PurchasedBooks items={purchasedBooks} />}
          {activeSection === 'pending' && <PendingRequests items={pendingItems} />}
        </>
      )}
    </DashboardShell>
  );
}

function Stat({ icon, label, value }) {
  return <Card className="stat-card"><span className="stat-card__icon"><Icon name={icon} size={21} /></span><div><span>{label}</span><strong>{value}</strong></div></Card>;
}

function DashboardLoading() {
  return <><div className="stats-grid">{[1, 2, 3, 4].map((item) => <Skeleton key={item} height="126px" />)}</div><Skeleton height="320px" /></>;
}

function BookCell({ item }) {
  return <div className="table-book"><img src={getBookCover({ id: item.bookId, title: item.bookTitle, author: item.bookAuthor, coverUrl: item.coverUrl })} alt="" /><div><strong>{item.bookTitle}</strong><span>{item.bookAuthor}</span></div></div>;
}

function BorrowedBooks({ items }) {
  return <RecordsCard title="Borrowed books" description="Books approved for borrowing and your return history" items={items}
    emptyTitle="No borrowed books" emptyMessage="Approved borrowing requests will appear here."
    columns={<><th>Book</th><th>Status</th><th>Approved</th><th>Due date</th><th>Returned</th></>}
    renderRow={(item) => <tr key={item.id}><td><BookCell item={item} /></td><td><Badge variant={badgeVariant[item.status]}>{item.status.toLowerCase()}</Badge></td><td>{formatDate(item.approvedAt)}</td><td>{formatDate(item.dueDate)}</td><td>{formatDate(item.returnedAt)}</td></tr>} />;
}

function PurchasedBooks({ items }) {
  return <RecordsCard title="Purchased books" description="Purchase requests approved by the library" items={items}
    emptyTitle="No purchased books" emptyMessage="Approved purchases will appear here."
    columns={<><th>Book</th><th>Price</th><th>Status</th><th>Approved</th></>}
    renderRow={(item) => <tr key={item.id}><td><BookCell item={item} /></td><td><strong>{formatPrice(item.price)}</strong></td><td><Badge variant="success">approved</Badge></td><td>{formatDate(item.decidedAt)}</td></tr>} />;
}

function PendingRequests({ items }) {
  return <RecordsCard title="Pending requests" description="Requests waiting for an administrator decision" items={items}
    emptyTitle="No pending requests" emptyMessage="You are all caught up."
    columns={<><th>Book</th><th>Request type</th><th>Price</th><th>Status</th><th>Requested</th></>}
    renderRow={(item) => <tr key={`${item.requestType}-${item.id}`}><td><BookCell item={item} /></td><td>{item.requestType}</td><td>{item.requestType === 'Purchase' ? formatPrice(item.price) : '—'}</td><td><Badge variant="warning">pending</Badge></td><td>{formatDate(item.requestedAt)}</td></tr>} />;
}

function RecordsCard({ title, description, items, columns, renderRow, emptyTitle, emptyMessage }) {
  return <Card className="dashboard-table-card" padding={false}>
    <div className="card-heading card-heading--padded"><div><h2>{title}</h2><p>{description}</p></div></div>
    {items.length ? <div className="table-scroll"><table className="data-table"><thead><tr>{columns}</tr></thead><tbody>{items.map(renderRow)}</tbody></table></div>
      : <EmptyState compact icon="books" title={emptyTitle} message={emptyMessage} />}
  </Card>;
}
