import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import Contact from '../components/Contact';
import BookModal from '../components/BookModal';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='min-h-screen bg-slate-50 pt-16'>
      {loading && (
        <div className='flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-primary-600'></div>
        </div>
      )}

      {error && (
        <div className='text-center py-20'>
          <p className='text-lg text-slate-600 mb-4'>Something went wrong</p>
          <button onClick={() => window.location.reload()} className='btn-primary'>Try Again</button>
        </div>
      )}

      {listing && !loading && !error && (
        <div className="animate-fade-in">
          {/* Image Gallery */}
          <div className="relative">
            <Swiper navigation className="h-[350px] md:h-[500px]">
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className='h-full w-full bg-cover bg-center' style={{ backgroundImage: `url(${url})` }} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className='absolute top-4 right-4 z-20 w-10 h-10 flex justify-center items-center bg-white rounded-full shadow-md hover:scale-105 transition-transform'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <FaShare className='text-slate-600 text-sm' />
            </button>
            {copied && (
              <div className='absolute top-16 right-4 z-20 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg'>
                Link copied!
              </div>
            )}
          </div>

          {/* Content */}
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col lg:flex-row gap-8'>

              {/* Main Info */}
              <div className="flex-1">
                <div className='flex flex-wrap gap-2 mb-3'>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded ${listing.type === 'rent' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                  {listing.offer && (
                    <span className='text-xs font-medium px-2.5 py-1 rounded bg-amber-50 text-amber-700'>
                      ${+listing.regularPrice - +listing.discountPrice} Off
                    </span>
                  )}
                </div>

                <h1 className='text-2xl md:text-3xl font-bold text-slate-900 mb-2'>{listing.name}</h1>

                <div className='flex items-center gap-1.5 text-slate-500 mb-4'>
                  <FaMapMarkerAlt className='text-primary-500' />
                  <p>{listing.address}</p>
                </div>

                <p className='text-2xl font-bold text-primary-600 mb-6'>
                  ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                  {listing.type === 'rent' && <span className='text-base text-slate-500 font-normal'>/month</span>}
                </p>

                <div className='border-t border-slate-100 pt-6 mb-6'>
                  <h3 className='font-semibold text-slate-800 mb-3'>About this property</h3>
                  <p className='text-slate-600 leading-relaxed'>{listing.description}</p>
                </div>

                <div className='border-t border-slate-100 pt-6'>
                  <h3 className='font-semibold text-slate-800 mb-4'>Features</h3>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {[
                      { icon: FaBed, label: `${listing.bedrooms} ${listing.bedrooms > 1 ? 'Beds' : 'Bed'}` },
                      { icon: FaBath, label: `${listing.bathrooms} ${listing.bathrooms > 1 ? 'Baths' : 'Bath'}` },
                      { icon: FaParking, label: listing.parking ? 'Parking' : 'No Parking' },
                      { icon: FaChair, label: listing.furnished ? 'Furnished' : 'Unfurnished' },
                    ].map((item, i) => (
                      <div key={i} className='flex items-center gap-2 p-3 bg-slate-50 rounded-lg'>
                        <item.icon className='text-primary-600' />
                        <span className='text-sm text-slate-700'>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                  <h3 className='font-semibold text-slate-800 mb-4'>Interested?</h3>
                  {currentUser && listing.userRef !== currentUser._id ? (
                    <div className="space-y-3">
                      {!contact ? (
                        <button onClick={() => setContact(true)} className='btn-primary w-full'>
                          Contact Owner
                        </button>
                      ) : (
                        <Contact listing={listing} />
                      )}
                      <BookModal listing={listing} />
                    </div>
                  ) : (
                    <p className='text-slate-500 text-sm text-center py-4'>
                      {currentUser && listing.userRef === currentUser._id
                        ? 'You own this listing'
                        : 'Sign in to contact the owner'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}