'use strict'

const mongoose = require('mongoose');
const {db : {host, port, name}} = require('../configs/config.mongodb')
const {countConnect} = require('../helpers/check.connect');

const connectString = `mongodb://${host}:${port}/${name}`;


class Database{
    constructor(){
        this._connect();
    }
    _connect(){

        mongoose.set('debug', true);
        mongoose.set('debug', {color: true});

        mongoose.connect(connectString).then(_ => {
            console.log('Connected to MongoDB', countConnect());
        }).catch(err => {
            console.error(err);
        });
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new Database();
        }
        return this.instance;
    }

}
const instanceMongo = Database.getInstance();
module.exports = instanceMongo;