const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Member = require('./model');

// 회원 가입(/member/join)
router.post('/join',async (req,res)=>{

    const {id,pw,name,phone} = req.body;
    try{
        const hashedPw = await bcrypt.hash(pw, 10); // pw를 평문 대신 해시값으로 저장
        let result = await Member.create({id,pw:hashedPw,name,phone});
        let object = result.toObject();
        delete object.pw; // pw 는 결과값에서 제거하고 보여준다.
        // object.pw = '';
        res.json({'success':true,'data':object});
    }catch (e) {
        console.error(e,'CODE :'+e.code);
        let msg = "";
        switch (e.code){
            case 11000:
                msg = "이미 사용중인 아이디 입니다.";
                break;

            default:
                msg = "필수값을 확인해 주세요";
        }
        res.json({'success':false,message:msg});
    }

});

// 로그인(/member/login)
router.post('/login', async (req,res)=>{
    const {id,pw} = req.body;
    try{
        // pw는 select:false라서 명시적으로 +pw 해줘야 값이 딸려온다
        const member = await Member.findOne({id}).select('+pw');

        if(member == null){
            return res.json({'success':false,'message':'존재하지 않는 아이디 입니다.'});
        }

        const isMatch = await bcrypt.compare(pw, member.pw); // 입력한 pw와 저장된 해시값 비교
        if(!isMatch){
            return res.json({'success':false,'message':'비밀번호가 일치하지 않습니다.'});
        }

        const object = member.toObject();
        delete object.pw;
        res.json({'success':true,'message':'로그인 성공','data':object});
    }catch(e){
        console.error(e);
        res.json({'success':false,'message':'로그인 중 오류가 발생했습니다.'});
    }
});

// 회원 리스트(/member/list, /memeber/)
router.get(['/list','/'],async(req,res)=>{
    let list = await Member.find()
        .sort({'createdAt':-1}) // 생성일 내림차순으로 정렬
        .lean();    //순수JSON 으로 반환
    res.json({'success':true,'data':list});
});

// 회원정보 상세보기(/member/get/:id)
router.get('/get/:id',async (req,res) => {
    const {id} = req.params;
    // 찾는 내용이 하나일 경우는 findOne({filter}) 사용
    let member  = await Member.findOne({id}).lean();

    if(member == null){
       return res.json({'success':false, 'data':{'info':{},'msg':'없는 회원'}});
    }
    res.json({'success':true,'data':{'info':member, 'msg':'상세보기 완료'}});
});

// 회원정보 수정(/member/update/:id)
router.put('/update/:id',async(req,res)=>{
    const {id} = req.params;
    const {pw,name,phone,grade} = req.body;
    let update = {}; // const  는 배열이나 오브젝트 일부 수정은 허용
    if(pw != undefined) update['pw'] = await bcrypt.hash(pw, 10)
    if(name != undefined) update['name'] = name
    if(phone != undefined) update['phone'] = phone
    if(grade != undefined) update['grade'] = grade

    const member = await Member.findOneAndUpdate({id},update,
        {
            new:true,   // 수정된 후의 문서를 보여준다.
            runValidators:true // update 후 스키마 검증 진행
        }).lean();

    if(member == null){
      return  res.json({'success':false,'msg':'없는 회원'});
    }
    res.json({'success':true,'msg':'수정에 성공 했습니다.',data:member});
});

// 회원 삭제(/member/delete/:id)
router.delete('/delete/:id',async(req,res)=>{
    let id = req.params.id;
    let member = await Member.findOneAndDelete({id}).lean();
    if(member == null){
      return  res.json({'success':false,'msg':'회원 없음'});
    }
    res.json({'success':true,'msg':'회원삭제 완료', data:member});
});

module.exports = router;