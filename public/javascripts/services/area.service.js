'use strict';

var areas = [
    {
        "available": 1,
        "country_id": 1004000000,
        "id": 1004000000,
        "name": "阿富汗",
        "parent_id": 1004000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1008000000,
        "id": 1008000000,
        "name": "阿尔巴尼亚",
        "parent_id": 1008000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1010000000,
        "id": 1010000000,
        "name": "南极洲",
        "parent_id": 1010000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1012000000,
        "id": 1012000000,
        "name": "阿尔及利亚",
        "parent_id": 1012000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1016000000,
        "id": 1016000000,
        "name": "美属萨摩亚",
        "parent_id": 1016000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1020000000,
        "id": 1020000000,
        "name": "安道尔",
        "parent_id": 1020000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1024000000,
        "id": 1024000000,
        "name": "安哥拉",
        "parent_id": 1024000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1028000000,
        "id": 1028000000,
        "name": "安提瓜和巴布达",
        "parent_id": 1028000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1031000000,
        "id": 1031000000,
        "name": "阿塞拜疆",
        "parent_id": 1031000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1032000000,
        "id": 1032000000,
        "name": "阿根廷",
        "parent_id": 1032000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1036000000,
        "id": 1036000000,
        "name": "澳大利亚",
        "parent_id": 1036000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1040000000,
        "id": 1040000000,
        "name": "奥地利",
        "parent_id": 1040000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1044000000,
        "id": 1044000000,
        "name": "巴哈马",
        "parent_id": 1044000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1048000000,
        "id": 1048000000,
        "name": "巴林",
        "parent_id": 1048000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1050000000,
        "id": 1050000000,
        "name": "孟加拉",
        "parent_id": 1050000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1051000000,
        "id": 1051000000,
        "name": "亚美尼亚",
        "parent_id": 1051000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1052000000,
        "id": 1052000000,
        "name": "巴巴多斯",
        "parent_id": 1052000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1056000000,
        "id": 1056000000,
        "name": "比利时",
        "parent_id": 1056000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1060000000,
        "id": 1060000000,
        "name": "百慕大",
        "parent_id": 1060000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1064000000,
        "id": 1064000000,
        "name": "不丹",
        "parent_id": 1064000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1068000000,
        "id": 1068000000,
        "name": "玻利维亚",
        "parent_id": 1068000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1070000000,
        "id": 1070000000,
        "name": "波黑",
        "parent_id": 1070000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1072000000,
        "id": 1072000000,
        "name": "博茨瓦纳",
        "parent_id": 1072000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1074000000,
        "id": 1074000000,
        "name": "布韦岛",
        "parent_id": 1074000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1076000000,
        "id": 1076000000,
        "name": "巴西",
        "parent_id": 1076000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1084000000,
        "id": 1084000000,
        "name": "伯利兹",
        "parent_id": 1084000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1086000000,
        "id": 1086000000,
        "name": "英属印度洋领地",
        "parent_id": 1086000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1090000000,
        "id": 1090000000,
        "name": "所罗门群岛",
        "parent_id": 1090000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1092000000,
        "id": 1092000000,
        "name": "英属维尔京群岛",
        "parent_id": 1092000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1096000000,
        "id": 1096000000,
        "name": "文莱",
        "parent_id": 1096000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1100000000,
        "id": 1100000000,
        "name": "保加利亚",
        "parent_id": 1100000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1104000000,
        "id": 1104000000,
        "name": "缅甸",
        "parent_id": 1104000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1108000000,
        "id": 1108000000,
        "name": "布隆迪",
        "parent_id": 1108000000,
        "type": 0
    },
    {
        "available": 0,
        "country_id": 1111111111,
        "id": 1111111111,
        "name": "未知",
        "parent_id": 1111111111,
        "type": -1
    },
    {
        "available": 1,
        "country_id": 1112000000,
        "id": 1112000000,
        "name": "白俄罗斯",
        "parent_id": 1112000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1116000000,
        "id": 1116000000,
        "name": "柬埔寨",
        "parent_id": 1116000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1120000000,
        "id": 1120000000,
        "name": "喀麦隆",
        "parent_id": 1120000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1124000000,
        "id": 1124000000,
        "name": "加拿大",
        "parent_id": 1124000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1132000000,
        "id": 1132000000,
        "name": "佛得角",
        "parent_id": 1132000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1136000000,
        "id": 1136000000,
        "name": "开曼群岛",
        "parent_id": 1136000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1140000000,
        "id": 1140000000,
        "name": "中非",
        "parent_id": 1140000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1144000000,
        "id": 1144000000,
        "name": "斯里兰卡",
        "parent_id": 1144000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1148000000,
        "id": 1148000000,
        "name": "乍得",
        "parent_id": 1148000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1152000000,
        "id": 1152000000,
        "name": "智利",
        "parent_id": 1152000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156000000,
        "name": "中国",
        "parent_id": 1156000000,
        "ticked":true,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156110000,
        "name": "北京市",
        "parent_id": 1156000000,
        //"ticked":true,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156120000,
        "name": "天津市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130000,
        "name": "河北省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130100,
        "name": "石家庄市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130200,
        "name": "唐山市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130300,
        "name": "秦皇岛市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130400,
        "name": "邯郸市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130500,
        "name": "邢台市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130600,
        "name": "保定市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130700,
        "name": "张家口市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130800,
        "name": "承德市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156130900,
        "name": "沧州市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156131000,
        "name": "廊坊市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156131100,
        "name": "衡水市",
        "parent_id": 1156130000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140000,
        "name": "山西省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140100,
        "name": "太原市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140200,
        "name": "大同市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140300,
        "name": "阳泉市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140400,
        "name": "长治市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140500,
        "name": "晋城市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140600,
        "name": "朔州市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140700,
        "name": "晋中市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140800,
        "name": "运城市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156140900,
        "name": "忻州市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156141000,
        "name": "临汾市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156141100,
        "name": "吕梁市",
        "parent_id": 1156140000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150000,
        "name": "内蒙古自治区",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150100,
        "name": "呼和浩特市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150200,
        "name": "包头市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150300,
        "name": "乌海市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150400,
        "name": "赤峰市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150500,
        "name": "通辽市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150600,
        "name": "鄂尔多斯市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150700,
        "name": "呼伦贝尔市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150800,
        "name": "巴彦淖尔市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156150900,
        "name": "乌兰察布市",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156152200,
        "name": "兴安盟",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156152500,
        "name": "锡林郭勒盟",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156152900,
        "name": "阿拉善盟",
        "parent_id": 1156150000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210000,
        "name": "辽宁省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210100,
        "name": "沈阳市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210200,
        "name": "大连市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210300,
        "name": "鞍山市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210400,
        "name": "抚顺市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210500,
        "name": "本溪市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210600,
        "name": "丹东市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210700,
        "name": "锦州市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210800,
        "name": "营口市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210900,
        "name": "阜新市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156211000,
        "name": "辽阳市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156211100,
        "name": "盘锦市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156211200,
        "name": "铁岭市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156211300,
        "name": "朝阳市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156211400,
        "name": "葫芦岛市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220000,
        "name": "吉林省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220100,
        "name": "长春市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220200,
        "name": "吉林市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220300,
        "name": "四平市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220400,
        "name": "辽源市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220500,
        "name": "通化市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220600,
        "name": "白山市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220700,
        "name": "松原市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156220800,
        "name": "白城市",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156222400,
        "name": "延边朝鲜族自治州",
        "parent_id": 1156220000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230000,
        "name": "黑龙江省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230100,
        "name": "哈尔滨市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230200,
        "name": "齐齐哈尔市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230300,
        "name": "鸡西市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230400,
        "name": "鹤岗市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230500,
        "name": "双鸭山市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230600,
        "name": "大庆市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230700,
        "name": "伊春市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230800,
        "name": "佳木斯市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156230900,
        "name": "七台河市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156231000,
        "name": "牡丹江市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156231100,
        "name": "黑河市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156231200,
        "name": "绥化市",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156232700,
        "name": "大兴安岭地区",
        "parent_id": 1156230000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156310000,
        "name": "上海市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320000,
        "name": "江苏省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320100,
        "name": "南京市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320200,
        "name": "无锡市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320300,
        "name": "徐州市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320400,
        "name": "常州市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320500,
        "name": "苏州市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320600,
        "name": "南通市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320700,
        "name": "连云港市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320800,
        "name": "淮安市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320900,
        "name": "盐城市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156321000,
        "name": "扬州市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156321100,
        "name": "镇江市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156321200,
        "name": "泰州市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156321300,
        "name": "宿迁市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330000,
        "name": "浙江省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330100,
        "name": "杭州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330200,
        "name": "宁波市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330300,
        "name": "温州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330400,
        "name": "嘉兴市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330500,
        "name": "湖州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330600,
        "name": "绍兴市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330700,
        "name": "金华市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330800,
        "name": "衢州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330900,
        "name": "舟山市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156331000,
        "name": "台州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156331100,
        "name": "丽水市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340000,
        "name": "安徽省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340100,
        "name": "合肥市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340200,
        "name": "芜湖市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340300,
        "name": "蚌埠市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340400,
        "name": "淮南市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340500,
        "name": "马鞍山市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340600,
        "name": "淮北市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340700,
        "name": "铜陵市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156340800,
        "name": "安庆市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341000,
        "name": "黄山市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341100,
        "name": "滁州市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341200,
        "name": "阜阳市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341300,
        "name": "宿州市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341400,
        "name": "巢湖市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341500,
        "name": "六安市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341600,
        "name": "亳州市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341700,
        "name": "池州市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156341800,
        "name": "宣城市",
        "parent_id": 1156340000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350000,
        "name": "福建省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350100,
        "name": "福州市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350200,
        "name": "厦门市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350300,
        "name": "莆田市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350400,
        "name": "三明市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350500,
        "name": "泉州市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350600,
        "name": "漳州市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350700,
        "name": "南平市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350800,
        "name": "龙岩市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156350900,
        "name": "宁德市",
        "parent_id": 1156350000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360000,
        "name": "江西省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360100,
        "name": "南昌市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360200,
        "name": "景德镇市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360300,
        "name": "萍乡市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360400,
        "name": "九江市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360500,
        "name": "新余市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360600,
        "name": "鹰潭市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360700,
        "name": "赣州市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360800,
        "name": "吉安市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156360900,
        "name": "宜春市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156361000,
        "name": "抚州市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156361100,
        "name": "上饶市",
        "parent_id": 1156360000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370000,
        "name": "山东省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370100,
        "name": "济南市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370200,
        "name": "青岛市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370300,
        "name": "淄博市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370400,
        "name": "枣庄市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370500,
        "name": "东营市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370600,
        "name": "烟台市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370700,
        "name": "潍坊市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370800,
        "name": "济宁市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370900,
        "name": "泰安市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371000,
        "name": "威海市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371100,
        "name": "日照市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371200,
        "name": "莱芜市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371300,
        "name": "临沂市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371400,
        "name": "德州市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371500,
        "name": "聊城市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371600,
        "name": "滨州市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156371700,
        "name": "菏泽市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410000,
        "name": "河南省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410100,
        "name": "郑州市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410200,
        "name": "开封市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410300,
        "name": "洛阳市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410400,
        "name": "平顶山市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410500,
        "name": "安阳市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410600,
        "name": "鹤壁市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410700,
        "name": "新乡市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410800,
        "name": "焦作市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156410900,
        "name": "濮阳市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411000,
        "name": "许昌市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411100,
        "name": "漯河市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411200,
        "name": "三门峡市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411300,
        "name": "南阳市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411400,
        "name": "商丘市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411500,
        "name": "信阳市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411600,
        "name": "周口市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156411700,
        "name": "驻马店市",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156419000,
        "name": "省直辖县级行政区划",
        "parent_id": 1156410000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420000,
        "name": "湖北省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420100,
        "name": "武汉市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420200,
        "name": "黄石市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420300,
        "name": "十堰市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420500,
        "name": "宜昌市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420600,
        "name": "襄阳市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420700,
        "name": "鄂州市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420800,
        "name": "荆门市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420900,
        "name": "孝感市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156421000,
        "name": "荆州市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156421100,
        "name": "黄冈市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156421200,
        "name": "咸宁市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156421300,
        "name": "随州市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156422800,
        "name": "恩施土家族苗族自治州",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156429000,
        "name": "省直辖县级行政区划",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430000,
        "name": "湖南省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430100,
        "name": "长沙市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430200,
        "name": "株洲市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430300,
        "name": "湘潭市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430400,
        "name": "衡阳市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430500,
        "name": "邵阳市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430600,
        "name": "岳阳市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430700,
        "name": "常德市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430800,
        "name": "张家界市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156430900,
        "name": "益阳市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156431000,
        "name": "郴州市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156431100,
        "name": "永州市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156431200,
        "name": "怀化市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156431300,
        "name": "娄底市",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156433100,
        "name": "湘西土家族苗族自治州",
        "parent_id": 1156430000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440000,
        "name": "广东省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440100,
        "name": "广州市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440200,
        "name": "韶关市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440300,
        "name": "深圳市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440400,
        "name": "珠海市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440500,
        "name": "汕头市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440600,
        "name": "佛山市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440700,
        "name": "江门市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440800,
        "name": "湛江市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440900,
        "name": "茂名市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441200,
        "name": "肇庆市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441300,
        "name": "惠州市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441400,
        "name": "梅州市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441500,
        "name": "汕尾市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441600,
        "name": "河源市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441700,
        "name": "阳江市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441800,
        "name": "清远市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156441900,
        "name": "东莞市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156442000,
        "name": "中山市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156445100,
        "name": "潮州市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156445200,
        "name": "揭阳市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156445300,
        "name": "云浮市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450000,
        "name": "广西壮族自治区",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450100,
        "name": "南宁市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450200,
        "name": "柳州市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450300,
        "name": "桂林市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450400,
        "name": "梧州市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450500,
        "name": "北海市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450600,
        "name": "防城港市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450700,
        "name": "钦州市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450800,
        "name": "贵港市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156450900,
        "name": "玉林市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156451000,
        "name": "百色市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156451100,
        "name": "贺州市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156451200,
        "name": "河池市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156451300,
        "name": "来宾市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156451400,
        "name": "崇左市",
        "parent_id": 1156450000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156460000,
        "name": "海南省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156460100,
        "name": "海口市",
        "parent_id": 1156460000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156460200,
        "name": "三亚市",
        "parent_id": 1156460000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156469000,
        "name": "省直辖县级行政区划",
        "parent_id": 1156460000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156500000,
        "name": "重庆市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510000,
        "name": "四川省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510100,
        "name": "成都市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510300,
        "name": "自贡市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510400,
        "name": "攀枝花市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510500,
        "name": "泸州市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510600,
        "name": "德阳市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510700,
        "name": "绵阳市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510800,
        "name": "广元市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510900,
        "name": "遂宁市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511000,
        "name": "内江市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511100,
        "name": "乐山市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511300,
        "name": "南充市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511400,
        "name": "眉山市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511500,
        "name": "宜宾市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511600,
        "name": "广安市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511700,
        "name": "达州市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511800,
        "name": "雅安市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156511900,
        "name": "巴中市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156512000,
        "name": "资阳市",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156513200,
        "name": "阿坝藏族羌族自治州",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156513300,
        "name": "甘孜藏族自治州",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156513400,
        "name": "凉山彝族自治州",
        "parent_id": 1156510000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520000,
        "name": "贵州省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520100,
        "name": "贵阳市",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520200,
        "name": "六盘水市",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520300,
        "name": "遵义市",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520400,
        "name": "安顺市",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520500,
        "name": "毕节市",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156520600,
        "name": "铜仁市",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156522300,
        "name": "黔西南布依族苗族自治州",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156522600,
        "name": "黔东南苗族侗族自治州",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156522700,
        "name": "黔南布依族苗族自治州",
        "parent_id": 1156520000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530000,
        "name": "云南省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530100,
        "name": "昆明市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530300,
        "name": "曲靖市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530400,
        "name": "玉溪市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530500,
        "name": "保山市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530600,
        "name": "昭通市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530700,
        "name": "丽江市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530800,
        "name": "普洱市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156530900,
        "name": "临沧市",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156532300,
        "name": "楚雄彝族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156532500,
        "name": "红河哈尼族彝族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156532600,
        "name": "文山壮族苗族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156532800,
        "name": "西双版纳傣族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156532900,
        "name": "大理白族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156533100,
        "name": "德宏傣族景颇族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156533300,
        "name": "怒江傈僳族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156533400,
        "name": "迪庆藏族自治州",
        "parent_id": 1156530000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156540000,
        "name": "西藏自治区",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156540100,
        "name": "拉萨市",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156540200,
        "name": "日喀则市",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156542100,
        "name": "昌都地区",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156542200,
        "name": "山南地区",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156542400,
        "name": "那曲地区",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156542500,
        "name": "阿里地区",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156542600,
        "name": "林芝地区",
        "parent_id": 1156540000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610000,
        "name": "陕西省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610100,
        "name": "西安市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610200,
        "name": "铜川市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610300,
        "name": "宝鸡市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610400,
        "name": "咸阳市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610500,
        "name": "渭南市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610600,
        "name": "延安市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610700,
        "name": "汉中市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610800,
        "name": "榆林市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156610900,
        "name": "安康市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156611000,
        "name": "商洛市",
        "parent_id": 1156610000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620000,
        "name": "甘肃省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620100,
        "name": "兰州市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620200,
        "name": "嘉峪关市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620300,
        "name": "金昌市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620400,
        "name": "白银市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620500,
        "name": "天水市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620600,
        "name": "武威市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620700,
        "name": "张掖市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620800,
        "name": "平凉市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156620900,
        "name": "酒泉市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156621000,
        "name": "庆阳市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156621100,
        "name": "定西市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156621200,
        "name": "陇南市",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156622900,
        "name": "临夏回族自治州",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156623000,
        "name": "甘南藏族自治州",
        "parent_id": 1156620000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156630000,
        "name": "青海省",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156630100,
        "name": "西宁市",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156630200,
        "name": "海东市",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156632200,
        "name": "海北藏族自治州",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156632300,
        "name": "黄南藏族自治州",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156632500,
        "name": "海南藏族自治州",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156632600,
        "name": "果洛藏族自治州",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156632700,
        "name": "玉树藏族自治州",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156632800,
        "name": "海西蒙古族藏族自治州",
        "parent_id": 1156630000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156640000,
        "name": "宁夏回族自治区",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156640100,
        "name": "银川市",
        "parent_id": 1156640000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156640200,
        "name": "石嘴山市",
        "parent_id": 1156640000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156640300,
        "name": "吴忠市",
        "parent_id": 1156640000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156640400,
        "name": "固原市",
        "parent_id": 1156640000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156640500,
        "name": "中卫市",
        "parent_id": 1156640000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156650000,
        "name": "新疆维吾尔自治区",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156650100,
        "name": "乌鲁木齐市",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156650200,
        "name": "克拉玛依市",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156652100,
        "name": "吐鲁番地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156652200,
        "name": "哈密地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156652300,
        "name": "昌吉回族自治州",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156652700,
        "name": "博尔塔拉蒙古自治州",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156652800,
        "name": "巴音郭楞蒙古自治州",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156652900,
        "name": "阿克苏地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156653000,
        "name": "克孜勒苏柯尔克孜自治州",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156653100,
        "name": "喀什地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156653200,
        "name": "和田地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156654000,
        "name": "伊犁哈萨克自治州",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156654200,
        "name": "塔城地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156654300,
        "name": "阿勒泰地区",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156659000,
        "name": "自治区直辖县级行政区划",
        "parent_id": 1156650000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1158000000,
        "id": 1158000000,
        "name": "台湾",
        "parent_id": 1158000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1162000000,
        "id": 1162000000,
        "name": "圣诞岛",
        "parent_id": 1162000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1166000000,
        "id": 1166000000,
        "name": "科科斯群岛",
        "parent_id": 1166000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1170000000,
        "id": 1170000000,
        "name": "哥伦比亚",
        "parent_id": 1170000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1174000000,
        "id": 1174000000,
        "name": "科摩罗",
        "parent_id": 1174000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1175000000,
        "id": 1175000000,
        "name": "马约特",
        "parent_id": 1175000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1178000000,
        "id": 1178000000,
        "name": "刚果（布）",
        "parent_id": 1178000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1180000000,
        "id": 1180000000,
        "name": "刚果（金）",
        "parent_id": 1180000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1184000000,
        "id": 1184000000,
        "name": "库克群岛",
        "parent_id": 1184000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1188000000,
        "id": 1188000000,
        "name": "哥斯达黎加",
        "parent_id": 1188000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1191000000,
        "id": 1191000000,
        "name": "克罗地亚",
        "parent_id": 1191000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1192000000,
        "id": 1192000000,
        "name": "古巴",
        "parent_id": 1192000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1196000000,
        "id": 1196000000,
        "name": "塞浦路斯",
        "parent_id": 1196000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1203000000,
        "id": 1203000000,
        "name": "捷克",
        "parent_id": 1203000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1204000000,
        "id": 1204000000,
        "name": "贝宁",
        "parent_id": 1204000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1208000000,
        "id": 1208000000,
        "name": "丹麦",
        "parent_id": 1208000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1212000000,
        "id": 1212000000,
        "name": "多米尼克",
        "parent_id": 1212000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1214000000,
        "id": 1214000000,
        "name": "多米尼加",
        "parent_id": 1214000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1218000000,
        "id": 1218000000,
        "name": "厄瓜多尔",
        "parent_id": 1218000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1222000000,
        "id": 1222000000,
        "name": "萨尔瓦多",
        "parent_id": 1222000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1226000000,
        "id": 1226000000,
        "name": "赤道几内亚",
        "parent_id": 1226000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1231000000,
        "id": 1231000000,
        "name": "埃塞俄比亚",
        "parent_id": 1231000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1232000000,
        "id": 1232000000,
        "name": "厄立特里亚",
        "parent_id": 1232000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1233000000,
        "id": 1233000000,
        "name": "爱沙尼亚",
        "parent_id": 1233000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1234000000,
        "id": 1234000000,
        "name": "法罗群岛",
        "parent_id": 1234000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1238000000,
        "id": 1238000000,
        "name": "马尔维纳斯群岛（福克兰）",
        "parent_id": 1238000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1239000000,
        "id": 1239000000,
        "name": "南乔治亚岛和南桑威奇群岛",
        "parent_id": 1239000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1242000000,
        "id": 1242000000,
        "name": "斐济群岛",
        "parent_id": 1242000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1246000000,
        "id": 1246000000,
        "name": "芬兰",
        "parent_id": 1246000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1248000000,
        "id": 1248000000,
        "name": "奥兰群岛",
        "parent_id": 1248000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1250000000,
        "id": 1250000000,
        "name": "法国",
        "parent_id": 1250000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1254000000,
        "id": 1254000000,
        "name": "法属圭亚那",
        "parent_id": 1254000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1258000000,
        "id": 1258000000,
        "name": "法属波利尼西亚",
        "parent_id": 1258000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1260000000,
        "id": 1260000000,
        "name": "法属南部领地",
        "parent_id": 1260000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1262000000,
        "id": 1262000000,
        "name": "吉布提",
        "parent_id": 1262000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1266000000,
        "id": 1266000000,
        "name": "加蓬",
        "parent_id": 1266000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1268000000,
        "id": 1268000000,
        "name": "格鲁吉亚",
        "parent_id": 1268000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1270000000,
        "id": 1270000000,
        "name": "冈比亚",
        "parent_id": 1270000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1275000000,
        "id": 1275000000,
        "name": "巴勒斯坦",
        "parent_id": 1275000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1276000000,
        "id": 1276000000,
        "name": "德国",
        "parent_id": 1276000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1288000000,
        "id": 1288000000,
        "name": "加纳",
        "parent_id": 1288000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1292000000,
        "id": 1292000000,
        "name": "直布罗陀",
        "parent_id": 1292000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1296000000,
        "id": 1296000000,
        "name": "基里巴斯",
        "parent_id": 1296000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1300000000,
        "id": 1300000000,
        "name": "希腊",
        "parent_id": 1300000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1304000000,
        "id": 1304000000,
        "name": "格陵兰",
        "parent_id": 1304000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1308000000,
        "id": 1308000000,
        "name": "格林纳达",
        "parent_id": 1308000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1312000000,
        "id": 1312000000,
        "name": "瓜德罗普",
        "parent_id": 1312000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1316000000,
        "id": 1316000000,
        "name": "关岛",
        "parent_id": 1316000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1320000000,
        "id": 1320000000,
        "name": "危地马拉",
        "parent_id": 1320000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1324000000,
        "id": 1324000000,
        "name": "几内亚",
        "parent_id": 1324000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1328000000,
        "id": 1328000000,
        "name": "圭亚那",
        "parent_id": 1328000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1332000000,
        "id": 1332000000,
        "name": "海地",
        "parent_id": 1332000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1334000000,
        "id": 1334000000,
        "name": "赫德岛和麦克唐纳群岛",
        "parent_id": 1334000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1336000000,
        "id": 1336000000,
        "name": "梵蒂冈",
        "parent_id": 1336000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1340000000,
        "id": 1340000000,
        "name": "洪都拉斯",
        "parent_id": 1340000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1344000000,
        "id": 1344000000,
        "name": "香港",
        "parent_id": 1344000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1348000000,
        "id": 1348000000,
        "name": "匈牙利",
        "parent_id": 1348000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1352000000,
        "id": 1352000000,
        "name": "冰岛",
        "parent_id": 1352000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1356000000,
        "id": 1356000000,
        "name": "印度",
        "parent_id": 1356000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1360000000,
        "id": 1360000000,
        "name": "印尼",
        "parent_id": 1360000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1364000000,
        "id": 1364000000,
        "name": "伊朗",
        "parent_id": 1364000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1368000000,
        "id": 1368000000,
        "name": "伊拉克",
        "parent_id": 1368000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1372000000,
        "id": 1372000000,
        "name": "爱尔兰",
        "parent_id": 1372000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1376000000,
        "id": 1376000000,
        "name": "以色列",
        "parent_id": 1376000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1380000000,
        "id": 1380000000,
        "name": "意大利",
        "parent_id": 1380000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1384000000,
        "id": 1384000000,
        "name": "科特迪瓦",
        "parent_id": 1384000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1388000000,
        "id": 1388000000,
        "name": "牙买加",
        "parent_id": 1388000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1392000000,
        "id": 1392000000,
        "name": "日本",
        "parent_id": 1392000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1398000000,
        "id": 1398000000,
        "name": "哈萨克斯坦",
        "parent_id": 1398000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1400000000,
        "id": 1400000000,
        "name": "约旦",
        "parent_id": 1400000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1404000000,
        "id": 1404000000,
        "name": "肯尼亚",
        "parent_id": 1404000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1408000000,
        "id": 1408000000,
        "name": "朝鲜",
        "parent_id": 1408000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1410000000,
        "id": 1410000000,
        "name": "韩国",
        "parent_id": 1410000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1414000000,
        "id": 1414000000,
        "name": "科威特",
        "parent_id": 1414000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1417000000,
        "id": 1417000000,
        "name": "吉尔吉斯斯坦",
        "parent_id": 1417000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1418000000,
        "id": 1418000000,
        "name": "老挝",
        "parent_id": 1418000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1422000000,
        "id": 1422000000,
        "name": "黎巴嫩",
        "parent_id": 1422000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1426000000,
        "id": 1426000000,
        "name": "莱索托",
        "parent_id": 1426000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1428000000,
        "id": 1428000000,
        "name": "拉脱维亚",
        "parent_id": 1428000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1430000000,
        "id": 1430000000,
        "name": "利比里亚",
        "parent_id": 1430000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1434000000,
        "id": 1434000000,
        "name": "利比亚",
        "parent_id": 1434000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1438000000,
        "id": 1438000000,
        "name": "列支敦士登",
        "parent_id": 1438000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1440000000,
        "id": 1440000000,
        "name": "立陶宛",
        "parent_id": 1440000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1442000000,
        "id": 1442000000,
        "name": "卢森堡",
        "parent_id": 1442000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1446000000,
        "id": 1446000000,
        "name": "澳门",
        "parent_id": 1446000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1450000000,
        "id": 1450000000,
        "name": "马达加斯加",
        "parent_id": 1450000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1454000000,
        "id": 1454000000,
        "name": "马拉维",
        "parent_id": 1454000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1458000000,
        "id": 1458000000,
        "name": "马来西亚",
        "parent_id": 1458000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1462000000,
        "id": 1462000000,
        "name": "马尔代夫",
        "parent_id": 1462000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1466000000,
        "id": 1466000000,
        "name": "马里",
        "parent_id": 1466000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1470000000,
        "id": 1470000000,
        "name": "马耳他",
        "parent_id": 1470000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1474000000,
        "id": 1474000000,
        "name": "马提尼克",
        "parent_id": 1474000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1478000000,
        "id": 1478000000,
        "name": "毛里塔尼亚",
        "parent_id": 1478000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1480000000,
        "id": 1480000000,
        "name": "毛里求斯",
        "parent_id": 1480000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1484000000,
        "id": 1484000000,
        "name": "墨西哥",
        "parent_id": 1484000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1492000000,
        "id": 1492000000,
        "name": "摩纳哥",
        "parent_id": 1492000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1496000000,
        "id": 1496000000,
        "name": "蒙古国；蒙古",
        "parent_id": 1496000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1498000000,
        "id": 1498000000,
        "name": "摩尔多瓦",
        "parent_id": 1498000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1499000000,
        "id": 1499000000,
        "name": "黑山",
        "parent_id": 1499000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1500000000,
        "id": 1500000000,
        "name": "蒙塞拉特岛",
        "parent_id": 1500000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1504000000,
        "id": 1504000000,
        "name": "摩洛哥",
        "parent_id": 1504000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1508000000,
        "id": 1508000000,
        "name": "莫桑比克",
        "parent_id": 1508000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1512000000,
        "id": 1512000000,
        "name": "阿曼",
        "parent_id": 1512000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1516000000,
        "id": 1516000000,
        "name": "纳米比亚",
        "parent_id": 1516000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1520000000,
        "id": 1520000000,
        "name": "瑙鲁",
        "parent_id": 1520000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1524000000,
        "id": 1524000000,
        "name": "尼泊尔",
        "parent_id": 1524000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1528000000,
        "id": 1528000000,
        "name": "荷兰",
        "parent_id": 1528000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1533000000,
        "id": 1533000000,
        "name": "阿鲁巴",
        "parent_id": 1533000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1535000000,
        "id": 1535000000,
        "name": "荷兰加勒比区",
        "parent_id": 1535000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1540000000,
        "id": 1540000000,
        "name": "新喀里多尼亚",
        "parent_id": 1540000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1548000000,
        "id": 1548000000,
        "name": "瓦努阿图",
        "parent_id": 1548000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1554000000,
        "id": 1554000000,
        "name": "新西兰",
        "parent_id": 1554000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1558000000,
        "id": 1558000000,
        "name": "尼加拉瓜",
        "parent_id": 1558000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1562000000,
        "id": 1562000000,
        "name": "尼日尔",
        "parent_id": 1562000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1566000000,
        "id": 1566000000,
        "name": "尼日利亚",
        "parent_id": 1566000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1570000000,
        "id": 1570000000,
        "name": "纽埃",
        "parent_id": 1570000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1574000000,
        "id": 1574000000,
        "name": "诺福克岛",
        "parent_id": 1574000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1578000000,
        "id": 1578000000,
        "name": "挪威",
        "parent_id": 1578000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1580000000,
        "id": 1580000000,
        "name": "北马里亚纳群岛",
        "parent_id": 1580000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1581000000,
        "id": 1581000000,
        "name": "美国本土外小岛屿",
        "parent_id": 1581000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1583000000,
        "id": 1583000000,
        "name": "密克罗尼西亚联邦",
        "parent_id": 1583000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1584000000,
        "id": 1584000000,
        "name": "马绍尔群岛",
        "parent_id": 1584000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1585000000,
        "id": 1585000000,
        "name": "帕劳",
        "parent_id": 1585000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1586000000,
        "id": 1586000000,
        "name": "巴基斯坦",
        "parent_id": 1586000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1591000000,
        "id": 1591000000,
        "name": "巴拿马",
        "parent_id": 1591000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1598000000,
        "id": 1598000000,
        "name": "巴布亚新几内亚",
        "parent_id": 1598000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1600000000,
        "id": 1600000000,
        "name": "巴拉圭",
        "parent_id": 1600000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1604000000,
        "id": 1604000000,
        "name": "秘鲁",
        "parent_id": 1604000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1608000000,
        "id": 1608000000,
        "name": "菲律宾",
        "parent_id": 1608000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1612000000,
        "id": 1612000000,
        "name": "皮特凯恩群岛",
        "parent_id": 1612000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1616000000,
        "id": 1616000000,
        "name": "波兰",
        "parent_id": 1616000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1620000000,
        "id": 1620000000,
        "name": "葡萄牙",
        "parent_id": 1620000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1624000000,
        "id": 1624000000,
        "name": "几内亚比绍",
        "parent_id": 1624000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1626000000,
        "id": 1626000000,
        "name": "东帝汶",
        "parent_id": 1626000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1630000000,
        "id": 1630000000,
        "name": "波多黎各",
        "parent_id": 1630000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1634000000,
        "id": 1634000000,
        "name": "卡塔尔",
        "parent_id": 1634000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1638000000,
        "id": 1638000000,
        "name": "留尼汪",
        "parent_id": 1638000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1642000000,
        "id": 1642000000,
        "name": "罗马尼亚",
        "parent_id": 1642000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1643000000,
        "id": 1643000000,
        "name": "俄罗斯",
        "parent_id": 1643000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1646000000,
        "id": 1646000000,
        "name": "卢旺达",
        "parent_id": 1646000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1652000000,
        "id": 1652000000,
        "name": "圣巴泰勒米岛",
        "parent_id": 1652000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1654000000,
        "id": 1654000000,
        "name": "圣赫勒拿",
        "parent_id": 1654000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1659000000,
        "id": 1659000000,
        "name": "圣基茨和尼维斯",
        "parent_id": 1659000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1660000000,
        "id": 1660000000,
        "name": "安圭拉",
        "parent_id": 1660000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1662000000,
        "id": 1662000000,
        "name": "圣卢西亚",
        "parent_id": 1662000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1663000000,
        "id": 1663000000,
        "name": "法属圣马丁",
        "parent_id": 1663000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1666000000,
        "id": 1666000000,
        "name": "圣皮埃尔和密克隆",
        "parent_id": 1666000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1670000000,
        "id": 1670000000,
        "name": "圣文森特和格林纳丁斯",
        "parent_id": 1670000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1674000000,
        "id": 1674000000,
        "name": "圣马力诺",
        "parent_id": 1674000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1678000000,
        "id": 1678000000,
        "name": "圣多美和普林西比",
        "parent_id": 1678000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1682000000,
        "id": 1682000000,
        "name": "沙特阿拉伯",
        "parent_id": 1682000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1686000000,
        "id": 1686000000,
        "name": "塞内加尔",
        "parent_id": 1686000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1688000000,
        "id": 1688000000,
        "name": "塞尔维亚",
        "parent_id": 1688000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1690000000,
        "id": 1690000000,
        "name": "塞舌尔",
        "parent_id": 1690000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1694000000,
        "id": 1694000000,
        "name": "塞拉利昂",
        "parent_id": 1694000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1702000000,
        "id": 1702000000,
        "name": "新加坡",
        "parent_id": 1702000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1703000000,
        "id": 1703000000,
        "name": "斯洛伐克",
        "parent_id": 1703000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1704000000,
        "id": 1704000000,
        "name": "越南",
        "parent_id": 1704000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1705000000,
        "id": 1705000000,
        "name": "斯洛文尼亚",
        "parent_id": 1705000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1706000000,
        "id": 1706000000,
        "name": "索马里",
        "parent_id": 1706000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1710000000,
        "id": 1710000000,
        "name": "南非",
        "parent_id": 1710000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1716000000,
        "id": 1716000000,
        "name": "津巴布韦",
        "parent_id": 1716000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1724000000,
        "id": 1724000000,
        "name": "西班牙",
        "parent_id": 1724000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1728000000,
        "id": 1728000000,
        "name": "南苏丹",
        "parent_id": 1728000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1729000000,
        "id": 1729000000,
        "name": "苏丹",
        "parent_id": 1729000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1732000000,
        "id": 1732000000,
        "name": "西撒哈拉",
        "parent_id": 1732000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1740000000,
        "id": 1740000000,
        "name": "苏里南",
        "parent_id": 1740000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1744000000,
        "id": 1744000000,
        "name": "斯瓦尔巴群岛和扬马延岛",
        "parent_id": 1744000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1748000000,
        "id": 1748000000,
        "name": "斯威士兰",
        "parent_id": 1748000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1752000000,
        "id": 1752000000,
        "name": "瑞典",
        "parent_id": 1752000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1756000000,
        "id": 1756000000,
        "name": "瑞士",
        "parent_id": 1756000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1760000000,
        "id": 1760000000,
        "name": "叙利亚",
        "parent_id": 1760000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1762000000,
        "id": 1762000000,
        "name": "塔吉克斯坦",
        "parent_id": 1762000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1764000000,
        "id": 1764000000,
        "name": "泰国",
        "parent_id": 1764000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1768000000,
        "id": 1768000000,
        "name": "多哥",
        "parent_id": 1768000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1772000000,
        "id": 1772000000,
        "name": "托克劳",
        "parent_id": 1772000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1776000000,
        "id": 1776000000,
        "name": "汤加",
        "parent_id": 1776000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1780000000,
        "id": 1780000000,
        "name": "特立尼达和多巴哥",
        "parent_id": 1780000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1784000000,
        "id": 1784000000,
        "name": "阿联酋",
        "parent_id": 1784000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1788000000,
        "id": 1788000000,
        "name": "突尼斯",
        "parent_id": 1788000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1792000000,
        "id": 1792000000,
        "name": "土耳其",
        "parent_id": 1792000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1795000000,
        "id": 1795000000,
        "name": "土库曼斯坦",
        "parent_id": 1795000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1796000000,
        "id": 1796000000,
        "name": "特克斯和凯科斯群岛",
        "parent_id": 1796000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1798000000,
        "id": 1798000000,
        "name": "图瓦卢",
        "parent_id": 1798000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1800000000,
        "id": 1800000000,
        "name": "乌干达",
        "parent_id": 1800000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1804000000,
        "id": 1804000000,
        "name": "乌克兰",
        "parent_id": 1804000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1807000000,
        "id": 1807000000,
        "name": "马其顿",
        "parent_id": 1807000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1818000000,
        "id": 1818000000,
        "name": "埃及",
        "parent_id": 1818000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1826000000,
        "id": 1826000000,
        "name": "英国",
        "parent_id": 1826000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1831000000,
        "id": 1831000000,
        "name": "根西岛",
        "parent_id": 1831000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1832000000,
        "id": 1832000000,
        "name": "泽西岛",
        "parent_id": 1832000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1833000000,
        "id": 1833000000,
        "name": "马恩岛",
        "parent_id": 1833000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1834000000,
        "id": 1834000000,
        "name": "坦桑尼亚",
        "parent_id": 1834000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1840000000,
        "id": 1840000000,
        "name": "美国",
        "parent_id": 1840000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1850000000,
        "id": 1850000000,
        "name": "美属维尔京群岛",
        "parent_id": 1850000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1854000000,
        "id": 1854000000,
        "name": "布基纳法索",
        "parent_id": 1854000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1858000000,
        "id": 1858000000,
        "name": "乌拉圭",
        "parent_id": 1858000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1860000000,
        "id": 1860000000,
        "name": "乌兹别克斯坦",
        "parent_id": 1860000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1862000000,
        "id": 1862000000,
        "name": "委内瑞拉",
        "parent_id": 1862000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1876000000,
        "id": 1876000000,
        "name": "瓦利斯和富图纳",
        "parent_id": 1876000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1882000000,
        "id": 1882000000,
        "name": "萨摩亚",
        "parent_id": 1882000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1887000000,
        "id": 1887000000,
        "name": "也门",
        "parent_id": 1887000000,
        "type": 0
    },
    {
        "available": 1,
        "country_id": 1894000000,
        "id": 1894000000,
        "name": "赞比亚",
        "parent_id": 1894000000,
        "type": 0
    }
];
var ka_citys = [
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156110000,
        "name": "北京市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210100,
        "name": "沈阳市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210200,
        "name": "大连市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156310000,
        "name": "上海市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320100,
        "name": "南京市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330100,
        "name": "杭州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370200,
        "name": "青岛市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420100,
        "name": "武汉市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440100,
        "name": "广州市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440300,
        "name": "深圳市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156500000,
        "name": "重庆市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510100,
        "name": "成都市",
        "parent_id": 1156510000,
        "type": 2
    }
];

app.service('areaService', ['$http', '$q', 'appTools', 'conf', function($http, $q, appTools, conf) {
    this.getAreas = function() {
        // return $q(function (resolve,reject) {
        //     resolve(areas);
        // });
        return areas;
    };
    this.getKaCitys = function () {
        return ka_citys;
    }
}]);