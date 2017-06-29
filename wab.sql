/*
 Navicat MySQL Data Transfer

 Source Server         : 10.130.83.224
 Source Server Version : 50534
 Source Host           : 10.130.83.224
 Source Database       : ark_wab

 Target Server Version : 50534
 File Encoding         : utf-8

 Date: 08/19/2016 10:15:14 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `ad`
-- ----------------------------
DROP TABLE IF EXISTS `ad`;
CREATE TABLE `ad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT '广告名称',
  `creative_id` int(11) NOT NULL DEFAULT '0' COMMENT '创意ID',
  `platform` int(11) NOT NULL COMMENT '平台',
  `description` text NOT NULL COMMENT '描述',
  `form` text NOT NULL COMMENT '填写的内容',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NULL DEFAULT NULL COMMENT '上次更新时间',
  `creator` int(11) NOT NULL COMMENT '创建者ID',
  `updater` int(11) DEFAULT NULL COMMENT '上次更新者',
  `state` int(11) NOT NULL DEFAULT '1' COMMENT '状态 0失效 1可用 ',
  `pushState` int(11) NOT NULL DEFAULT '1' COMMENT '推送状态 0 已删除 1未推送 2已推送 3已下线',
  `groupId` int(11) NOT NULL DEFAULT '1' COMMENT '媒体ID',
  `isCopy` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否是复制来的',
  `copyFrom` int(11) DEFAULT NULL COMMENT '从哪个广告复制来的',
  `editAfterCopy` tinyint(4) NOT NULL DEFAULT '0' COMMENT '复制后是否经过编辑',
  `offlineReason` varchar(100) DEFAULT '0' COMMENT '下线原因',
  `source` tinyint(4) DEFAULT '0' COMMENT '数据来源 0 自身商品 1阿里商品',
  `sourceId` varchar(100) DEFAULT NULL COMMENT '商品来源ID',
  PRIMARY KEY (`id`),
  KEY `idx_creative_id` (`creative_id`),
  KEY `idx_platform_id` (`platform`),
  KEY `idx_state` (`state`,`pushState`)
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `creatives`
-- ----------------------------
DROP TABLE IF EXISTS `creatives`;
CREATE TABLE `creatives` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '创意ID',
  `name` varchar(200) NOT NULL,
  `form` text NOT NULL,
  `platform` int(11) NOT NULL DEFAULT '1' COMMENT '平台ID',
  `description` text NOT NULL COMMENT '描述',
  `adzone` int(11) NOT NULL DEFAULT '0' COMMENT '广告位，暂时无用',
  `components` varchar(200) NOT NULL COMMENT '一个创意中有哪些组件 用,分割',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NULL DEFAULT NULL COMMENT '上次更新时间',
  `creator` int(11) NOT NULL COMMENT '创建用户',
  `updater` int(11) DEFAULT NULL COMMENT '上次更新人',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '0不可用 1可用',
  `groupId` int(11) NOT NULL DEFAULT '1' COMMENT '媒体ID',
  PRIMARY KEY (`id`),
  KEY `idx_platform` (`platform`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8 COMMENT='广告模板';

-- ----------------------------
--  Table structure for `handle_log`
-- ----------------------------
DROP TABLE IF EXISTS `handle_log`;
CREATE TABLE `handle_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creator` int(11) DEFAULT NULL,
  `type` varchar(100) NOT NULL COMMENT '操作类型 insert update delete',
  `target_id` varchar(11) DEFAULT NULL COMMENT '操作的数据的id',
  `target_state` varchar(255) NOT NULL COMMENT '操作类型',
  PRIMARY KEY (`id`),
  KEY `idx_tablename` (`table_name`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=4685 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `modules`
-- ----------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT '名称',
  `path` varchar(200) NOT NULL COMMENT '路径',
  `weight` int(11) NOT NULL COMMENT '权重 1 2 4 8',
  `description` text COMMENT '模块描述',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='模块表';

-- ----------------------------
--  Table structure for `monitor`
-- ----------------------------
DROP TABLE IF EXISTS `monitor`;
CREATE TABLE `monitor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component` varchar(100) DEFAULT '' COMMENT '组件名称',
  `creative_id` int(11) NOT NULL DEFAULT '0' COMMENT '创意ID',
  `ad_id` int(11) NOT NULL DEFAULT '0' COMMENT '广告ID',
  `oiid` int(11) DEFAULT NULL COMMENT '订单ID',
  `type` int(11) NOT NULL COMMENT '1 impr 2click 4.event',
  `typename` varchar(100) DEFAULT NULL,
  `offset` int(11) DEFAULT '0' COMMENT '进度监测的类型',
  `url` varchar(255) DEFAULT NULL COMMENT '点击地址',
  `source` int(11) NOT NULL DEFAULT '1' COMMENT '来源 1方舟 2其他家',
  `creator` int(11) DEFAULT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `state` int(11) NOT NULL DEFAULT '1' COMMENT '监测状态 1正常 0不可用',
  PRIMARY KEY (`id`),
  KEY `idx_adid_component_type_source` (`ad_id`,`component`,`type`,`source`),
  KEY `idx_adid_state` (`ad_id`,`state`)
) ENGINE=InnoDB AUTO_INCREMENT=1058 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `order_targeting`
-- ----------------------------
DROP TABLE IF EXISTS `order_targeting`;
CREATE TABLE `order_targeting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL COMMENT '订单ID',
  `target_catelog` varchar(20) NOT NULL DEFAULT 'live' COMMENT '定向大分类',
  `target_type` varchar(20) NOT NULL DEFAULT 'stream' COMMENT '定向类别 live 直播 vod点播',
  `target_value` varchar(200) NOT NULL COMMENT '定向值，如果是直播流则选择直播流',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `operator` varchar(20) NOT NULL DEFAULT '=' COMMENT '操作符 包括= ，!= , >,< 现在制作=',
  `parent_id` int(11) DEFAULT NULL COMMENT 'target_value的父id，对于vid，其parent_id为pid,对于pid，其parent_id为null，对于直播流，其parent_id为直播流id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_target_value` (`target_type`,`target_value`,`order_id`,`operator`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2258 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `orders`
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `name` varchar(200) NOT NULL COMMENT '订单名称',
  `ad_id` int(11) NOT NULL COMMENT '广告id，关联了哪个广告',
  `description` text NOT NULL COMMENT '描述',
  `platform` int(11) NOT NULL COMMENT '平台',
  `deliverType` varchar(255) NOT NULL DEFAULT 'auto' COMMENT '投放方式  auto 自动投放 manual 手动投放',
  `targetType` varchar(50) NOT NULL DEFAULT 'live' COMMENT '定向类别',
  `startTime` timestamp NULL DEFAULT NULL COMMENT '开始时间',
  `offset` float NOT NULL DEFAULT '0' COMMENT '点播进度条时间点',
  `duration` float NOT NULL COMMENT '持续时间 单位s',
  `endTime` timestamp NULL DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT '1' COMMENT '广告状态  1待上线 2已上线 3已下线 0被删除',
  `pushState` int(11) NOT NULL DEFAULT '1' COMMENT '推送状态 0 删除 1待上 2已推送 3已推送下线',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creator` int(11) NOT NULL COMMENT '用户ID',
  `nexttick` timestamp NULL DEFAULT NULL COMMENT '下次检查的需要时间',
  `flag` int(11) NOT NULL DEFAULT '1' COMMENT '删除状态 0 删除 1正常',
  `updater` int(11) DEFAULT NULL COMMENT '更新者',
  `updatetime` timestamp NULL DEFAULT NULL COMMENT '上次更新时间',
  `online_time` timestamp NULL DEFAULT NULL COMMENT '上线时间',
  `offline_time` timestamp NULL DEFAULT NULL COMMENT '下线时间',
  `groupId` int(11) NOT NULL DEFAULT '1' COMMENT '媒体ID',
  `isCopy` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否复制来的',
  `copyFrom` int(11) DEFAULT NULL COMMENT '从哪个订单复制过来的',
  `editAfterCopy` tinyint(4) NOT NULL DEFAULT '0' COMMENT '复制后是否经过更改',
  `offlineReason` varchar(100) DEFAULT NULL COMMENT '下线原因',
  `orderType` int(11) NOT NULL DEFAULT '0' COMMENT '订单类型，0表示普通订单，1表示可视化打点订单',
  PRIMARY KEY (`id`),
  KEY `idx_state_flag_time` (`startTime`,`endTime`,`state`,`flag`,`deliverType`) USING BTREE,
  KEY `idx_platform_creator` (`platform`,`creator`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `platforms`
-- ----------------------------
DROP TABLE IF EXISTS `platforms`;
CREATE TABLE `platforms` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '平台ID',
  `name` varchar(20) NOT NULL COMMENT '平台',
  `desc` varchar(56) NOT NULL,
  `terminal` varchar(20) DEFAULT NULL COMMENT '终端',
  `mediaName` varchar(50) DEFAULT NULL COMMENT '媒体名称',
  `groupId` int(11) DEFAULT '1' COMMENT '媒体ID',
  PRIMARY KEY (`id`),
  KEY `idx_group` (`groupId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `platforms`
-- ----------------------------
BEGIN;
INSERT INTO `platforms` VALUES ('1', 'PC网页端', '', null, null, '1'), ('2', 'iPhone基线客户端', '', null, null, '1'), ('3', 'Android基线客户端', '', null, null, '1'), ('4', 'iPad基线客户端', '', null, null, '1'), ('5', 'TV端', '', null, null, '2'), ('6', 'M站', ' ', null, null, '1'), ('7', 'PC客户端', '', null, null, '1'), ('8', 'TV-LIVE', '', null, null, '2'), ('9', '手机-LIVE', '', null, null, '2');
COMMIT;

-- ----------------------------
--  Table structure for `user_module`
-- ----------------------------
DROP TABLE IF EXISTS `user_module`;
CREATE TABLE `user_module` (
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `module_id` int(10) unsigned NOT NULL COMMENT '模块ID',
  `permission` int(11) NOT NULL DEFAULT '-1' COMMENT '权限 1读 2写 4删除',
  PRIMARY KEY (`user_id`,`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户模块关系表\n可以细分到每一个模块的权限\n和user连表需要left join';

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL COMMENT '用户名',
  `nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
  `password` char(32) NOT NULL COMMENT '密码',
  `permission` int(11) NOT NULL COMMENT '权限 8 4 2 1 法 -1为所有权限',
  `group` int(11) DEFAULT '0' COMMENT '组id',
  `appkey` varchar(100) DEFAULT NULL COMMENT 'appkey',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLoginTime` timestamp NULL DEFAULT NULL COMMENT '上次登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unque_username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;


ALTER TABLE `ad` ADD COLUMN `isCopy` tinyint NOT NULL DEFAULT '0' COMMENT '是否是复制来的' AFTER `groupId`, ADD COLUMN `copyFrom` int COMMENT '从哪个广告复制来的' AFTER `isCopy`, ADD COLUMN `editAfterCopy` tinyint NOT NULL DEFAULT '0' COMMENT '复制后是否经过编辑' AFTER `copyFrom`;
ALTER TABLE `ad` ADD COLUMN `offlineReason` varchar(100) DEFAULT '0' COMMENT '下线原因' AFTER `editAfterCopy`;


ALTER TABLE `ad` ADD COLUMN `source` TINYINT DEFAULT '0' COMMENT '数据来源 0 自身商品 1阿里商品' AFTER `offlineReason`,
ADD COLUMN `sourceId` VARCHAR(100)COMMENT '商品来源ID' AFTER `source`;
--增加offset
ALTER TABLE `orders` ADD COLUMN `offset` float NOT NULL DEFAULT '0' COMMENT '开始时长，点播使用进度条' AFTER `startTime`, CHANGE COLUMN `duration` `duration` float NOT NULL COMMENT '持续时间 单位s' AFTER `offset`, CHANGE COLUMN `endTime` `endTime` timestamp NULL DEFAULT NULL AFTER `duration`, CHANGE COLUMN `state` `state` int(11) NOT NULL DEFAULT '1' COMMENT '广告状态  1待上线 2已上线 3已下线 0被删除' AFTER `endTime`, CHANGE COLUMN `pushState` `pushState` int(11) NOT NULL DEFAULT '1' COMMENT '推送状态 0 删除 1待上 2已推送 3已推送下线' AFTER `state`, CHANGE COLUMN `createtime` `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `pushState`, CHANGE COLUMN `creator` `creator` int(11) NOT NULL COMMENT '用户ID' AFTER `createtime`, CHANGE COLUMN `nexttick` `nexttick` timestamp NULL DEFAULT NULL COMMENT '下次检查的需要时间' AFTER `creator`, CHANGE COLUMN `flag` `flag` int(11) NOT NULL DEFAULT '1' COMMENT '删除状态 0 删除 1正常' AFTER `nexttick`, CHANGE COLUMN `updater` `updater` int(11) DEFAULT NULL COMMENT '更新者' AFTER `flag`, CHANGE COLUMN `updatetime` `updatetime` timestamp NULL DEFAULT NULL COMMENT '上次更新时间' AFTER `updater`, CHANGE COLUMN `online_time` `online_time` timestamp NULL DEFAULT NULL COMMENT '上线时间' AFTER `updatetime`, CHANGE COLUMN `offline_time` `offline_time` timestamp NULL DEFAULT NULL COMMENT '下线时间' AFTER `online_time`, CHANGE COLUMN `groupId` `groupId` int(11) NOT NULL DEFAULT '1' COMMENT '媒体ID' AFTER `offline_time`, CHANGE COLUMN `isCopy` `isCopy` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否复制来的' AFTER `groupId`, CHANGE COLUMN `copyFrom` `copyFrom` int(11) DEFAULT NULL COMMENT '从哪个订单复制过来的' AFTER `isCopy`, CHANGE COLUMN `editAfterCopy` `editAfterCopy` tinyint(4) NOT NULL DEFAULT '0' COMMENT '复制后是否经过更改' AFTER `copyFrom`, CHANGE COLUMN `offlineReason` `offlineReason` varchar(100) DEFAULT NULL COMMENT '下线原因' AFTER `editAfterCopy`;

--
ALTER TABLE `orders` ADD COLUMN `isCopy` tinyint NOT NULL DEFAULT '0' COMMENT '是否复制来的' AFTER `groupId`, ADD COLUMN `copyFrom` int COMMENT '从哪个订单复制过来的' AFTER `isCopy`, ADD COLUMN `editAfterCopy` tinyint NOT NULL DEFAULT '0' COMMENT '复制后是否经过更改' AFTER `copyFrom`;

--order增加下线原因
ALTER TABLE `orders` ADD COLUMN `offlineReason` varchar(100) COMMENT '下线原因' AFTER `editAfterCopy`;

alter table orders add orderType int not null default 0 comment '订单类型，0表示普通订单，1表示可视化打点订单';
ALTER TABLE order_targeting ADD parent_id INT(11) COMMENT 'target_value的父id，对于vid，其parent_id为pid,对于pid，其parent_id为null，对于直播流，其parent_id为直播流id';

--视频打点座标值
ALTER TABLE orders ADD coordinate VARCHAR(256) COMMENT '可视化打点座标值,json形式,x为横座标,y为纵座标';


--会员定向--
ALTER TABLE orders ADD member INTEGER comment '会员定向:0-全部，1-非会员，2-会员';
--地域定向--
ALTER TABLE orders ADD areas TEXT comment '地域定向';

--设置所有老订单为全部会员定向
update orders set member=0 where member is null

--加入老订单会员定向
insert into order_targeting(order_id,target_catelog,target_type,target_value,operator,parent_id)
select distinct(id),'member','member',0,'=',0 from orders where id not in (
	select order_id from order_targeting where target_catelog = 'member'
	and  target_type='member'
)