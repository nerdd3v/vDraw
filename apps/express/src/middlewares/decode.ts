import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {jwt_secret} from '@repo/backend-common/config'



const decodeToken = (req: Request, res: Response, next: NextFunction)=>{
    //@ts-ignore
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        //@ts-ignore
        return res.status(400).json({message:'authHeader not provided'})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwt_secret);
        //@ts-ignore
        req.user = decoded;
        next();
    } catch (error) {
        //@ts-ignore
        return res.status(401).json({message: 'Incorrect or expired token'})
    }
}
export {decodeToken}