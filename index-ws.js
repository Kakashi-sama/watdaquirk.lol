// Import the express module
const express = require('express');

// Create an HTTP server
const server = require('http').createServer();

// Initialize an express application
const app  = express();

// Define a route handler for the root path ('/')
app.get('/', function(req, res) {
    // Send the index.html file when the root path is accessed
    res.sendFile('index.html', {root: __dirname});
});

// Attach the express application to the HTTP server
server.on('request', app);

// Start the server and listen on port 3000
server.listen(3000, function() {
    console.log('Server started on PORT 3000');
});

// YOu would like to shutdown the db as well when the server is closed
process.on('SIGINT', ()=>{
    console.log('sigint');

    wss.clients.forEach(function each(client) {
        client.close();
    });
    
    server.close(() => {
        shutDownDB();
    })
})

/** Begin websocket */
// Import the websocket module
const websocketServer = require('ws').Server;

// Create a new WebSocket server attached to the HTTP server
const wss = new websocketServer({ server: server });

// Listen for WebSocket connections
wss.on('connection', function connection(ws) {
    // Get the number of connected clients
    const numClients = wss.clients.size;
    console.log('Client connected', numClients);

    // Broadcast the number of current visitors to all clients
    wss.broadcast(`Current visitors: ${numClients}`);

    // Check if the WebSocket connection is open and send a welcome message
    if (ws.readyState === ws.OPEN) {
        ws.send("Welcome to my server");
    }

    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
    `)

    // Listen for the 'close' event, which indicates a client has disconnected
    ws.on('close', function close() {
        // Broadcast the updated number of current visitors to all clients
        wss.broadcast(`Current visitors: ${numClients}`);
        console.log('Client has Disconnected');
    });
});

// Define a broadcast function to send data to all connected clients
wss.broadcast = function broadcast(data) {
    // Iterate over each client and send the data
    wss.clients.forEach(function each(client) {
        // Ensure the client is connected before sending data
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    });
}

/** end websocket */

/** Begin database section */
// Import the sqlite3 module
const sqlite = require('sqlite3');

// Create an in-memory database instance
const db = new sqlite.Database(':memory:');

// Serialize ensures that the following database operations are executed sequentially
db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `)
});

function getCount() {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    })
}

function shutDownDB() {
    getCount();
    console.log('Shutting down db');
    db.close();
}
