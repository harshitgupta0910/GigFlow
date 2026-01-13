import toast from 'react-hot-toast';

const BidCard = ({ bid, onHire, isOwner }) => {
  const statusColors = {
    pending: 'bg-blue-100 text-blue-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="card border-l-4 border-primary-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            {bid.freelancerId?.name || 'Unknown Freelancer'}
          </p>
          <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[bid.status]}`}>
            {bid.status}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bid Amount</p>
            <p className="text-xl font-bold text-primary-600">${bid.price}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Message:</p>
        <p className="text-gray-700">{bid.message}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">
          Submitted: {new Date(bid.createdAt).toLocaleString()}
        </p>
        
        {isOwner && bid.status === 'pending' && (
          <button
            onClick={() => {
              toast((t) => (
                <div className="text-center">
                  <p className="font-bold text-lg mb-3">Hire this freelancer?</p>
                  <p className="text-gray-600 mb-4 text-sm">
                    This will assign the gig and notify the freelancer immediately.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        onHire(bid._id);
                      }}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
                    >
                      Yes, Hire
                    </button>
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ), {
                duration: 10000,
                style: {
                  minWidth: '350px',
                  padding: '24px',
                }
              });
            }}
            className="btn-primary"
          >
            Hire Freelancer
          </button>
        )}
      </div>
    </div>
  );
};

export default BidCard;
