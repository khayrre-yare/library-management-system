export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <section
      className={`card ${padding ? 'card--padded' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}
