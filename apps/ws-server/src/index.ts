import ws from 'ws';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {jwt_secret} from '@repo/backend-common/config'

const wss = new ws.WebSocketServer({port:8080});

function checkuser (token: string): string | null{
    const decoded = jwt.verify(token , jwt_secret);
    if(typeof decoded == "string"){
        return null;
    }
    if(!(decoded as JwtPayload).userId || !decoded){
        return null;
    }
    return decoded.userId;
}

wss.on('connection', (ws, request)=>{
    
    const url = request.url;
    if(!url){
        return;
    }
    const queryparams = new URLSearchParams(url.split('?')[1]);
    const token = queryparams.get('token') || "";
    const userAuthenticated = checkuser(token);

    if(!userAuthenticated){
        ws.close()
    }
    
    

    ws.on('message',(data)=>{
        ws.send('pong');
    })

})
