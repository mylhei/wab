function Drag(id,parentId,blankW,blankH,callback,buttonHeight) {
    this.blankW=blankW||0;
    this.blankH=blankH||0;
    this.buttonHeight=buttonHeight||0;
    this.div = document.getElementById(id);
    this.parentDiv = document.getElementById(parentId);
    if (this.div) {
        this.div.style.cursor = "move";
        this.div.style.position = "absolute";
    }
    this.disX = 0;
    this.disY = 0;
    var _this = this;
    this.div.onmousedown = function (evt) {
        _this.getDistance(evt);
        document.onmousemove = function (evt) {
            _this.setPosition(evt);
        }
        _this.div.onmouseup = function (evt) {

            if (typeof callback == "function") {
                
                callback(_this.div.offsetLeft,_this.div.offsetTop);
            }
            _this.clearEvent();
        }
        evt.preventDefault();
    }
}
Drag.prototype.getDistance = function (evt) {
    var oEvent = evt || event;
    this.disX = oEvent.clientX - this.div.offsetLeft;
    this.disY = oEvent.clientY - this.div.offsetTop;
}
Drag.prototype.setPosition = function (evt) {
    var oEvent = evt || event;
    var l = oEvent.clientX - this.disX;
    var t = oEvent.clientY - this.disY;
    if (l <= this.blankW) {
        l = this.blankW;
    }

    else if (l+this.blankW >= this.parentDiv.clientWidth - this.div.offsetWidth) {
        l = this.parentDiv.clientWidth  - this.div.offsetWidth-this.blankW;
    }
    if (t <= this.blankH) {
        t = this.blankH;
    }
    else if (t+this.blankH >= this.parentDiv.clientHeight - this.div.offsetHeight-this.buttonHeight) {
        t = this.parentDiv.clientHeight  - this.div.offsetHeight-this.blankH-this.buttonHeight;
    }
    this.div.style.left = l + "px";
    this.div.style.top = t + "px";
}
Drag.prototype.clearEvent = function () {
    this.div.onmouseup = null;
    document.onmousemove = null;
}
