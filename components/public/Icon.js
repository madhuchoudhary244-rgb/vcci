export default function Icon({ name, className = '' }) {
  const paths = {
    arrow: <path d="m5 12 4 4L19 6" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /></>,
    faculty: <><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    practice: <><path d="M4 4h16v12H4z" /><path d="M8 20h8M12 16v4" /></>,
    certificate: <><path d="M6 3h12v14H6z" /><path d="m9 10 2 2 4-4M9 21l3-2 3 2v-4H9z" /></>,
    infrastructure: <><path d="M4 21V5l8-3 8 3v16" /><path d="M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" /></>,
    support: <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5 11 15l4.5-5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    online: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  };

  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}
