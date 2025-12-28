import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { FaSearch } from 'react-icons/fa';
import axiosClient from '../utils/axiosClient.js';

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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      try {
        const response = await axiosClient.get(`/api/v1/listings/get?${searchQuery}`);
        const data = response.data.data || response.data;
        setShowMore(data.length > 8);
        setListings(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked });
    }
    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort: sort || 'created_at', order: order || 'desc' });
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
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    try {
      const response = await axiosClient.get(`/api/v1/listings/get?${urlParams.toString()}`);
      const data = response.data.data || response.data;
      if (data.length < 9) setShowMore(false);
      setListings([...listings, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 pt-16'>
      <div className='flex flex-col lg:flex-row max-w-7xl mx-auto'>

        {/* Sidebar */}
        <div className='p-6 bg-white border-r border-slate-100 lg:w-72 lg:min-h-screen'>
          <h2 className='text-lg font-semibold text-slate-800 mb-6'>Filters</h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='text-sm font-medium text-slate-700 mb-2 block'>Search</label>
              <div className='relative'>
                <FaSearch className='absolute left-3 top-3 text-slate-400 text-sm' />
                <input
                  type='text'
                  id='searchTerm'
                  placeholder='Address, city...'
                  className='input-field pl-9 text-sm'
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-slate-700 mb-3 block'>Type</label>
              <div className='space-y-2'>
                {['all', 'rent', 'sale'].map((type) => (
                  <label key={type} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='type'
                      id={type}
                      className='w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500'
                      onChange={handleChange}
                      checked={sidebardata.type === type}
                    />
                    <span className='text-sm text-slate-600 capitalize'>{type === 'all' ? 'All' : `For ${type}`}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-slate-700 mb-3 block'>Amenities</label>
              <div className='space-y-2'>
                {[{ id: 'parking', label: 'Parking' }, { id: 'furnished', label: 'Furnished' }, { id: 'offer', label: 'Special Offer' }].map((item) => (
                  <label key={item.id} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      id={item.id}
                      className='w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500'
                      onChange={handleChange}
                      checked={sidebardata[item.id]}
                    />
                    <span className='text-sm text-slate-600'>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-slate-700 mb-2 block'>Sort By</label>
              <select
                onChange={handleChange}
                defaultValue='created_at_desc'
                id='sort_order'
                className='input-field text-sm'
              >
                <option value='regularPrice_desc'>Price: High to Low</option>
                <option value='regularPrice_asc'>Price: Low to High</option>
                <option value='createdAt_desc'>Newest First</option>
                <option value='createdAt_asc'>Oldest First</option>
              </select>
            </div>

            <button className='w-full btn-primary text-sm'>
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results */}
        <div className='flex-1 p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='section-title'>Properties</h1>
            {listings.length > 0 && (
              <span className='text-sm text-slate-500'>{listings.length} results</span>
            )}
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-primary-600'></div>
            </div>
          ) : listings.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl border border-slate-100'>
              <FaSearch size={32} className='mx-auto text-slate-300 mb-4' />
              <h3 className='text-lg font-semibold text-slate-800 mb-1'>No properties found</h3>
              <p className='text-slate-500 text-sm'>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>

              {showMore && (
                <div className='flex justify-center mt-10'>
                  <button onClick={onShowMoreClick} className='btn-secondary text-sm'>
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