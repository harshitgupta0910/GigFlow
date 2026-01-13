import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBid } from '../../store/slices/bidSlice';
import toast from 'react-hot-toast';

const BidForm = ({ gigId, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    message: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message || !formData.price) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.price < 1) {
      toast.error('Price must be at least $1');
      return;
    }

    setLoading(true);
    
    try {
      await dispatch(createBid({
        gigId,
        message: formData.message,
        price: Number(formData.price)
      })).unwrap();
      
      toast.success('Bid Submitted! Your proposal has been sent to the client', {
        duration: 4000,
        style: {
          fontSize: '15px',
          fontWeight: '600',
        }
      });
      setFormData({ message: '', price: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error || 'Failed to submit bid', {
        style: {
          fontSize: '15px',
          fontWeight: '600',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-blue-50">
      <h3 className="text-xl font-semibold mb-4">Submit Your Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Why are you the best fit for this project?"
            rows="4"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Price ($)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter your bid amount"
            min="1"
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;
