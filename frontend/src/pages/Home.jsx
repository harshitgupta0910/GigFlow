import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to GigFlow
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              The Modern Freelance Marketplace - Connect, Bid, and Grow
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get Started
              </Link>
              <Link to="/dashboard" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition border-2 border-white">
                Browse Gigs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Post a Gig</h3>
            <p className="text-gray-600">
              Create a job posting with your requirements and budget
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💼</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Receive Bids</h3>
            <p className="text-gray-600">
              Talented freelancers submit their proposals and pricing
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hire & Collaborate</h3>
            <p className="text-gray-600">
              Choose the best freelancer and start working together
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of freelancers and clients on GigFlow
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
