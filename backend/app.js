const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas Connection
const MONGODB_URI = 'mongodb+srv://nikhilyadav15788:LrBb8QgTyJN7CTDq@maincluster.8rd9hb3.mongodb.net/bloodconnect?retryWrites=true&w=majority&appName=MainCluster';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number
    },
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Routes

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🩸 BloodConnect API is running!',
    endpoints: {
      register: 'POST /api/users',
      search: 'GET /api/users?bloodGroup=A+&city=Delhi'
    }
  });
});

// Register a new user (donor)
app.post('/api/users', async (req, res) => {
  try {
    const { name, address, city, contactNumber, bloodGroup, location } = req.body;
    
    // Validate required fields
    if (!name || !address || !city || !contactNumber || !bloodGroup) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, address, city, contactNumber, bloodGroup' 
      });
    }

    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ 
        error: 'Invalid blood group. Must be one of: ' + validBloodGroups.join(', ') 
      });
    }

    // Create new user
    const user = new User({
      name,
      address,
      city,
      contactNumber,
      bloodGroup,
      location
    });

    await user.save();
    
    res.status(201).json({
      message: '✅ User registered successfully!',
      user: {
        id: user._id,
        name: user.name,
        city: user.city,
        bloodGroup: user.bloodGroup
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: '❌ Failed to register user' });
  }
});

// Search for donors
app.get('/api/users', async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    
    // Build search query
    let query = {};
    
    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }
    
    if (city) {
      query.city = { $regex: city, $options: 'i' }; // Case-insensitive search
    }

    // Find users matching criteria
    const donors = await User.find(query)
      .select('name address city contactNumber bloodGroup createdAt')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      message: `Found ${donors.length} donor(s)`,
      donors
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: '❌ Failed to search donors' });
  }
});

// Get all users (for testing)
app.get('/api/users/all', async (req, res) => {
  try {
    const users = await User.find().select('name city bloodGroup createdAt');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: '❌ Failed to fetch users' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BloodConnect server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
}); 