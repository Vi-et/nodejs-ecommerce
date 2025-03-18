'use strict'
const _SECONDS = 5000;
const os = require('os');
const process = require('process');
const mongoose = require('mongoose');
const countConnect = ()=>{
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);

}

const checkOverload = () => {
    setInterval(()=>{
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnection = numCores * 5;
        console.log(`Number of connections: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage/1024/1024} MB`);
        if(numConnection > maxConnection){
            console.error(`Number of connections: ${numConnection} is overloading`);
        }
    }, _SECONDS);
}

module.exports = {countConnect, checkOverload};