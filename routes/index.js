var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session && req.session.currentUser) {
        res.render('index', {
            title: conf.APP.NAME,
            Statics_Ver: conf.Statics_Ver,
            curUser: JSON.stringify(req.session.currentUser)
        });
    } else {
        res.render('index', {title: conf.APP.NAME, curUser: {}});
    }
});

module.exports = router;
