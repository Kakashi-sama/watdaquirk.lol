const http = require('http');

http.createServer((req, res) => {
    res.write("My heart is a haunted house with every heartbeat as a ghost of a memory, every room a shadow of what could have been. The walls echoing the whispers of failed promises. I am just a angry but helpless spirit sinking in the bathtub of my own despair. Help me I am drowning...... drowning......... drowning...... never mind I will never be dead");
    res.end();
}).listen(3000);

console.log("Server started on PORT 3000");
