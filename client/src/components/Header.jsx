import { FaSearch, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="font-heading font-bold text-xl tracking-tight">
            <span className="text-slate-800">GetYour</span>
            <span className="text-primary-600">Home</span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 max-w-sm mx-8 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 pl-10 text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
            />
            <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
          </div>
        </form>

        <nav className="flex items-center gap-1">
          <Link to="/" className="hidden md:block px-3 py-2 text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">
            Home
          </Link>
          <Link to="/about" className="hidden md:block px-3 py-2 text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">
            About
          </Link>

          <Link to="/profile?tab=profile" className="ml-2">
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
                <span className="hidden md:inline text-sm font-medium text-slate-700">
                  {currentUser.username}
                </span>
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar || "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"}
                  alt="profile"
                />
              </div>
            ) : (
              <button className="text-sm font-medium text-white bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Sign In
              </button>
            )}
          </Link>
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 pl-9 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
          </div>
        </form>
      </div>
    </header>
  );
}