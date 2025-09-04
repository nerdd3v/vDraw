import ws from 'ws';

const wss = new ws.WebSocketServer({port:8080});

wss.on('connection', (ws)=>{
    
    ws.on('message',(data)=>{
        ws.send('pong');
    })

})
