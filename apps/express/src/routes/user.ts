import express, { Router }  from "express";
import { decodeToken } from "../middlewares/decode";

const userRouter: Router =  express.Router();

userRouter.post('/signup', (req, res)=>{
    const {username, password} = req.body;
})

userRouter.post('/signin',(req, res)=>{
    const {username, password} = req.body;
})

userRouter.post('/create-room', decodeToken,(req, res)=>{
    const {roomName} = req.body;
})

export {userRouter}