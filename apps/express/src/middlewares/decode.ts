import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {jwt_secret} from '@repo/backend-common/config'


const decodeToken = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        return res.status(400).json({message:'authHeader not provided'})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Incorrect or expired token'})
    }
}
export {decodeToken}