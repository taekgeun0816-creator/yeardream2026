const express = require('express');
const router = express.Router();
const Board = require('./board_model');

router.post('/write', async (   req, res) => {
    const {writer, title, content}  = req.body;
    try{
        let result = await Board.create({writer, title, content});
        res.json({success:true, data:result});
    }catch(e){
        console.log(e);
        res.json({success:false,  message: '필수값을 확인해 주세요'});
    }
});

router.get(['/list','/'], async (req,res)=>{
    let list = await Board.find().sort({createdAt:-1}).lean();
    res.json({success:true, data:list});
});

router.get('/get/:id',async (req,res)=>{
    const {id} = req.params;
    let post = await Board.findById(id).lean();
    if (post == null){
        return res.json({success:false, message:'없는 게시글'});
    }
    res.json({success:true, data:post});
});

router.put('/update/:id',async (req,res)=>{
    const {id} = req.params;
    const {title, content} = req.body;
    let update = {};
    if(title !== undefined) update.title = title;
    if(content !== undefined) update.content = content;

    let post = await Board.findByIdAndUpdate(id, update, {new:true, runValidators:true}).lean();
    if(post == null){
        return res.json({success:false, message:'없는 게시글'})

    }
    res.json({success:true, message:'수정완료', data:post});
});

router.delete('/delete/:id',async (req,res)=>{
    const {id} = req.params;
    let post = await Board.findByIdAndDelete(id).lean();
    if(post == null){
        return res.json({success:false, message:'없는 게시글'});
    }
    res.json({success:true, message:'삭제완료', data:post});
});

module.exports = router;