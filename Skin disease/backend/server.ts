import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cureskin';

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  skinType: { type: String, default: 'Normal' },
  concern: { type: String, default: 'General' },
  allergies: { type: String, default: '' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, required: true },
  result: { type: Object, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  price: { type: Number, default: 499 },
  image: { type: String, required: true },
  category: { type: String, required: true },
  suitableFor: [String]
});

const User = mongoose.model('User', userSchema);
const Scan = mongoose.model('Scan', scanSchema);
const Product = mongoose.model('Product', productSchema);

// Initial Products Data (Authentic Dermatology & Pharmacy Products)
const initialProducts = [
  // --- OILY SKIN / ACNE-PRONE ROUTINE ---
  {
    name: "The Derma Co 2% Salicylic Acid Face Wash",
    rating: 4.8,
    price: 349,
    image: "/products/salicylic-face-wash.jpg",
    category: "Derma Care",
    suitableFor: ["Oily Skin", "Acne Vulgaris", "Blackheads"]
  },
  {
    name: "The Derma Co 1% Salicylic Acid Oil-Free Face Moisturizer",
    rating: 4.7,
    price: 349,
    image: "/products/oily-skin-moisturizer.jpg",
    category: "Derma Care",
    suitableFor: ["Oily Skin", "Acne", "Open Pores"]
  },
  {
    name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel",
    rating: 4.9,
    price: 499,
    image: "/products/hyaluronic-sunscreen.jpg",
    category: "Sunscreen",
    suitableFor: ["Oily Skin", "All", "Sun Protection"]
  },
  {
    name: "The Derma Co 10% Niacinamide Face Serum",
    rating: 4.7,
    price: 599,
    image: "/products/niacinamide-serum.jpg",
    category: "Derma Care",
    suitableFor: ["Oily Skin", "Acne Marks", "Scars"]
  },
  {
    name: "The Derma Co 20% Vitamin C Face Serum",
    rating: 4.8,
    price: 649,
    image: "/products/niacinamide-serum.jpg", // fallback image
    category: "Derma Care",
    suitableFor: ["Oily Skin", "Dry Skin", "Normal", "Dullness", "Aging", "Pigmentation"]
  },

  // --- DRY SKIN ROUTINE ---
  {
    name: "The Derma Co Creamy Face Cleanser",
    rating: 4.6,
    price: 299,
    image: "/products/dry-skin-face-wash.jpg",
    category: "Derma Care",
    suitableFor: ["Dry Skin", "Sensitive Skin", "Hydration"]
  },
  {
    name: "The Derma Co Vitamin E Face Moisturizer",
    rating: 4.8,
    price: 349,
    image: "/products/dry-skin-moisturizer.jpg",
    category: "Derma Care",
    suitableFor: ["Dry Skin", "Flaky Skin", "Barrier Repair", "Nourishment"]
  },
  {
    name: "The Derma Co Ultra Matte Sunscreen Gel",
    rating: 4.6,
    price: 699,
    image: "/products/dry-skin-sunscreen.jpg",
    category: "Sunscreen",
    suitableFor: ["Dry Skin", "Sun Protection"]
  },
  {
    name: "The Derma Co 2% Kojic Acid Face Cream",
    rating: 4.6,
    price: 499,
    image: "/products/kojic-acid-cream.jpg",
    category: "Derma Care",
    suitableFor: ["Dry Skin", "Pigmentation", "Dark Spots"]
  },

  // --- PHARMACY TUBES ---
  {
    name: "Persol 2.5% Benzoyl Peroxide Gel",
    rating: 4.5,
    price: 185,
    image: "/products/benzoyl-peroxide.jpg",
    category: "Pharmacy Tube",
    suitableFor: ["Acne Vulgaris", "Inflammatory Acne", "Pustules"]
  },
  {
    name: "Nizoral Ketoconazole 2% Cream",
    rating: 4.8,
    price: 280,
    image: "/products/nizoral-cream.jpg",
    category: "Pharmacy Tube",
    suitableFor: ["Fungal Infection", "Ringworm", "Dandruff", "Tinea Corporis", "Tinea"]
  },
  {
    name: "Canesten Clotrimazole Cream",
    rating: 4.6,
    price: 110,
    image: "/products/clotrimazole-cream.jpg",
    category: "Pharmacy Tube",
    suitableFor: ["Fungal Infection", "Athlete's Foot", "Tinea"]
  },
  {
    name: "Lacto Calamine Skin Balance Lotion",
    rating: 4.8,
    price: 199,
    image: "/products/calamine-lotion.jpg",
    category: "Pharmacy Tube",
    suitableFor: ["Skin Allergy", "Red Rashes", "Sunburn", "Urticaria", "Arteceria"]
  },
  {
    name: "Aziderm 10% Azelaic Acid Cream",
    rating: 4.7,
    price: 320,
    image: "/products/azelaic-acid-cream.jpg",
    category: "Pharmacy Tube",
    suitableFor: ["Dark Spots", "Pigmentation", "Acne Marks", "Rosacea", "Melasma"]
  }
];

async function startServer() {
  await mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      // Force reseed of products to use real images
      await Product.deleteMany({});
      await Product.insertMany(initialProducts);
      console.log('Reset and seeded products with REAL IMAGES');

      // Seed default admin and user for easy login testing
      const adminExists = await User.findOne({ email: 'admin@cureskin.com' });
      if (!adminExists) {
        const hashedAdmin = await bcrypt.hash('admin123', 10);
        await User.create({ name: 'Admin', email: 'admin@cureskin.com', password: hashedAdmin, role: 'admin' });
      }

      const userExists = await User.findOne({ email: 'user@cureskin.com' });
      if (!userExists) {
        const hashedUser = await bcrypt.hash('user123', 10);
        await User.create({ name: 'Dhanshri', email: 'user@cureskin.com', password: hashedUser, role: 'user' });
      }
      console.log('Seeded default admin and user accounts');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.static(path.join(__dirname, 'public')));

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password, role, skinType } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role: role || 'user', skinType: skinType || 'Normal' });
      await user.save();
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, skinType: user.skinType } });
    } catch (err) {
      res.status(500).json({ message: 'Error signing up' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const user = await User.findOne({ email, role });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, skinType: user.skinType } });
    } catch (err) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });

  app.get('/api/user/profile', authenticateToken, async (req: any, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  });

  app.put('/api/user/profile', authenticateToken, async (req: any, res) => {
    try {
      const { name, avatar } = req.body;
      const update: any = {};
      if (name) update.name = name;
      if (avatar) update.avatar = avatar;
      
      const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
      if (!user) return res.sendStatus(404);
      
      // Return consistent user format
      res.json({ 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar,
        skinType: user.skinType 
      });
    } catch (err) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  });

  app.get('/api/scans', authenticateToken, async (req: any, res) => {
    try {
      const userScans = await Scan.find({ userId: req.user.id }).sort({ date: -1 });
      res.json(userScans);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching scans' });
    }
  });

  app.post('/api/scans', authenticateToken, async (req: any, res) => {
    try {
      const { image, result, skinType, concern, allergies } = req.body;
      const newScan = new Scan({
        userId: req.user.id,
        image,
        result
      });
      await newScan.save();

      if (skinType || concern || allergies !== undefined) {
        await User.findByIdAndUpdate(req.user.id, {
          ...(skinType && { skinType }),
          ...(concern && { concern }),
          ...(allergies !== undefined && { allergies })
        });
      }

      res.json(newScan);
    } catch (err) {
      res.status(500).json({ message: 'Error saving scan' });
    }
  });

  app.delete('/api/scans/:id', authenticateToken, async (req: any, res) => {
    try {
      const scanId = req.params.id;
      const deletedScan = await Scan.findOneAndDelete({ _id: scanId, userId: req.user.id });
      if (!deletedScan) {
        return res.status(404).json({ message: 'Scan not found or not authorized' });
      }
      res.json({ message: 'Scan deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting scan' });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  app.get('/api/admin/scans', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
      const scans = await Scan.find()
        .populate('userId', 'name email avatar')
        .sort({ date: -1 });
      res.json(scans);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching all scans' });
    }
  });

  app.get('/api/admin/stats', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
      const totalUsers = await User.countDocuments();
      const totalScans = await Scan.countDocuments();
      const activeUsers = await User.countDocuments({ role: 'user' });
      const totalProducts = await Product.countDocuments();
      res.json({ totalUsers, totalScans, activeUsers, totalProducts });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching stats' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.join(__dirname, '..', 'frontend'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
