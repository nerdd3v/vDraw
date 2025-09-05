import { jwt_secret } from '@repo/backend-common/config'
import jwt from 'jsonwebtoken'
export const generateToken = (userId: string)=>{
    const token = jwt.sign(userId, jwt_secret);
    return token;
}