//user controller
import { Request, Response, RequestHandler } from 'express';
import { deleteUserById, getUserById, getUsers } from '../DB/users';

export const getAllUsers: RequestHandler= async (req:Request, res: Response) : Promise<void>=> {
    try {
        const users =await getUsers();
       res.status(200).json(users);
    } catch (error) {
        console.log(error);
       res.sendStatus(400);
    }
}

export const deleteUser: RequestHandler= async (req:Request, res: Response) : Promise<void>=> {
    try {
      const {id}=req.params;
      const deleteUser=await deleteUserById(id);
      res.json(deleteUser);
    } catch (error) {
        console.log(error);
       res.sendStatus(400);
    }
}

export const updateUser: RequestHandler= async (req:Request, res: Response) : Promise<void>=> {
    try {
        const {id}=req.params;
      const {username}=req.params;
        if(!username){
            res.sendStatus(400);
            return;
        }
        const user=await getUserById(id);
        if (!user) {
            res.sendStatus(404); // Not Found
            return;
        }
        user.username=username;
        await user.save();
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
       res.sendStatus(400);
    }
}