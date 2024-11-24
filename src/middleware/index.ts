import { RequestHandler } from 'express';
import { get, merge } from 'lodash';
import { getUserById } from '../DB/users';
import { verifyToken } from '../helpers';

export const isOwner: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string | undefined;

        if (!currentUserId) {
            res.sendStatus(403); // Forbidden
            return;
        }

        if (currentUserId.toString() !== id) {
            res.sendStatus(403); // Forbidden
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.sendStatus(400); // Bad Request
    }
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies?.['todo.auth']; // Retrieve token from cookies

        if (!token) {
            res.sendStatus(408).json({ message: 'Access denied. Token is missing.' });
            return; // Stop further execution
        }

        const decoded = verifyToken(token); // Verify and decode the token

        // Check if the token is valid and contains userId
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            res.sendStatus(408).json({ message: 'Access denied. Invalid token.' });
            return; // Stop further execution
        }

        // Fetch the user from the database
        const existingUser = await getUserById(decoded.userId);
        if (!existingUser) {
            res.sendStatus(408).json({ message: 'Access denied. User does not exist.' });
            return; // Stop further execution
        }

        // Attach the user to the request object
        merge(req, { identity: existingUser });

        next(); // Continue to the next middleware
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.sendStatus(408).json({ message: 'Bad Request. Middleware error occurred.' });
    }
};

