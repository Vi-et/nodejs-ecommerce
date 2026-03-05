'use strict';

const amqp = require('amqplib');


async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.prefetch(1)

    channel.consume(queueName, (msg) => {
        
        setTimeout(() => {
            console.log(`Received message:: ${msg.content.toString()}`)
            channel.ack(msg)
        }, Math.random() * 1000)
        
    })

    
}

consumerOrderedMessage().catch(err => console.error(err))