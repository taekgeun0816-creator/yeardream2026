const mongoose = require('mongoose');

let schema = new mongoose.Schema({

    writer:{
        type:String,
        required:[true,'작성자는 필수 입니다.'],
        trim:true,
    },

    title:{
        type:String,
        required:[true,'제목은 필수 입니다'],
        trim:true,
    },

    content:{
        type:String,
        required:[true, '내용은 필수 입니다.']
    },

     views:{
        type:Number,
         default:0
     }

},{
    collection: 'board',
    timestamps: true,
    id:false
});

schema.index({writer:1});
module.exports = mongoose.model('Board',schema);