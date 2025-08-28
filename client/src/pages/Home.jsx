import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay, EffectFade]);
  
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative flex flex-col gap-6 px-4 py-20 md:px-8 lg:px-28 lg:pb-10 lg:pt-32 max-w-7xl mx-auto">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 -z-10 rounded-b-3xl"></div>
        
        <h1 className='text-slate-800 font-bold text-4xl lg:text-6xl leading-tight'>
          Find your next <span className='text-blue-600'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-600 text-base sm:text-lg max-w-2xl'>
          GetYourHome is the best place to find your next perfect place to
          live. We have a wide range of properties for you to choose from.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            to={'/search'}
            className='px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg'
          >
            Get Started
          </Link>
          <Link
            to={'/search?offer=true'}
            className='px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors'
          >
            View Special Offers
          </Link>
        </div>
      </div>

      {/* Featured Listings Swiper */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Featured Properties</h2>
          <p className="text-gray-500 mt-2">Discover our most popular listings</p>
        </div>
        
        {offerListings && offerListings.length > 0 && (
          <Swiper 
            navigation 
            autoplay={{ delay: 5000 }}
            effect={'fade'}
            loop={true}
            className="rounded-2xl shadow-xl overflow-hidden"
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px] flex items-end p-8'
                >
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">{listing.name}</h3>
                    <p className="mb-4 max-w-md">{listing.description.substring(0, 120)}...</p>
                    <Link 
                      to={`/listing/${listing._id}`}
                      className="inline-block px-5 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* listing results for offer, sale and rent */}
      <div className='max-w-7xl mx-auto px-4 py-12 flex flex-col gap-12'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-slate-800'>Recent offers</h2>
              <Link 
                className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group' 
                to={'/search?offer=true'}
              >
                Show all offers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-slate-800'>Recent places for rent</h2>
              <Link 
                className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group' 
                to={'/search?type=rent'}
              >
                Show all rentals
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-slate-800'>Recent places for sale</h2>
              <Link 
                className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group' 
                to={'/search?type=sale'}
              >
                Show all properties
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}