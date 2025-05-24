import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import { CustomRequest } from "../data/types/CustomRequest";
import cloudinary from "../lib/cloudinary";

export const getUsersForSidebars = async (req: CustomRequest, res: Response) => {
    try {
        const loggedInUserId = req.user?._id;
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId} }).select('-password');

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log('Error in getUsersForSidebars controller: ', error);
        res.status(500).send({ error: 'Internal Server Error,' });
    }
}

export const getMessages = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const senderId = req.user?.id;

        const messages = await Message.find({
            $or: [
                {senderId: senderId, receiverId: id},
                {senderId: id, receiverId: senderId}
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages constroller: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const sendMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { text, image } = req.body;
        const { id } = req.params;
        const senderId = req.user?.id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: id,
            text: text,
            image: imageUrl
        });


        await newMessage.save();

        //realtime functionality

        res.status(201).json(newMessage);

    } catch (error) {
        console.log('Error in sendMessage controller: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}