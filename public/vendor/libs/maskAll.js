(function(){

	var mask={
		'config':{
			'id':'flashContent',
			'wrapflash':'wrapflash',
			'settings':{},
			'clickfun':false,
			'dialogWidth':16,
			'dialogHeight':16,
			'maskClickfun':false,
			'imgurl':'img/circle2.png',
			'buttonHeight':40        //视频按钮高度设置

		},
		'privateParam':{
			'actualHeight':0,
			'actualWidth':0,
			'blankHeight':0,
			'blankWidth':0
		},
		'init':function(option){
			this.extend(option);
			this.creatHTML();
			this.initDom();
			this.bind();
		},
		creatHTML:function(){
			var wrapflash=document.getElementById(this.config.wrapflash);

			var maskold=document.getElementById("mask");
			if(!maskold){
				var mask = document.createElement('div');
				mask.className="mask";
				mask.setAttribute("id","mask");
				mask.style.width=wrapflash.offsetWidth+"px";
				mask.style.height=wrapflash.offsetHeight-this.config.buttonHeight+"px";
				wrapflash.appendChild(mask);
			}
		},initDom:function(){
			var self=this;
			var opt=self.config;
			var wrapflash = document.getElementById("wrapflash");
			var settings1=this.config.settings;
         	var setW=settings1["width"],setH=settings1["height"],diaW=wrapflash.offsetWidth,diaH=wrapflash.offsetHeight;
        	var diaofL=wrapflash.offsetLeft,diaoft=wrapflash.offsetTop;
             if((diaH/diaW)>(setH/setW)){
                self.privateParam.actualHeight=(diaW*setH)/setW;
                self.privateParam.actualWidth=diaW;
                self.privateParam.blankHeight=(diaH-self.privateParam.actualHeight)/2;
                self.privateParam.blankWidth=0;
             }else{
                self.privateParam.actualHeight=diaH;
                self.privateParam.actualWidth=(diaH*setW)/setH;
                self.privateParam.blankWidth=(diaW-self.privateParam.actualWidth)/2;
                self.privateParam.blankHeight=0;
             }
		},

		warp:function (dom) { //用于做包裹 目前没有用
			var tmp = document.createElement('div');
	        tmp.className="wrapflash";
	        tmp.setAttribute("id", "wrapflash");
            var _el = dom.cloneNode(true);
            tmp.innerHTML=this.config.template;
            tmp.appendChild(_el);
            document.body.replaceChild(tmp, dom);
		},extend:function (option) { //继承
			var self=this;
			for (var i in option) {
				this.config[i]=option[i];
			}
		},bind:function () {	 //事件绑定并提供接口
			var self=this;
			var opt=self.config;
			var settings1 =opt.settings;
          	var maskb= document.getElementById("mask");
			maskb.onclick=function (event) {
				var subself=this;
				var dragsaold= document.getElementById("dragsa");
				if(dragsaold && !confirm('请确定是不是要重新打点?','确定','取消')){
					return ;
				}

				
				if(dragsaold){
					dragsaold.parentNode.removeChild(dragsaold);
				}

				var x=event.clientX;
				var y=event.clientY;
				var wrapflash = document.getElementById("wrapflash");
				var diaoft= offsetNewTop(wrapflash) - document.getElementsByTagName('body')[0].scrollTop; ;
				var diaofL = offsetNew(wrapflash);

				var appContentElement = document.getElementById('app-content');
				var marginOfAppContent = appContentElement.style.marginLeft;

				/*
				用于处理offsetParent不为body时的offsetLeft取值问题
				 */
				function offsetNew(wrapflashNew){
					if(wrapflashNew.offsetParent.tagName.toLowerCase()=="body"){
						return wrapflashNew.offsetLeft;
					}else{
						return wrapflashNew.offsetLeft+offsetNew(wrapflashNew.offsetParent);
		
					}
				}
				/**
				 * 用于处理offsetParent不为body时的offsetTop取值问题
				 */
				function offsetNewTop(wrapflashNew){
					if(wrapflashNew.offsetParent.tagName.toLowerCase()=="body"){
						return wrapflashNew.offsetTop;
					}else{
						return wrapflashNew.offsetTop+offsetNewTop(wrapflashNew.offsetParent);
		
					}
				}
	            var xleft=x-diaofL;
	            var ytop=y-diaoft;
	            if(xleft-(opt.dialogWidth)<=self.privateParam.blankWidth||xleft+(opt.dialogWidth)+self.privateParam.blankWidth>wrapflash.clientWidth){
	            	return false;
	            }
	            if(ytop-(opt.dialogHeight)<=self.privateParam.blankHeight||ytop+(opt.dialogHeight)+self.privateParam.blankHeight>wrapflash.clientHeight-opt.buttonHeight){
	            	return false;
	            }
				if(Object.prototype.toString.call(opt.maskClickfun)=='[object Function]'){
						opt.maskClickfun();
					}
		        var imgDiv=document.createElement('div');
				var imgs = document.createElement('img');
				imgDiv.style.position='absolute';
				imgDiv.style.top=y-diaoft-(opt.dialogHeight)+"px";
				imgDiv.style.left=x-diaofL-(opt.dialogWidth)+"px";
				imgs.style.width='32px';
				imgs.style.height='32px';
				imgDiv.className="drag borderdrag";
				imgDiv.id="dragsa";
				imgs.src=opt.imgurl;

				imgDiv.appendChild(imgs);
				wrapflash.appendChild(imgDiv);
				var data2=self.getDotLocation(xleft-self.config.dialogWidth,ytop-self.config.dialogHeight);

				if(Object.prototype.toString.call(opt.clickfun)=='[object Function]'){
					opt.clickfun(data2);
				}
					//alert(self.privateParam.blankWidth+"#######"+self.privateParam.blankHeight+"^^^^"+self.config.buttonHeight)
				new Drag("dragsa","wrapflash",self.privateParam.blankWidth,self.privateParam.blankHeight,function (x,y) {
					var data=self.getDotLocation(x,y);
					if(Object.prototype.toString.call(opt.clickfun)=='[object Function]'){
						opt.clickfun(data);
					}
				},self.config.buttonHeight);
			}

		},getDotLocation:function (pageX,pageY) { //获取计算后的点击位置的百分比
				var self=this;
				var wrapflash = document.getElementById("wrapflash");
             	var diaW=wrapflash.offsetWidth,diaH=wrapflash.offsetHeight;
             	var bh,bw,sh,sw;
            	var diaofL=wrapflash.offsetLeft,diaoft=wrapflash.offsetTop;
	             sh=pageY-self.privateParam.blankHeight+self.config.dialogHeight; //解决中心取值问题减少   -diaoft
	             sw=pageX-self.privateParam.blankWidth+self.config.dialogWidth;  //解决中心取值问题减少   -diaofL
	             bh=sh/self.privateParam.actualHeight;
	             bw=sw/self.privateParam.actualWidth;
               var data={"leftDistance":sw,"topDistance":sh,"leftPercentage":(bw*100).toFixed(2),"topPercentage":(bh*100).toFixed(2),"showWidth":self.privateParam.actualWidth,"showHeight":self.privateParam.actualHeight}
               return data;
		},hasClass:function(obj,cls) {

			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));

		},addClass:function(obj,cls) {

			if (!this.hasClass(obj, cls)){
				obj.className += " " + cls;
			}

		},removeClass:function(obj,cls) {

		    if (this.hasClass(obj, cls)) {
		        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		        obj.className = obj.className.replace(reg, ' ');
		    }

		},siblingsNode:function(elm) {
			var self=this;
			var p = elm.parentNode.children;
			for(var i =0,pl= p.length;i<pl;i++) {
				if(p[i] !== elm) {
					self.removeClass(p[i],"selected");
					p[i].removeAttribute("id");
				}
			}
		},creatDrag:function(x,y) {

			var self=this;
			var opt=self.config;
			var settings1 =opt.settings;
			var setW=self.privateParam.actualWidth,setH=self.privateParam.actualHeight;
			var imgDiv=document.createElement('div');
			var imgs = document.createElement('img');
			imgDiv.style.position='absolute';
			imgDiv.style.top=setH*y+self.privateParam.blankHeight-opt.dialogHeight+"px";
			imgDiv.style.left=setW*x+self.privateParam.blankWidth-opt.dialogWidth+"px";
			imgs.style.width='32px';
			imgs.style.height='32px';
			imgDiv.className="drag borderdrag";
			imgDiv.id="dragsa";
			imgs.src=opt.imgurl;
			imgDiv.appendChild(imgs);
			wrapflash.appendChild(imgDiv);
			new Drag("dragsa","wrapflash",self.privateParam.blankWidth,self.privateParam.blankHeight,function (x,y) {
				var data=self.getDotLocation(x,y);
				if(Object.prototype.toString.call(opt.clickfun)=='[object Function]'){
					opt.clickfun(data);
				}
			},self.config.buttonHeight);

		}
	}
	window.mask=mask;

})()
