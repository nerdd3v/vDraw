import ws from 'ws';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {jwt_secret} from '@repo/backend-common/config'
import { client } from '@repo/db/client';

const wss = new ws.WebSocketServer({port:8080});

interface User{
    socket: WebSocket,
    userId: string,
    rooms: string[]
}
const users: User[] = []

function checkuser (token: string): string | null{
    try{

        const decoded = jwt.verify(token , jwt_secret);
        if(typeof decoded == "string"){
            return null;
        }
        if(!(decoded as JwtPayload).userId || !decoded){
            return null;
        }
        return decoded.userId;
    }catch(e){
        return null
    }
}

wss.on('connection', (ws, request)=>{
    
    const url = request.url;
    if(!url){
        return;
    }
    if(!ws){
        return;
    }
    const queryparams = new URLSearchParams(url.split('?')[1]);
    const token = queryparams.get('token') || "";
    const userAuthenticated = checkuser(token);

    if(!userAuthenticated){
        ws.close();
        return;
    }
    
    users.push({
        //@ts-ignore
        socket:ws,
        userId: userAuthenticated,
        rooms: []
    })
    //can a single room person join a single room at a point 
    //can a single room person join multiple room at a point 
    //websocket server has to maintain a state 
    //<-- like someone subscribes to a chat room --> \\


    ws.on('message',async(data)=>{
        const parsedData = JSON.parse(data as unknown as string);
        if(parsedData.type === 'join_room'){
            const user = users.find(x=> x.socket === (ws as unknown as typeof x.socket));
            user?.rooms.push(parsedData.roomId);
        }
        if(parsedData.type === "leave_room"){
            const user = users.find(x=> x.socket === (ws as unknown as typeof x.socket));
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(room => room === parsedData.roomId);
        }
        if(parsedData.type === 'chat'){
            const message = parsedData.message;
            const roomId = parsedData.roomId;
            
            await client.chat.create({
                data:{
                    roomId,
                    message,
                    userId: userAuthenticated
                }
            })

            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.socket.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
        }
    })

})
