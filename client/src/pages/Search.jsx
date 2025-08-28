import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { FaSearch, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex flex-col md:flex-row max-w-7xl mx-auto'>
        {/* Mobile filters toggle */}
        <div className='md:hidden p-4 border-b'>
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className='flex items-center gap-2 w-full justify-between px-4 py-3 bg-white rounded-lg shadow-sm border'
          >
            <div className='flex items-center gap-2'>
              <FaFilter className='text-blue-600' />
              <span className='font-medium'>Filters</span>
            </div>
            {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Sidebar */}
        <div className={`p-6 bg-white border-r-0 md:border-r-2 md:min-h-screen md:w-80 transition-all ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <h2 className='text-xl font-bold text-slate-800 mb-6 flex items-center gap-2'>
            <FaFilter className='text-blue-600' />
            Filter Properties
          </h2>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400' />
              </div>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search by name or location...'
                className='pl-10 w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Property Type:</label>
              <div className='space-y-2'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='all'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    onChange={handleChange}
                    checked={sidebardata.type === 'all'}
                  />
                  <label htmlFor='all' className='ml-2 text-sm text-gray-700'>Rent & Sale</label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    onChange={handleChange}
                    checked={sidebardata.type === 'rent'}
                  />
                  <label htmlFor='rent' className='ml-2 text-sm text-gray-700'>Rent</label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    onChange={handleChange}
                    checked={sidebardata.type === 'sale'}
                  />
                  <label htmlFor='sale' className='ml-2 text-sm text-gray-700'>Sale</label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    onChange={handleChange}
                    checked={sidebardata.offer}
                  />
                  <label htmlFor='offer' className='ml-2 text-sm text-gray-700'>Special Offers</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Amenities:</label>
              <div className='space-y-2'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    onChange={handleChange}
                    checked={sidebardata.parking}
                  />
                  <label htmlFor='parking' className='ml-2 text-sm text-gray-700'>Parking</label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                  />
                  <label htmlFor='furnished' className='ml-2 text-sm text-gray-700'>Furnished</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Sort By:</label>
              <select
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort_order'
                className='w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='regularPrice_desc'>Price: High to Low</option>
                <option value='regularPrice_asc'>Price: Low to High</option>
                <option value='createdAt_desc'>Newest First</option>
                <option value='createdAt_asc'>Oldest First</option>
              </select>
            </div>
            
            <button className='bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'>
              Apply Filters
            </button>
          </form>
        </div>
        
        {/* Main content */}
        <div className='flex-1 p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold text-slate-800'>
              {listings.length > 0 ? `Found ${listings.length} Properties` : 'Search Properties'}
            </h1>
            {listings.length > 0 && (
              <p className='text-sm text-gray-500'>
                {sidebardata.searchTerm && `Search results for "${sidebardata.searchTerm}"`}
              </p>
            )}
          </div>
          
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : listings.length === 0 ? (
            <div className='text-center py-12'>
              <div className='mx-auto h-24 w-24 text-gray-300 mb-4'>
                <FaSearch size={96} className='mx-auto opacity-50' />
              </div>
              <h3 className='text-lg font-medium text-gray-700 mb-2'>No properties found</h3>
              <p className='text-gray-500'>Try adjusting your search filters to find what you're looking for.</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
              
              {showMore && (
                <div className='flex justify-center mt-8'>
                  <button
                    onClick={onShowMoreClick}
                    className='bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors'
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}