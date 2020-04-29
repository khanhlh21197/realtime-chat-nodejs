const SocketServer = require('websocket').server
const http = require('http')
var fs = require('fs')
var mysql = require('mysql')
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
})

const server = http.createServer((req, res) => {})

server.listen(3000, ()=>{
    console.log("Listening on port 3000...")
})


wsServer = new SocketServer({httpServer:server})

//connect mysql
conn.connect((err) => {
    if(err) throw err
    console.log("Connected! ")
    conn.query("SELECT * FROM test", (err, result, fields) => {
        if(err) throw err
        console.log(result) 
    })
})

const connections = []

wsServer.on('request', (req) => {
    const connection = req.accept()
    console.log('new connection')
    connections.push(connection)

    connection.on('message', (mes) => {
        connections.forEach(element => {
            if (element != connection){
                element.sendUTF(mes.utf8Data)
                console.log(mes.utf8Data)
            }else{
                console.log(mes.utf8Data)
                fs.appendFile('test.txt', mes.utf8Data + '\n', function(err){
                    if(err) console.log(err)
                    console.log('Saved!')
                })
            }
        })
    })

    connection.on('close', (resCode, des) => {
        console.log('connection closed')
        connections.splice(connections.indexOf(connection), 1)
    })

})