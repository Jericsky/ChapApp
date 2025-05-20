import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../data/types/CustomRequest';


export const protectRoute = async( req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.jwt;
        if(!token){
            res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret){
            throw new Error('JWT_SECRET is not defined in enviroment variables');
        }

        const decoded = jwt.verify(token, jwtSecret);
        if(!decoded){
            res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            return;
        }

        if (typeof decoded === 'string' || !('userId' in decoded)) {
            res.status(401).json({ error: 'Unauthorized - Invalid Token Structure' });
            return;
        }

        const user = await User.findById((decoded as JwtPayload).userId).select('-password');
        if(!user){
            res.status(404).json({ error: 'User not found' });
            return;
        };

        req.user = user;

        next();
    } catch (error) {
        console.log('Error in protectRoute middleware: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
