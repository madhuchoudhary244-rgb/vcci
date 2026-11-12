import './globals.css';

export const metadata = {
  title: 'VCCI | Vision Computer & Coaching Institute, Ludhiana',
  description: 'Vision Computer & Coaching Institute in Ludhiana offers practical computer courses and technology skill development.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
