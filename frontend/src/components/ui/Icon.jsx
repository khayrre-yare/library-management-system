const icons = {
  home: <><path d="M3.5 10.8 12 3.8l8.5 7" /><path d="M5.5 9.8v10.4h13V9.8M9.5 20.2v-6h5v6" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  books: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" /></>,
  orders: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2.8h6V4M8.5 9h7M8.5 13h7M8.5 17h4" /></>,
  borrow: <><path d="M4 5h11a3 3 0 0 1 3 3v1" /><path d="m15 6 3 3 3-3M20 19H9a3 3 0 0 1-3-3v-1" /><path d="m9 18-3-3-3 3" /></>,
  purchase: <><circle cx="12" cy="12" r="9" /><path d="M15.2 8.5h-4.5a2 2 0 0 0 0 4h2.6a2 2 0 0 1 0 4H8.8M12 6.5v11" /></>,
  message: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  cart: <><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H6" /><circle cx="9.5" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  alert: <><path d="M10.3 4.2 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.2a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  check: <path d="m5 12.5 4.2 4.2L19.5 6.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  returned: <><path d="M4 7v5h5" /><path d="M5.7 16.2A8 8 0 1 0 6 7.2L4 9" /></>,
  inbox: <><path d="M4 4h16l1 11v5H3v-5L4 4Z" /><path d="M3 15h5l2 3h4l2-3h5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" /><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" /><path d="m5 13 .8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" /></>,
};

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={`ui-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name] || icons.sparkles}
    </svg>
  );
}
