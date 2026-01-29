import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to match client

// In-memory storage (replace with a database in production)
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123' // In a real app, never store plain text passwords!
  }
];

// Middleware
app.use((req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide all required fields' 
            });
        }

        // Check if user already exists
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                error: 'User already exists with this email' 
            });
        }

        // Create new user (in a real app, hash the password!)
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password // In a real app, hash this password before saving!
        };

        users.push(newUser);
        console.log('New user registered:', { email, name });

        // Generate a simple token (in production, use JWT or similar)
        const token = 'dummy_token_' + Date.now();

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            token,
            user: { id: newUser.id, name, email }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error during signup' 
        });
    }
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });
        console.log('Current users:', users);

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide email and password' 
            });
        }

        // Find user
        const user = users.find(u => u.email === email);
        console.log('Found user:', user);
        
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid email or password' 
            });
        }
        
        if (user.password !== password) {
            console.log('Incorrect password');
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid email or password' 
            });
        }

        // Generate a simple token (in production, use JWT or similar)
        const token = 'dummy_token_' + Date.now();

        // Return user data (without password)
        const { password: _, ...userData } = user;
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error during login' 
        });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
