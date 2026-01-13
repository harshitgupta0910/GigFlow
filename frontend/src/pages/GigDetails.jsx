import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../store/slices/gigSlice';
import { fetchBidsForGig, hireBid } from '../store/slices/bidSlice';
import BidForm from '../components/bids/BidForm';
import BidCard from '../components/bids/BidCard';
import toast from 'react-hot-toast';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, loading: bidsLoading } = useSelector((state) => state.bids);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadGigDetails();
  }, [id]);

  const loadGigDetails = async () => {
    try {
      await dispatch(fetchGigById(id)).unwrap();
    } catch (error) {
      toast.error('Failed to load gig details');
      navigate('/dashboard');
    }
  };

  const loadBids = async () => {
    if (!user || !currentGig) return;
    
    if (currentGig.ownerId._id === user._id) {
      try {
        await dispatch(fetchBidsForGig(id)).unwrap();
      } catch (error) {
        toast.error('Failed to load bids');
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'bids' && currentGig) {
      loadBids();
    }
  }, [activeTab, currentGig]);

  const handleHire = async (bidId) => {
    const loadingToast = toast.loading('Processing hire request...', {
      style: {
        background: '#0ea5e9',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
      }
    });

    try {
      await dispatch(hireBid(bidId)).unwrap();
      
      toast.success('Freelancer Hired Successfully! They will receive a notification instantly.', {
        id: loadingToast,
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          color: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          minWidth: '380px',
          fontSize: '15px',
          fontWeight: '600',
        }
      });
      
      await loadGigDetails();
      await loadBids();
    } catch (error) {
      toast.error(error || 'Failed to hire freelancer', {
        id: loadingToast,
        duration: 4000,
        style: {
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
        }
      });
    }
  };

  if (gigLoading || !currentGig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isOwner = user && currentGig.ownerId._id === user._id;
  const canBid = user && !isOwner && currentGig.status === 'open';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentGig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentGig.status}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Posted by</p>
              <p className="font-medium text-gray-900">{currentGig.ownerId.name}</p>
              <p className="text-sm text-gray-500">{currentGig.ownerId.email}</p>
              <p className="text-xs text-gray-400 mt-2">
                Posted on {new Date(currentGig.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{currentGig.description}</p>
            </div>

            {currentGig.status === 'assigned' && currentGig.assignedTo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-800">This gig has been assigned to:</p>
                <p className="text-green-700">{currentGig.assignedTo.name}</p>
              </div>
            )}
          </div>

          {/* Tabs for owner */}
          {isOwner && (
            <div className="mt-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('bids')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'bids'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Bids ({bids.length})
                  </button>
                </nav>
              </div>

              {activeTab === 'bids' && (
                <div className="mt-6">
                  {bidsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : bids.length === 0 ? (
                    <div className="card text-center py-8">
                      <p className="text-gray-600">No bids received yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bids.map((bid) => (
                        <BidCard
                          key={bid._id}
                          bid={bid}
                          onHire={handleHire}
                          isOwner={isOwner}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Budget</p>
              <p className="text-4xl font-bold text-primary-600">${currentGig.budget}</p>
            </div>

            {canBid ? (
              <BidForm gigId={currentGig._id} onSuccess={() => toast.success('Check "My Bids" to see your submission')} />
            ) : (
              <div className="text-center py-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  {!user ? 'Login to submit a bid' : 
                   isOwner ? 'You own this gig' : 
                   'This gig is closed'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
