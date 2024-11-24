import { Request, Response, NextFunction } from 'express';
import { getUserByEmail, createUser, getUserById } from '../DB/users';
import { authentication, random } from '../helpers';
import { generateToken } from '../helpers';
import { verifyToken } from '../helpers';
import { merge } from 'lodash';
import { User } from '../DB/users'; // Assuming User is defined in your User model
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Login endpoint hit');
    const token = req.cookies['todo.auth'];
    if (!token) {
      console.error('Token is missing from cookies.');
      res.sendStatus(403); // Forbidden
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('Failed to verify token.');
      res.sendStatus(403); // Forbidden
      return;
    }

    console.log('Decoded token:', decoded);

    const existingUser = await getUserById(decoded.userId);
    if (!existingUser) {
      console.error('No user found with the provided userId:', decoded.userId);
      res.sendStatus(403); // Forbidden
      return;
    }

    console.log('User authenticated:', existingUser);

    // Respond with success
    res.status(200).json({
      message: 'Login successful',
      user: existingUser,
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.sendStatus(400); // Bad Request
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.sendStatus(400);
      return; // Ensure no further execution
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.sendStatus(400);
      return; // Ensure no further execution
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      role: 'user', // Default role
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    const jwtToken = generateToken(user._id.toString(), user.role);
    res.cookie('todo.auth', jwtToken, { httpOnly: true, domain: 'localhost', path: '/' });

    res.status(200).json({ message: 'Registration successful', token: jwtToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};
