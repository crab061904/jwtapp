import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Load the secret from the environment variable, with a clear fallback for development
const SECRET = process.env.SECRET || 'default_secret_key';

// Generate a random string (e.g., for salting passwords)
export const random = (): string => crypto.randomBytes(128).toString('base64');

// Hash a password with a given salt
export const authentication = (salt: string, password: string): string => {
  return crypto
    .createHmac('sha256', `${salt}/${password}`) // Use template literals for clarity
    .update(SECRET) // Add extra security by incorporating a secret during hashing
    .digest('hex');
};

// Generate a JWT token with user details and expiration
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, SECRET, { expiresIn: '1h' });
};

// Verify a JWT token and return the payload if valid, or null if invalid
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET) as JwtPayload; // Ensure consistent secret usage
  } catch (error) {
    if (error instanceof Error) {
      console.error('Invalid token:', error.message); // Safely access the error message
    } else {
      console.error('Unknown error occurred during token verification'); // Fallback for non-Error types
    }
    return null; // Return null for invalid or expired tokens
  }
};
