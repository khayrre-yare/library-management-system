import { useEffect, useState } from 'react';
import Button from './Button';
import Icon from './Icon';

export default function SearchBar({
  value = '',
  onSearch,
  placeholder = 'Search…',
  buttonLabel = 'Search',
}) {
  const [query, setQuery] = useState(value);

  useEffect(() => setQuery(value), [value]);

  const submit = (event) => {
    event.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form className="search-bar" onSubmit={submit} role="search">
      <span className="search-bar__icon" aria-hidden="true">
        <Icon name="search" size={19} />
      </span>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {query && (
        <button
          type="button"
          className="search-bar__clear"
          aria-label="Clear search"
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
        >
          <Icon name="close" size={16} />
        </button>
      )}
      <Button type="submit" size="sm">
        {buttonLabel}
      </Button>
    </form>
  );
}
