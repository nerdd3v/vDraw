import express, { Router }  from "express";
import { decodeToken } from "../middlewares/decode";
import { SigninSchema } from "@repo/common/zodSchema";
import { CreateRoomSchema } from "@repo/common/zodSchema";
import { generateToken } from "../middlewares/generateToken";
import { client } from "@repo/db/client"

const userRouter: Router =  express.Router();

userRouter.post('/signup', async(req, res)=>{
    const {username, password, name} = req.body;
    if(!username || !password ){
        return res.status(401).json({message:"Credentials not provided"});
    }
    const validateInfo = SigninSchema.safeParse({username, password});

    if(!validateInfo.success){
        return res.status(400).json({message:"wrong username and password format"})
    }
    try {
        await client.user.create({
            //@ts-ignore
            data:{
                email: validateInfo.data?.username,
                password: validateInfo.data.password,
                name: name
            }
        })

        return res.status(200).json({message:'You are signed up'})
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }
})

userRouter.post('/signin',(req, res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(401).json({message:"Credentials not provided"});
    }
    const validateInfo = SigninSchema.safeParse({username, password});
    
    if(!validateInfo.success){
        return res.status(400).json({message:"wrong username and password format"})
    }

    try {
        //validate the credentials
        //then fetch the user info from the db
        //get the userId
        const userId = '1'

        //create the token

        const token = generateToken(userId);

        return res.status(200).json({message: "you are signed in", token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'internal server error'})       
    }
})
//@ts-ignore
userRouter.post('/create-room', decodeToken,(req, res)=>{
    const {roomName} = req.body;
    if(!roomName){
        return res.status(400).json({message:"incorrect or empty room name"})
    }
    const validated = CreateRoomSchema.safeParse({roomName});

    if(!validated){
        return res.status(400).json({message:"wrong room name format"})
    }

    //@ts-ignore
    const user = req.user;
    try {
        
    } catch (error) {
        
    }
})

export {userRouter}