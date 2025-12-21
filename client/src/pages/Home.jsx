import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRight } from 'react-icons/fa';

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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className='text-slate-900 font-heading font-bold text-4xl lg:text-6xl leading-tight mb-6'>
              Find your perfect place with ease
            </h1>
            <p className='text-slate-600 text-lg leading-relaxed mb-8'>
              Discover a wide range of properties curated just for you. From cozy apartments to spacious family homes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={'/search'} className='btn-primary inline-flex items-center gap-2'>
                Start Exploring
                <FaArrowRight className="text-sm" />
              </Link>
              <Link to={'/search?offer=true'} className='btn-secondary'>
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Swiper */}
      {offerListings && offerListings.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Swiper
            navigation
            autoplay={{ delay: 5000 }}
            effect={'fade'}
            loop={true}
            className="rounded-2xl overflow-hidden h-[400px] md:h-[480px]"
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(${listing.imageUrls[0]}) center/cover no-repeat`,
                  }}
                  className='h-full flex items-end p-8 md:p-10'
                >
                  <div className="text-white max-w-xl">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 font-heading">{listing.name}</h3>
                    <p className="mb-4 text-white/80 text-sm md:text-base line-clamp-1">{listing.address}</p>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="inline-block px-5 py-2.5 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Listing Sections */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24'>

        {/* Offers */}
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='section-title'>Recent Offers</h2>
                <p className="section-subtitle">Deals you don't want to miss</p>
              </div>
              <Link to={'/search?offer=true'} className='text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1'>
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rentListings && rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='section-title'>Places for Rent</h2>
                <p className="section-subtitle">Find your temporary home</p>
              </div>
              <Link to={'/search?type=rent'} className='text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1'>
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Sale */}
        {saleListings && saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='section-title'>Places for Sale</h2>
                <p className="section-subtitle">Find your forever home</p>
              </div>
              <Link to={'/search?type=sale'} className='text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1'>
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}