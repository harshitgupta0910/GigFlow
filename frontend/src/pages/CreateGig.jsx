import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/slices/gigSlice';
import toast from 'react-hot-toast';

const CreateGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.gigs);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.budget < 1) {
      toast.error('Budget must be at least $1');
      return;
    }

    try {
      await dispatch(createGig({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget)
      })).unwrap();
      
      toast.success('Gig Posted Successfully! Freelancers can now submit bids', {
        duration: 4000,
        style: {
          fontSize: '15px',
          fontWeight: '600',
        }
      });
      navigate('/my-gigs');
    } catch (error) {
      toast.error(error || 'Failed to post gig. Please try again', {
        style: {
          fontSize: '15px',
          fontWeight: '600',
        }
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Gig</h1>
        <p className="text-gray-600">Create a job posting to find the perfect freelancer</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Full Stack Web Developer Needed"
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific about what you need (minimum 5 characters)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project requirements, expected deliverables, timeline, etc."
              rows="8"
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide detailed information (minimum 20 characters)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget ($) *
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="1000"
              min="1"
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your budget in USD
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Gig'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
