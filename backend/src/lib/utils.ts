import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generatToken = (userId: unknown, res: Response) => {
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign({ userId: userId }, secret, {
        expiresIn: '7d'
    });
    
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    });

    return token;
}