import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting bids' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title budget');

    res.status(201).json(populatedBid);
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({ message: 'Error creating bid' });
  }
};

export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the gig owner can view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Error fetching bids' });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title budget status')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ message: 'Error fetching your bids' });
  }
};

export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).populate('gigId').session(session);
    
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = bid.gigId;

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Only the gig owner can hire freelancers' });
    }

    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'This gig has already been assigned' });
    }

    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'This bid is no longer available' });
    }

    gig.status = 'assigned';
    gig.assignedTo = bid.freelancerId;
    await gig.save({ session });

    bid.status = 'hired';
    await bid.save({ session });

    await Bid.updateMany(
      { 
        gigId: gig._id, 
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title budget status');

    const io = req.app.get('io');
    if (io) {
      io.to(bid.freelancerId.toString()).emit('hired', {
        message: `You have been hired for "${gig.title}"!`,
        gigId: gig._id,
        gigTitle: gig.title,
        bidId: bid._id
      });
    }

    res.json({
      message: 'Freelancer hired successfully',
      bid: populatedBid
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Hire bid error:', error);
    res.status(500).json({ message: 'Error hiring freelancer' });
  } finally {
    session.endSession();
  }
};
