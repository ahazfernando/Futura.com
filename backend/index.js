// Packages
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Utils
import connectDB from './config/db.js';

// Routes
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // Load environment variables

const port = process.env.PORT || 5001;

// Connect to the database
connectDB();

const app = express();

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/users', userRoutes);

// Catch-All Route (Optional for Production)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
