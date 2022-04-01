/* Client Code 
let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log
*/

const express = require("express");
const app = express();
const cors = require('cors');

const port = process.env.PORT || 8888;
const serverName = process.env.SERVER_NAME || "sample";

app.use(cors());
app.use(express.json());

let i = 0;

app.get("/", (req, res) => res.send("hello!"));

app.get("/stream", (req, res) => {

    res.setHeader("Content-Type", "text/event-stream");
    send(res);

})


function send(res) {

    // res.write("data: " + `hello from ${serverName} ---- [${i++}]\n\n`);
    // const data = `data: ${JSON.stringify(facts)}\n\n`;
    const data = `data: ${JSON.stringify({ x: 5, y: 6 })}\n\n`;
    res.write(data);


    setTimeout(() => send(res), 1000);
}

app.listen(port)
console.log(`Listening on ${port}`)
