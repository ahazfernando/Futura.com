import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ensure the file path and extension are correct
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies?.jwt; // Corrected typo: `req.cookie` to `req.cookies`
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password'); // Fixed `findByID` to `findById`
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Check if the user is an admin
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) { // Fixed `req,user` to `req.user`
        next();
    } else {
        res.status(401).send('Not authorized as an admin');
    }
};

export { authenticate, authorizeAdmin };
