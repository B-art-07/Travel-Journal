import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true // Added this so your Data Logs get saved!
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  companions: [{ 
    type: String 
  }],
  coverImage: { 
    type: String, 
    default: "" 
  },
  musicPlaylistUrl: { 
    type: String, 
    default: "" 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);