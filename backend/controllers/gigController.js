import Gig from '../models/Gig.js';

export const getGigs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Error fetching gigs' });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('assignedTo', 'name email');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({ message: 'Error fetching gig' });
  }
};

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (budget < 1) {
      return res.status(400).json({ message: 'Budget must be at least $1' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

    res.status(201).json(populatedGig);
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ message: 'Error creating gig' });
  }
};

export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error('Get my gigs error:', error);
    res.status(500).json({ message: 'Error fetching your gigs' });
  }
};

export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this gig' });
    }

    const { title, description, budget } = req.body;

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.budget = budget || gig.budget;

    const updatedGig = await gig.save();
    const populatedGig = await Gig.findById(updatedGig._id).populate('ownerId', 'name email');

    res.json(populatedGig);
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({ message: 'Error updating gig' });
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }

    await gig.deleteOne();
    res.json({ message: 'Gig deleted successfully' });
  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({ message: 'Error deleting gig' });
  }
};
