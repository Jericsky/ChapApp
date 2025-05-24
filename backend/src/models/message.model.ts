import mongoose, { Mongoose } from "mongoose";

export interface IMessage{
    senderId: mongoose.Types.ObjectId,
    receiverId: mongoose.Types.ObjectId,
    text: string,
    image: string
}

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String
        },
        image: {
            type: String
        }
    },
    { timestamps: true }
)

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;