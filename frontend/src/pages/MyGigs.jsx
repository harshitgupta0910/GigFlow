import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyGigs } from '../store/slices/gigSlice';
import toast from 'react-hot-toast';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, loading } = useSelector((state) => state.gigs);

  useEffect(() => {
    loadMyGigs();
  }, []);

  const loadMyGigs = async () => {
    try {
      await dispatch(fetchMyGigs()).unwrap();
    } catch (error) {
      toast.error('Failed to load your gigs');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posted Gigs</h1>
          <p className="text-gray-600">Manage your job postings</p>
        </div>
        <Link to="/create-gig" className="btn-primary">
          Post New Gig
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : myGigs.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600 text-lg mb-4">You haven't posted any gigs yet</p>
          <Link to="/create-gig" className="btn-primary">
            Post Your First Gig
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myGigs.map((gig) => (
            <div key={gig._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{gig.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {gig.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{gig.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="font-semibold text-primary-600 text-lg">${gig.budget}</span>
                    <span>Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
                    {gig.assignedTo && (
                      <span className="text-green-600">
                        Assigned to {gig.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>
                
                <Link
                  to={`/gigs/${gig._id}`}
                  className="btn-primary ml-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
