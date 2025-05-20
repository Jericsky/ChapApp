import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from 'bcryptjs'
import { generatToken } from "../lib/utils";
import { CustomRequest } from "../data/types/CustomRequest";
import cloudinary from "../lib/cloudinary";

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, fullName, password } = req.body;
    try {
        if(!email || !fullName || !password){
            res.status(400).send({ error: 'All fields required.' });
            return;
        }

        if (password.length < 6) {
            res.status(400).send({ error: 'Password must be at least 6 characters long.' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).send({ error: 'Email already exists.' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        });

        if(newUser){
            generatToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully', user: newUser });
        }
    } catch (error) {
        console.error('Error in signup controller: ', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({ error: 'Invalid credentials!' });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            res.status(400).json({ error: 'Invalid credentials!' });
            return;
        }

        generatToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            user: user
        })
    } catch (error) {
        console.log('Error in login controller', error);
        res.status(500).json({ error: 'Internal server error.' })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error in logout controller: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateProfile = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { profilePic } = req.body;
        const userId = req.user?._id;

        if(!profilePic){
            res.status(404).json({ error: 'Profile picture required>' });
            return;
        };

        const uploadResponse =  await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

         res.status(200).json(updateUser)
    } catch (error) {
        console.log('Error in updateProfile controller: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const checkAuth = (req: CustomRequest, res: Response) => {
    try{
        console.log(req.user);
        res.status(200).send(req.user)
    } catch(error){
        console.log('Error in checkAuth controller: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}