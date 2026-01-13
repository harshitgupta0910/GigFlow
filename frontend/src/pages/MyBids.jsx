import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBids } from '../store/slices/bidSlice';
import toast from 'react-hot-toast';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, loading } = useSelector((state) => state.bids);

  useEffect(() => {
    loadMyBids();
  }, []);

  const loadMyBids = async () => {
    try {
      await dispatch(fetchMyBids()).unwrap();
    } catch (error) {
      toast.error('Failed to load your bids');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
        <p className="text-gray-600">Track all your submitted proposals</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : myBids.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600 text-lg mb-4">You haven't submitted any bids yet</p>
          <Link to="/dashboard" className="btn-primary">
            Browse Available Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div key={bid._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {bid.gigId?.title || 'Gig Deleted'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </div>
                  
                  {bid.gigId && (
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>Gig Budget: ${bid.gigId.budget}</span>
                      <span>•</span>
                      <span className={`${
                        bid.gigId.status === 'open' ? 'text-green-600' : 'text-yellow-600'
                      } font-medium`}>
                        {bid.gigId.status}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Your Bid</p>
                  <p className="text-2xl font-bold text-primary-600">${bid.price}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Your Message:</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{bid.message}</p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Submitted {new Date(bid.createdAt).toLocaleString()}
                </p>
                
                {bid.gigId && (
                  <Link
                    to={`/gigs/${bid.gigId._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Gig →
                  </Link>
                )}
              </div>

              {bid.status === 'hired' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">Congratulations! You've been hired for this project!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;
