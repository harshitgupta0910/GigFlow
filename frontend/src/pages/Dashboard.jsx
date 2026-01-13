import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigSlice';
import GigCard from '../components/gigs/GigCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { gigs, loading } = useSelector((state) => state.gigs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGigs, setFilteredGigs] = useState([]);

  useEffect(() => {
    loadGigs();
  }, []);

  useEffect(() => {
    setFilteredGigs(gigs);
  }, [gigs]);

  const loadGigs = async () => {
    try {
      await dispatch(fetchGigs()).unwrap();
    } catch (error) {
      toast.error('Failed to load gigs');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filtered = gigs.filter(gig => 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGigs(filtered);
    } else {
      setFilteredGigs(gigs);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Gigs</h1>
        <p className="text-gray-600">Find your next project opportunity</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs by title or description..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
          {searchQuery && (
            <button 
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilteredGigs(gigs);
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Gigs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading gigs...</p>
        </div>
      ) : filteredGigs.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600 text-lg">
            {searchQuery ? 'No gigs found matching your search' : 'No gigs available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
