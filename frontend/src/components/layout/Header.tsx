import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-indigo-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Bond Yield Calculator
          </Link>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="hover:text-indigo-200 transition-colors font-medium"
            >
              Calculator
            </Link>
            <Link
              to="/faq"
              className="hover:text-indigo-200 transition-colors font-medium"
            >
              FAQ
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
