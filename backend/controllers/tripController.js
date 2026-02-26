import Trip from '../models/Trip.js';

// --- CREATE A NEW TRIP ---
export const createTrip = async (req, res) => {
  try {
    const { title, destination, description, startDate, endDate, companions, coverImage, musicPlaylistUrl } = req.body;
    const newTrip = await Trip.create({
      title, destination, description, startDate, endDate, companions, coverImage, musicPlaylistUrl,
      owner: req.user._id 
    });
    console.log("✅ Trip Successfully Saved to MongoDB!");
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("❌ FATAL BACKEND ERROR:", error.message);
    res.status(500).json({ message: 'Failed to create trip', error: error.message });
  }
};

// --- GET ALL TRIPS ---
export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trips', error: error.message });
  }
};

// --- UPDATE (EDIT) A TRIP ---
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Memory fragment not found.' });
    }

    // Security check: Only the owner can edit this!
    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized: You cannot modify someone else’s data.' });
    }

    // Update the record with the new data
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Send the newly updated data back to us
    );
    
    console.log(`✏️ Memory Fragment ${req.params.id} Updated.`);
    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("❌ FATAL UPDATE ERROR:", error.message);
    res.status(500).json({ message: 'Failed to update data.', error: error.message });
  }
};

// --- PURGE (DELETE) A TRIP ---
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Memory fragment not found.' });
    if (trip.owner.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized user.' });

    await Trip.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Memory Fragment ${req.params.id} Purged Successfully.`);
    res.status(200).json({ message: 'Data purged successfully.' });
  } catch (error) {
    console.error("❌ FATAL PURGE ERROR:", error.message);
    res.status(500).json({ message: 'Failed to purge data.', error: error.message });
  }
};