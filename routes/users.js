var express = require('express');
var router = express.Router();
var User = require('../model/User');
var Utils = require('../utils/utils');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', function (req, res, next) {
    var permission = parseInt(req.body['permission']) || -1;
    var user = new User(req.body["email"], req.body["password"], permission, conf.GROUPS_DICT.ADMIN);
    user.signUp(function (err, data) {
        res.json(data);
    })
});

router.post('/signin', function (req, res, next) {
    var user = new User(req.body["email"], req.body["password"], -1, conf.GROUPS_DICT.ADMIN);
    user.login(function (err, data) {
        if (!err && data.length > 0) {
            if (data[0].password == user.password) {
                delete data[0].password;
                req.session.currentUser = data[0];
                res.json(data[0]);
            } else {
                res.json({id: 0});
            }
        } else {
            res.json(null);
        }
    })
});

router.post('/changePassword', function (req, res, next) {
    var user = req.body;
    User.changePassword(req.session.currentUser.id, user.username, user.rawPassword, user.newPassword).then(function (data) {
        Utils.response(res, conf.ERRORS.OK, data);
    }, function (err) {
        Utils.response(res, conf.ERRORS.DB_ERROR, err.message);
    });
});

router.get('/logout', function (req, res, next) {
    req.session.currentUser = null;
    res.json({});
});

module.exports = router;
