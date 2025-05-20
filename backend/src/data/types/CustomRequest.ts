import { Request } from "express";
import User, { IUser } from "../../models/user.model";

export interface CustomRequest extends Request {
    user?: IUser;
}