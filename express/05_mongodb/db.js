const mongo = require('mongoose')
const mongoose = require("mongoose");

function connectDB(){
    mongo.set('debug', true);
    const url = 'mongodb://localhost:27017/member'
    mongo.connect(url)
    const db = mongoose.connection;

    db.on('error', ()=>console.log('DB 접속 실패'));
    db.on('open', ()=>console.log('DB 접속 완료'));


}

module.exports = connectDB;