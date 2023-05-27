const express = require('express');
const { Server } = require('socket.io');
const app = express();
const port = 3001;
const http = require('http');
const cors = require('cors');

const bodyParser = require('body-parser');


const server = http.createServer(app);



app.use(cors());
app.use(bodyParser({ extended: true }));

var compiler = require('compilex');
const { error } = require('console');
var options = { stats: true };
compiler.init(options);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

users = [];


io.on('connection', (socket) => {

    socket.on('join-room', (data) => {
        const { id, CurrUser } = data;
        const template = { RoomID: id, user: CurrUser }
        socket.join(id)
        socket.to(id).emit('connected-user', {CurrUser})
        users.push(template)
        
    })

    socket.on('leave-room', (data)=>{
        const {id, CurrUser} = data;
        socket.leave(id)
        socket.to(id).emit('disconnected-user', {CurrUser})
        

    })
    
   
    
    

    socket.on('sync-code-input', (data) => {

        socket.to(data.id).emit('sync-code-input-server', data)
    })
    socket.on('sync-output', (message) => {
        socket.to(message.id).emit('sync-output-server', message)
    })
});




app.post('/compilecode', (req, res) => {
    const code = req.body.code;
    const input = req.body.input;
    const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

    if (input != "") {
        compiler.compileCPPWithInput(envData, code, input, function (data) {

            res.send(data);
        });
    }

    else {
        compiler.compileCPP(envData, code, function (data) {
            res.send(data);
        });
    }

}

)

app.get('/fullstats', (req, res) => {
    compiler.fullStat((data) => {
        res.send(data);
    })
})






server.listen(port, () => console.log(`Example app listening on port ${port}!`));


compiler.flush(() => {
    console.log("flushed");
})

