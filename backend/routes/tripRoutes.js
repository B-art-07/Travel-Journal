import express from 'express';
// We added updateTrip to the imports!
import { createTrip, getUserTrips, deleteTrip, updateTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);
router.delete('/:id', protect, deleteTrip); 
// NEW: The route to update a specific trip
router.put('/:id', protect, updateTrip); 

console.log("🔥 TRIP ROUTES LOADED! 🔥");

export default router;