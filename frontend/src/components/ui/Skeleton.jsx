export default function Skeleton({ className = '', height, width, rounded = false }) {
  return (
    <span
      className={`skeleton ${rounded ? 'skeleton--rounded' : ''} ${className}`.trim()}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
}
