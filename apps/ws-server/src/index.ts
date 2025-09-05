import ws from 'ws';
import jwt from 'jsonwebtoken';
const secret = 'maiNahiBataunga';
import { JwtPayload } from 'jsonwebtoken';

const wss = new ws.WebSocketServer({port:8080});

wss.on('connection', (ws, request)=>{
    
    const url = request.url;
    if(!url){
        return;
    }
    const queryparams = new URLSearchParams(url.split('?')[1]);
    const token = queryparams.get('token') || "";
    const decoded = jwt.verify(token, secret);

    if(!(decoded as JwtPayload).userId || !decoded){
        ws.close();
        return;
    }

    ws.on('message',(data)=>{
        ws.send('pong');
    })

})
