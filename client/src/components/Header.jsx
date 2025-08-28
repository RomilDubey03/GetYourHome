import { FaSearch, FaHome, FaInfoCircle, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
        <Link to="/" className="flex items-center">
          <h1 className="font-bold text-xl sm:text-2xl flex">
            <span className="text-blue-600">GetYour</span>
            <span className="text-slate-800">Home</span>
          </h1>
        </Link>
        
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
          <div className="relative flex items-center">
            <TextInput
              id="search"
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full pl-5 pr-12 py-2 border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="absolute right-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FaSearch size={16} className='text-white' />
            </button> 
          </div>
        </form>
        
        <ul className="flex items-center gap-4">
          <Link to="/" className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
            <FaHome className="text-lg" />
            <span className="hidden lg:inline">Home</span>
          </Link>
          
          <Link to="/about" className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
            <FaInfoCircle className="text-lg" />
            <span className="hidden lg:inline">About</span>
          </Link>
          
          <Link to="/profile?tab=profile" className="flex items-center">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 transition-colors rounded-full pl-1 pr-3 py-1">
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-white"
                  src={currentUser.avatar ? currentUser.avatar :  "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"}
                  alt="profile"
                />
                <span className="hidden md:inline text-sm font-medium text-slate-800">
                  {currentUser.username}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-full pl-3 pr-4 py-2">
                <FaUser className="text-sm" />
                <span className="text-sm font-medium">Sign in</span>
              </div>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}