import express from 'express';
import {
  getGigs,
  getGigById,
  createGig,
  getMyGigs,
  updateGig,
  deleteGig
} from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getGigs)
  .post(protect, createGig);

router.get('/my/posted', protect, getMyGigs);

router.route('/:id')
  .get(getGigById)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;
