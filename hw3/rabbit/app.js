const express = require("express");
const amqp = require("amqplib/callback_api");
const PORT = 4000;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const exchange = "hw3";

const listen = (res, keys) => {
    amqp.connect('amqp://localhost', (err, connect) => {
        connect.createChannel((err, channel) => {
            channel.assertQueue('', {exclusive: true}, (err, queue) => {
                keys.forEach(key => channel.bindQueue(queue.queue, exchange, key))

                channel.consume(queue.queue, (msg) => {
                    res.status(200).json({msg: msg.content?.toString()})
                    connect.close()
                })


            })
        })
    })
}

const speak = (key, msg) => {
    amqp.connect('amqp://localhost', (err, connect) => {
        connect.createChannel((err, channel) => {
            channel.publish(exchange, key, Buffer.from(msg))
            setTimeout(function(){connect.close()}, 600)
        })
    })
}

app.post("/listen", (req, res) => {
    let {keys} = req.body;
    keys = keys.toString().split(',')
    listen(res, keys)
});

app.post("/speak", (req, res) => {
    const {key, msg} = req.body;
    res.sendStatus(200)
    speak(key.toString(), msg.toString())
});

app.listen(PORT, () => {
    console.log(`Started on port: ${PORT}`);
});
