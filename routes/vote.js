'use strict';

var router = require('express').Router();
var uuid = require('node-uuid');
var request = require('request');
var utils = require('../utils/utils.js');
var crypto=require('crypto');

var aes = {
    encry:function(text){
        let cipher = crypto.createCipher('aes-256-cbc',conf.VOTE.TOKEN);
        let crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    dencry:function(text){
        let decipher = crypto.createDecipher('aes-256-cbc',conf.VOTE.TOKEN);
        let dec = decipher.update(text,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    }
}

var req_options = {
  headers: {
    'token':null
  }
};

router.post('/',function(req,res){
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    let vote = req.body;
    if(!vote){
        return res.json('vote不能为空');
    }
    vote.v_activityid = uuid.v4();

    let answer_uuid = [];

    let options = vote && vote.v_options;
    let form = options.map((item)=>{
        item.v_id = uuid.v4();
        item.v_activityid = vote.v_activityid;
        item.v_title = vote.v_title;
        item.v_isSingle = vote.v_isSingle;
        item.v_canRepeat = vote.v_canRepeat;
        item.v_optimize = vote.v_optimize;
        if(item.is_right_answer == '1'){
            // answer_uuid = item.v_id;
            answer_uuid.push(item.v_id);
        }
        return item;
    });

    form.forEach((item)=>{
        item.v_right_answer = answer_uuid.join();
    });

    req_options.url = conf.VOTE.HOST + '/votes/addVote';
    req_options.method = 'POST';
    req_options.json = true;
    req_options.body = {v_options:form};

    request(req_options,function(error,response,body){
        if(error){
            console.log('error');
            console.log(error);
            return utils.response(res, conf.ERRORS.SERVER_ERROR, error.message);
        }
        if(response){
            console.log('response');
        }
        if(body){
            console.log('body');
            console.log(body);
        }
        utils.response(res, conf.ERRORS.OK, body);
    });
});

router.get('/',function(req,res){
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    console.log(req_options);
    let page = req.query.page || 1;
    let limit = req.query.limit || 20;
    let url = conf.VOTE.HOST + '/votes/voteList'
    request.get(url,req_options,function(err,response,body){
        if(err){
            return utils.response(res,conf.ERRORS.SERVER_ERROR,err.message);
        }
        console.log(body);
        if(typeof body == 'string'){
            body = JSON.parse(body);
        }
        let rdata = {
            pageNumber:1,
            pageCount:1,
            total:body && body.data.length,
            results:body && body.data
        }
        utils.response(res,conf.ERRORS.OK,rdata);
    });
    
});

router.put('/:v_activityid',function (req,res) {
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    let v_activityid = req.params.v_activityid;
    let body = req.body;
    if(!v_activityid){
        return utils.response(res,conf.ERRORS.ARGUMENTS_ERROR,'参数错误,v_activityid不能为空');
    }

    body.v_options.forEach((item)=>{
        if(!item.v_id){
            item.v_id = uuid.v4();
        }
    });

    //设置正确答案
    if(body.v_isSingle >>> 0 == 1){
       //单选 
       for(let op of body.v_options){
            if(op.is_right_answer == 1){
                body.v_right_answer = op.v_id;
            }
        }
    }else if(body.v_isSingle >>> 0 == 0){
        //多选
        body.v_right_answer = [];
        for(let op of body.v_options){
            if(op.is_right_answer == 1){
                body.v_right_answer.push(op.v_id);
            }
        }
        body.v_right_answer = body.v_right_answer.join(',');
    }

    //如果正确答案为空，则传空字符串
    if(!body.v_right_answer){
        body.v_right_answer = '';
    }

    let url = conf.VOTE.HOST + '/votes/updateVote';
    req_options.url = url;
    req_options.json = true;
    req_options.body = body;
    request.post(url,req_options,function (err,response,body) {
        if(err){
            return utils.response(res,conf.ERRORS.SERVER_ERROR,err.message);
        }
        if(typeof body == 'string'){
            body = JSON.parse(body);
        }
        utils.response(res,conf.ERRORS.OK,body);
    })
});

router.get('/:v_activityid',function(req,res){
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    let v_activityid = req.params.v_activityid;
    if(!v_activityid){
        return utils.response(res,conf.ERRORS.ARGUMENTS_ERROR,'参数错误,v_activityid不能为空');
    }
    let url = conf.VOTE.HOST + '/votes/find/' + v_activityid;
    request.get(url,req_options,function(err,response,body){
        if(err){
            return utils.response(res,conf.ERRORS.SERVER_ERROR,err.message);
        }
        if(typeof body == 'string'){
            body = JSON.parse(body);
        }
        if(body.v_right_answer){
            if(typeof body.v_right_answer == 'string'){
                body.v_right_answer = body.v_right_answer.split(',');
            }
        }else{
            body.v_right_answer = [];
        }
        
        body.v_options.forEach(function(option){
            if(body.v_right_answer.indexOf(option.v_id) > -1){
                option.is_right_answer = 1;
            }else{
                option.is_right_answer = 0;
            }
        });

        utils.response(res,conf.ERRORS.OK,body);
    });
})

//添加投票选项
router.post('/option',function (req,res) {
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    let vote = req.body;
    if(!vote){
        return utils.response(res,conf.ERRORS.ARGUMENTS_ERROR,'vote不能为空');
    }

    let options = vote && vote.v_options;
    let form = options.map((item)=>{
        item.v_id = uuid.v4();
        item.v_activityid = vote.v_activityid;
        item.v_title = vote.v_title;
        item.v_isSingle = vote.v_isSingle;
        item.v_canRepeat = vote.v_canRepeat;
        item.v_optimize = vote.v_optimize;
        if(Array.isArray(vote.v_right_answer)){
            item.v_right_answer = vote.v_right_answer.join();
        }
        return item;
    });

    let url = conf.VOTE.HOST + '/votes/addVote';
    req_options.body = vote;
    req_options.json = true;
    request.post(url,req_options,function (err,response,body) {
        console.log(err);
        console.log(body);
        if(err){
            return utils.response(res,conf.ERRORS.SERVER_ERROR,err.message);
        }
        if(typeof body == 'string'){
            body = JSON.parse(body);
        }
        utils.response(res,conf.ERRORS.OK,body);
    });
});

//更新投票选项
router.put('/option/:v_id',function (req,res) {
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    let v_option = req.body;
    let v_id = req.params.v_id;
    if(!v_option || !v_id) {
        return utils.response(res,conf.ERRORS.ARGUMENTS_ERROR,'参数错误，v_option不能为空');
    }
    if(!v_option.v_activityid){
        return utils.response(res,conf.ERRORS.ARGUMENTS_ERROR,'参数错误，v_activityid不能为空');
    }
    let url = conf.VOTE.HOST + '/votes/updateOption';
    req_options.body = v_option;
    req_options.json = true;
    request.post(url,req_options,function (err,response,body) {
        if(err){
            return utils.response(res,conf.ERRORS.SERVER_ERROR,err.message);
        }
        if(typeof body == 'string'){
            body = JSON.parse(body);
        }
        utils.response(res,conf.ERRORS.OK,body);
    });

});

//删除投票选项
router.delete('/option/:v_id',function(req,res){
    let user_str = JSON.stringify(req.session.currentUser);
    req_options.headers.token = aes.encry(user_str);
    let v_id = req.params.v_id;
    let url = conf.VOTE.HOST + '/votes/deleteOption?id='+v_id;
    request.get(url,req_options,function(err,response,body){
        if(err){
            return utils.response(res,conf.ERRORS.SERVER_ERROR,err.message);
        }
        if(typeof body == 'string'){
            body = JSON.parse(body);
        }
        utils.response(res,conf.ERRORS.OK,body);
    })
})

module.exports = router;