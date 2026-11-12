import Footer from './Footer';
import Header from './Header';

export default function PublicPage({ children }) {
  return <><Header />{children}<Footer /></>;
}
