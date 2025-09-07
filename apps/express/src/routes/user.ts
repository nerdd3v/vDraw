import express, { Router }  from "express";
import { decodeToken } from "../middlewares/decode";

import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/zodSchema";
import { generateToken } from "../middlewares/generateToken";
import { client } from "@repo/db/client"

const userRouter: Router =  express.Router();


userRouter.post('/signup', async(req, res)=>{
    const {username, password, name} = req.body;
    if(!username || !password ){
        return res.status(401).json({message:"Credentials not provided"});
    }
    const validateInfo = CreateUserSchema.safeParse({username, password, name});

    if(!validateInfo.success){
        console.log(validateInfo.error)
        return res.status(400).json({message:"wrong username and password format"})
    }
    try {
        //<--Check for the unique email id by fetching ig the user with email already exists -->\\

        //<-- close it here -->\\
        const user = await client.user.create({
         
            data:{
                email: validateInfo.data?.username,
                password: validateInfo.data.password,
                name: validateInfo.data.username+"-name",
                photo: "https://bkldnafj"
            }
        })

        return res.status(200).json({message:'You are signed up', uid: user.id})
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }
})

userRouter.post('/signin', async(req, res)=>{
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
        const userExists = await client.user.findFirst({
            where:{
                email: validateInfo.data.username,
                password: validateInfo.data.password
            }
        })
        if(!userExists){
            return res.status(400).json({message:""})
        }

        const userId = userExists.id;

        const token = generateToken(userId)

        return res.status(200).json({message: "you are signed in", token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'internal server error'})       
    }
})
//@ts-ignore
userRouter.post('/create-room', decodeToken, async(req, res)=>{
    const {roomName} = req.body;
    if(!roomName){
        return res.status(400).json({message:"incorrect or empty room name"})
    }
    const validated = CreateRoomSchema.safeParse({name: roomName});

    if(!validated.success){
        return res.status(400).json({message:"wrong room name format"})
    }

    try {
        //@ts-ignore
        const user = req.user;
        const room = await client.room.create({
            data:{
                slug: validated.data.name,
                adminId: user.userId
            }
        })
        return res.status(200).json({message:'Room created ', roomId: room.id})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'internal server error'})
    }
})

userRouter.get("/chats/:roomId", async(req, res)=>{
    const roomId = Number(req.params.roomId);
    await client.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy:{
            id: "desc"
        },
        take: 50
    })
})

export {userRouter}