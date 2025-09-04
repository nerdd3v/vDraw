import jwt from 'jsonwebtoken';
const secret = 'maiNahiBataunga'

const decodeToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(400).json({message: 'Provide the authorization header'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, secret);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({message:'expired or invalid token provided'})
    }
}