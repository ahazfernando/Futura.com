import jwt from 'jsonwebtoken';

// Generate JWT token and set it as an HTTP-only cookie
const generateToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token expires in 30 days
    });

    // Set the token as an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true, // Cookie is inaccessible to client-side scripts
      secure: process.env.NODE_ENV !== 'development', // Secure only in non-development environments
      sameSite: 'strict', // Prevent CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    return token;
  } catch (error) {
    throw new Error('Failed to generate token');
  }
};

export default generateToken;
