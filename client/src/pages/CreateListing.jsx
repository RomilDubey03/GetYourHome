import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash } from 'react-icons/fa';
import axiosClient from '../utils/axiosClient.js';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      setUploadProgress(0);

      try {
        const formDataUpload = new FormData();
        for (let i = 0; i < files.length; i++) {
          formDataUpload.append('images', files[i]);
        }

        const response = await axiosClient.post('/api/v1/upload/multiple', formDataUpload, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        });

        const uploadedImages = response.data.data.images.map(img => img.url);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(uploadedImages),
        });
        setImageUploadError(false);
        setFiles([]);
      } catch (err) {
        setImageUploadError('Image upload failed (5MB max per image)');
      }
      setUploading(false);
      setUploadProgress(0);
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const response = await axiosClient.post('/api/v1/listings/create', {
        ...formData,
        userRef: currentUser._id,
      });
      setLoading(false);
      const data = response.data.data || response.data;
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message || 'Failed to create listing');
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50 pt-20 pb-10'>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='text-3xl font-bold text-center my-8 text-slate-800 font-heading'>
          Create a New Listing
        </h1>
        <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
          <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-10'>
            <div className='flex flex-col gap-6 flex-1'>
              <div className='space-y-4'>
                <input
                  type='text'
                  placeholder='Property Name'
                  className='input-field'
                  id='name'
                  maxLength='62'
                  minLength='10'
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
                <textarea
                  type='text'
                  placeholder='Description'
                  className='input-field min-h-[120px] resize-y'
                  id='description'
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
                <input
                  type='text'
                  placeholder='Address'
                  className='input-field'
                  id='address'
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>

              <div className='flex flex-wrap gap-4'>
                <label className='flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-400 transition-colors'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300'
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                  />
                  <span className='font-medium text-slate-700'>Sell</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-400 transition-colors'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300'
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                  />
                  <span className='font-medium text-slate-700'>Rent</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-400 transition-colors'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300'
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span className='font-medium text-slate-700'>Parking</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-400 transition-colors'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300'
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span className='font-medium text-slate-700'>Furnished</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-400 transition-colors'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300'
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <span className='font-medium text-slate-700'>Offer</span>
                </label>
              </div>

              <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-3'>
                  <input
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    className='p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 w-20 text-center'
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                  <p className='font-medium text-slate-600'>Beds</p>
                </div>
                <div className='flex items-center gap-3'>
                  <input
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    className='p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 w-20 text-center'
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                  <p className='font-medium text-slate-600'>Baths</p>
                </div>
                <div className='flex items-center gap-3'>
                  <input
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='10000000'
                    required
                    className='p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 w-32'
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <div className='flex flex-col'>
                    <p className='font-medium text-slate-600'>Regular Price</p>
                    {formData.type === 'rent' && (
                      <span className='text-xs text-slate-400'>($ / month)</span>
                    )}
                  </div>
                </div>
                {formData.offer && (
                  <div className='flex items-center gap-3'>
                    <input
                      type='number'
                      id='discountPrice'
                      min='0'
                      max='10000000'
                      required
                      className='p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 w-32'
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <div className='flex flex-col'>
                      <p className='font-medium text-slate-600'>Discounted Price</p>
                      {formData.type === 'rent' && (
                        <span className='text-xs text-slate-400'>($ / month)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='flex flex-col flex-1 gap-6'>
              <div>
                <p className='font-semibold text-slate-700 mb-2'>
                  Property Images
                  <span className='font-normal text-slate-400 ml-2 text-sm'>
                    (Max 6 images, first is cover)
                  </span>
                </p>
                <div className='flex gap-4'>
                  <label className='flex-1 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary-400 transition-colors h-32'>
                    <input
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className='hidden'
                      type='file'
                      id='images'
                      accept='image/*'
                      multiple
                    />
                    <FaUpload className='text-gray-400 text-2xl mb-2' />
                    <span className='text-gray-500 font-medium'>Click to select</span>
                    {files.length > 0 && (
                      <span className='text-primary-600 text-sm mt-1'>{files.length} files selected</span>
                    )}
                  </label>
                  <button
                    type='button'
                    disabled={uploading || files.length === 0}
                    onClick={handleImageSubmit}
                    className='px-6 py-3 text-green-700 border border-green-700 rounded-xl uppercase hover:bg-green-50 disabled:opacity-50 transition-colors font-medium h-fit self-center'
                  >
                    {uploading ? `${uploadProgress}%` : 'Upload'}
                  </button>
                </div>
              </div>

              <p className='text-red-500 text-sm font-medium'>
                {imageUploadError && imageUploadError}
              </p>

              <div className='grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
                {formData.imageUrls.length > 0 &&
                  formData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className='relative group rounded-xl overflow-hidden shadow-sm border border-gray-200'
                    >
                      <img
                        src={url}
                        alt='listing image'
                        className='w-full h-32 object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
              </div>

              <button
                disabled={loading || uploading}
                className='btn-primary mt-4 py-4 text-lg shadow-soft'
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </button>
              {error && <p className='text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center'>{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}