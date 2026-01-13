import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  const statusColor = gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="card hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 flex-1">
          {gig.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {gig.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {gig.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-2xl font-bold text-primary-600">${gig.budget}</p>
        </div>
        
        <Link 
          to={`/gigs/${gig._id}`}
          className="btn-primary"
        >
          View Details
        </Link>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Posted by: <span className="font-medium text-gray-700">{gig.ownerId?.name || 'Unknown'}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(gig.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default GigCard;
