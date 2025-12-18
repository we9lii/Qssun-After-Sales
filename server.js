
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);

// 1. Middleware
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for Base64 images

// 2. Database Connection (PostgreSQL via Sequelize OR SQLite for local)
let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Render's self-signed certs
      }
    },
    logging: false
  });
  console.log('Sequelize configured for PostgreSQL');
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log
  });
  console.log('Sequelize forced to SQLite');
}

console.log('Sequelize instance created. Dialect:', sequelize.getDialect());

// 3. Define Models

// Report Model
const Report = sequelize.define('Report', {
  id: { type: DataTypes.STRING, primaryKey: true },
  technicianId: { type: DataTypes.STRING },
  technicianName: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING },
  customerPhone: { type: DataTypes.STRING },
  projectSize: { type: DataTypes.STRING },
  maintenanceType: { type: DataTypes.STRING },
  startTime: { type: DataTypes.DATE },
  endTime: { type: DataTypes.DATE },
  location: { type: DataTypes.JSONB }, // Stores lat, lng, etc.
  photoBefore: { type: DataTypes.TEXT }, // URL from Cloudinary
  photoAfter: { type: DataTypes.TEXT },  // URL from Cloudinary
  voltageReadings: { type: DataTypes.JSONB }, // Stores P07.xx keys
  notes: { type: DataTypes.TEXT },
  customerSignature: { type: DataTypes.TEXT }, // Base64 (usually small enough) or URL
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
}, {
  timestamps: true
});

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING }
});

// 4. Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 5. API Routes

// Helper to upload to Cloudinary
const uploadImage = async (base64Str) => {
  if (!base64Str) return null;
  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder: 'qssun_reports',
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return null;
  }
};

// GET /api/reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.findAll({ order: [['createdAt', 'DESC']] });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports (Create New Report)
app.post('/api/reports', async (req, res) => {
  try {
    const data = req.body;

    // Upload Images to Cloudinary
    console.log('Uploading images...');
    const photoBeforeUrl = await uploadImage(data.photoBefore);
    const photoAfterUrl = await uploadImage(data.photoAfter);

    // Create Record in DB
    const report = await Report.create({
      ...data,
      photoBefore: photoBeforeUrl,
      photoAfter: photoAfterUrl,
    });

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users (Create User)
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync DB and Seed if empty
const MOCK_USERS = [
  {
    id: 'tech_faisal_m',
    name: 'فيصل محمد',
    role: 'TECHNICIAN',
    username: 'we9l',
    password: '1',
    phone: '0500000001',
    avatar: 'https://ui-avatars.com/api/?name=Faisal+Mohammed&background=0D9488&color=fff&bold=true'
  },
  {
    id: 'mgr_faisal_n',
    name: 'فيصل النتيفي',
    role: 'MANAGER',
    username: 'we9li',
    password: '1',
    phone: '0500000002',
    avatar: 'https://ui-avatars.com/api/?name=Faisal+Alnutaifi&background=4F46E5&color=fff&bold=true'
  },
];

const initDB = async () => {
  try {
    console.log('Authenticating DB connection...');
    await sequelize.authenticate();
    console.log('Database connected.');
    console.log('Syncing models...');
    await sequelize.sync({ alter: true }); // Updates tables if schema changes
    console.log('Models synced.');

    // Seed initial users if none exist
    const userCount = await User.count();
    if (userCount === 0) {
      await User.bulkCreate(MOCK_USERS);
      console.log('Mock users seeded.');
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

initDB();

// 6. Serve Frontend (Production)
// In production, Node serves the React build files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
