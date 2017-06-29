'use strict';

const router = require('express').Router();
const adPositionService = require('../service/AdPositionService.js');
const utils = require('../utils/utils.js');
router.get('/', function(req, res) {
  let vid = req.query.vid;
  let tag = req.query.tag;
  adPositionService.queryAdPosition(vid, tag).then(function(adp) {
    utils.response(res, conf.ERRORS.OK, adp);
  }).catch(function(err) {
    console.log(err);
    utils.response(res, conf.ERRORS.SERVER_ERROR, err.message || err);
  });
});

router.get('/list', (req, res) => {
  let vid = req.query.vid;
  let tag = req.query.tag || 'car';
  let pid = req.query.pid;
  let brand = req.query.brand;
  adPositionService.reduceList({
    vid,
    tag,
    pid,
    brand
  }).then((result) => {
    utils.response(res, conf.ERRORS.OK, result);
  }).catch(err => {
    utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
  })
})

router.get('/listByPid', (req, res) => {
  let pid = req.query.pid;
  if (pid) {
    adPositionService.listByPid(pid).then(result => {
      utils.response(res, conf.ERRORS.OK, result);
    }).catch(err => {
      utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
    });
  } else {
    utils.response(res, conf.conf.ERRORS.ARGUMENTS_ERROR, '参数错误，pid不能为空');
  }
})

router.get('/brands', (req, res) => {
  let tag = req.query.tag;
  adPositionService.getBrands({
    tag: tag
  }).then(result => {
    utils.response(res, conf.ERRORS.OK, result);
  }).catch(err => {
    utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
  })
})

router.get('/tags', (req, res) => {
  adPositionService.getTags({}).then(result => {
    utils.response(res, conf.ERRORS.OK, result);
  }).catch(err => {
    utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
  });
})

router.post('/addJob', (req, res) => {
  let pid = req.body.pid;
  let level = req.body.level || 0;
  adPositionService.addJob(pid, level).then(jid => {
    utils.response(res, conf.ERRORS.OK, jid);
  }).catch(err => {
    utils.response(res, conf.ERRORS.SERVER_ERROR, err.message || err);
  })
});


router.post('/queryJob', (req, res) => {
  let pid = req.body.pid;
  let jid = req.body.jid;
  let opt = Object.create(null);
  if (pid) {
    opt.pid = pid;
  } else if (jid) {
    opt.jid = jid;
  }
  adPositionService.queryJob(opt).then(result => {
    utils.response(res, conf.ERRORS.OK, result);
  }).catch(err => {
    utils.response(res, conf.ERRORS.SERVER_ERROR, err.message || err);
  })
})

router.post('/changeJobPriority', (req, res) => {
  let jid = req.body.jid;
  let level = req.body.level;

  if (jid && level) {
    adPositionService.changeJobPriority(jid,level).then(result => {
      utils.response(res, conf.ERRORS.OK, result);
    }).catch(err => {
      utils.response(res, conf.ERRORS.SERVER_ERROR, err.message || err);
    })
  } else {
    utils.response(res, conf.ERRORS.SERVER_ERROR, '参数错误，jid和level不能为空');
  }
})

module.exports = router;