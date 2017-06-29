/**
 * Created by leiyao on 16/4/7.
 */
'use strict';
function BaseModel() {
    this.Members = {};
}

BaseModel.prototype.init = function (obj) {
    if (obj && typeof obj == 'object') {
        for (var key in this.Members) {
            if (typeof obj[key] != 'undefined') {
                if (typeof this.Members[key].default != 'undefined') {
                    this[key] = obj[key] || this.Members[key].default;
                } else {
                    this[key] = obj[key];
                }
            } else {
                this[key] = this.Members[key].default || "";
            }
        }
    } else if (arguments.length > 1) {
        this.initWithData.apply(this, arguments);
        /*this.name = arguments[0];
         this.platform = arguments[1];
         this.description = arguments[2];
         this.adzone = arguments[3] || this.Members['adzone'].default;
         this.components = arguments[4] || this.Members['components'].default;
         this.creator = arguments[5];*/
    }
};

/**
 * 用于给前端吐简单数据
 * @returns {BaseModel}
 */
BaseModel.prototype.ado = function () {
    var ado = this;
    delete ado.Members;
    return ado;
};

//BaseModel.log = function(table_name, target_id, target_state, content, type, creator_id){
//var handle_log = new HandleLog(table_name,target_id,target_state,content,type,creator);
//handle_log.insert();
//};

BaseModel.promise = function () {

};


module.exports = BaseModel;