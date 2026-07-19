import Button from './Button';

export default function Pagination({ page, totalPages, onPageChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) return null;

  const visible = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let index = start; index <= end; index += 1) visible.push(index);

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <div className="pagination__pages">
        {start > 0 && <span className="pagination__ellipsis">…</span>}
        {visible.map((index) => (
          <button
            type="button"
            key={index}
            className={`pagination__page ${index === page ? 'is-active' : ''}`}
            onClick={() => onPageChange(index)}
            disabled={disabled}
            aria-current={index === page ? 'page' : undefined}
          >
            {index + 1}
          </button>
        ))}
        {end < totalPages - 1 && <span className="pagination__ellipsis">…</span>}
      </div>
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
