// ==UserScript==
// @name        Bilibili Fixer - Perfect!
// @namespace   FireAway-剑仙乘仙剑
// @version     11.0
// @description 第二次重构啦~~希望第三版的BFP能够更好的服务大众哦~
// @require     http://cdn.staticfile.org/crypto-js/3.1.2/rollups/hmac-sha1.js
// @require     http://cdn.staticfile.org/crypto-js/3.1.2/components/enc-base64-min.js
// @include     *://*.bilibili.tv/*
// @include     *://*.bilibili.tv
// @include     *://*.bilibili.*
// @include     *://bilibili.*/*
// @include     *://www.iqiyi.com/*?newCid=*
// @include     *://comic.letv.com/*
// @include     *://static.loli.my/*
// @include     *//api.bilibili.com/*
// @exclude     *//secure.bilibili.tv/*
// @exclude     *//static-s.bilibili.tv/*
// @exclude     *//ssl.bilibili.tv/*
// @exclude     *//docs.bilibili.cn/*
// @copyright   FireAway~
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// ==/UserScript==

//以下开始就是正片了

//首先是一堆变量需要初始化~
var localStorageItems = {
	followList : "",
	isNotify : "",
	isHint : "",
	isToPlayer : "",
	noToPlayer : "",
	isFollowMaster : "",
	showPanel : "false",
	mainPanel : "",
	updateIn : "1",
	userHintBGI : ""
};


var aid, date, cid, vid, restxt, O_Player, selector, spid, aniIndex, page, spMode, totalHeight, scrolledHeight, screenHeight, availScrollHeight, sinaVid, title, extraInfo,
	mode = "full",
	checkingUpdate = false,
	num = 0,
	notStarted = true,
	loc = location,
	path = 'http://bilifixer.nmzh.net/BFP/',
	urltype = "download",
	videoPlay = "videoPlay1",
	version = "11.0",
	client = navigator.userAgent.toLowerCase(),
	isSecretGarden = /\/av1\//.exec(loc.pathname),
	isAiqiyi = (loc.origin == "http://www.iqiyi.com"),
	isLetv = (loc.origin == "http://comic.letv.com"),
	isAPI = /api/.exec(loc.origin),
	isVideo = /\/video\/av(\d+)(?:\/index_(\d+))?/.exec(loc.pathname),
	isCatalog = /\/video\//.test(loc.pathname) && !isVideo,
	isSpace = /space/.exec(loc.origin),
	thisDate = Date(),
	isSP = /sp\//.exec(loc.pathname),
	isHome = (loc.pathname == "/" || loc.pathname == "/index.html" || loc.pathname == "/index_old.html"),
	isBangumi1 = /bangumi.html/.exec(loc.pathname),
	isBangumiA = /bangumi-/.exec(loc.pathname),
	isBangumiB = /part-twoelement-1.html/.exec(loc.pathname),
	isBangumi2 = isBangumiA || isBangumiB;

var pos = isSecretGarden ? "secret" : isVideo ? "video" : isSP ? "sp" : isHome ? "home" : isBangumi1 ? "bangumi1" : isBangumi2 ? "bangumi2" : isLetv ? "letv" : isAPI ? "api" : isSpace ? "space" : isCatalog ? "catalog" : isAiqiyi ? "iqiyi" : "other";

//然后呢我们需要在哔哩加载完毕后才进行加载，所以要有一个判断，猴子的run-at并不能很好的判断页面是否加载完毕，所以我们需要自己加个保险
//之所以采用2种判断是为了兼容SB的IE浏览器
window.addEventListener('DOMContentLoaded', function() {
	BFP_Core.startOnce();
}, false);
if (document.readyState == "complete") {
	BFP_Core.startOnce();
}

document.body.innerHTML += '<div id="loading" style="position: fixed; width: 200px; height: 100px; top: 40%; margin: 0 auto; left: calc(50% - 100px); background-color: #00a0d8; "><div><div style="text-align: center; color: white; background: rgba(0, 0, 0, 0.28); height: 25px; line-height: 25px; ">BFP正在绝赞加载中~</div><div style="color: white; text-align: center; " id="content"><p>人生苦短~且等且待~</p><p><span style="display: none; ">Neko</span>你知道吗~</p><p>BFP的作者很帅而且单身哦~</p></div><p style="text-align: center; background: rgba(0, 0, 0, 0.28); color: white; bottom: 0px; position: absolute; width: 100%; height: 25px; line-height: 25px; ">好的 我知道了= =||</p></div></div>';

//启动完毕之后 就好了……

//////////////////////////////////////////////////////////////

//下面是具体的功能啦……
var BFP_Core = {
	setResTxt: function(newrt) {
		restxt = newrt;
	},
	getResTxt: function() {
		return restxt;
	},
	//正儿八经的原生态AJAX，照顾书签版用户的，不能跨域 真是残念= =
	BFP_xmlhttpRequest: function(details) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			var responseState = {
				responseXML: (xmlhttp.readyState == 4 ? xmlhttp.responseXML : ''),
				responseText: (xmlhttp.readyState == 4 ? xmlhttp.responseText : ''),
				readyState: xmlhttp.readyState,
				responseHeaders: (xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
				status: (xmlhttp.readyState == 4 ? xmlhttp.status : 0),
				statusText: (xmlhttp.readyState == 4 ? xmlhttp.statusText : '')
			};
			if (details.onreadystatechange) {
				details.onreadystatechange(responseState);
			}
			if (xmlhttp.readyState == 4) {
				if (details.onload && xmlhttp.status >= 200 && xmlhttp.status < 300) {
					details.onload(responseState);
				}
				if (details.onerror && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
					details.onerror(responseState);
				}
			}
		};
		try {
			xmlhttp.open(details.method, details.url);
		} catch (exception) {
			if (details.onerror) {
				details.onerror({
					responseXML: '',
					responseText: '',
					readyState: 4,
					responseHeaders: '',
					status: 403,
					statusText: 'Forbidden'
				});
			}
			return;
		}
		if (details.headers) {
			for (var prop in details.headers) {
				if(details.headers.hasOwnProperty(prop)){
					xmlhttp.setRequestHeader(prop, details.headers[prop]);
				}
			}
		}
		xmlhttp.send((typeof(details.data) != 'undefined') ? details.data : null);
	},
	//Default_Ajax_Function：默认的Ajax功能，根据启动模式选择油猴版本还是原生版本
	DAF: function(ajaxUrl, func) {
		if (mode == "full") {
			GM_xmlhttpRequest({
				method: "GET",
				url: ajaxUrl,
				onerror: function(response) {
					BFP_Core.log("如果可能，请告知我冒号后面的内容：" + response);
				},
				ontimeout: function(response){
					BFP_Core.log("请求超时 网速问题嘛～？");
				},
				onload: function(response) {
					BFP_Core.evalAjaxFun(response, func);
				}
			});
		} else {
			BFP_Core.BFP_xmlhttpRequest({
				method: "GET",
				url: ajaxUrl,
				onerror: function(response) {
					BFP_Core.log("如果可能，请告知我冒号后面的内容：" + response);
				},
				ontimeout: function(response){
					BFP_Core.log("请求超时 网速问题嘛～？");
				},
				onload: function(response) {
					BFP_Core.evalAjaxFun(response, func);
				}
			});
		}
	},
	//Ajax成功后执行功能
	evalAjaxFun: function(r, f) {
		if(r.finalUrl == "http://www.bilibili.com/video/av/"){
			// BFP_Core.toForceMode();
		}else if(r.finalUrl.indexOf("comic.letv.com") > -1){
			// BFP_Core.toForceMode();
		}else {
			if(r.status == 200) {
				BFP_Core.setResTxt(r.responseText);
				f();
			}else{
				BFP_Core.log(r);
			}
		}
	},
	// 增加JS和CSS引用
	addDependencies: function(){
		BFP_Core.addBFPCss();
		BFP_Core.addBFPJs();
	},
	addBFPCss: function(){
		var BFP_Style = BFP_Core.domCreator("link", "BFP_Style", true);
		BFP_Style.href = BFP_Core.toRandomURL(path + "universe.css");
		// BFP_Style.href = BFP_Core.toRandomURL("https://greasyfork.org/scripts/6230-bfp-css/code/BFP_css.user.js");
		BFP_Style.setAttribute("rel", "stylesheet");

		BFP_Core.domAppender(document.head, BFP_Style);
	},
	addBFPJs: function(){
		var BFP_Script = BFP_Core.domCreator("script", "BFP_Script");
		BFP_Script.src = BFP_Core.toRandomURL(path + "universe.js");
		// BFP_Script.src = BFP_Core.toRandomURL("https://greasyfork.org/scripts/6229-bfp-ini/code/BFP_ini.user.js");

		var sina_Script = BFP_Core.domCreator("script", "sina_Script");
		// sina_Script.src = "https://tjs.sjs.sinajs.cn/open/api/js/wb.js";

		var MD5_Script = BFP_Core.domCreator("script", "MD5_Script");
		// MD5_Script.src = "//static.hdslb.com/js/md5.js";

		var bilibili_Script = BFP_Core.domCreator("script", "bilibili_Script");
		// bilibili_Script.src = "//static.hdslb.com/js/page.arc.js";

		var CryptoJS_Script = BFP_Core.domCreator("script", "CryptoJS_Script");
		// CryptoJS_Script.src = "//bilifixer.nmzh.net/BFP/JS/hmac-sha1.js";

		BFP_Core.domAppender(document.head, BFP_Script, sina_Script, MD5_Script, CryptoJS_Script);
	},
	// 创造或拾取一个元素并且赋予ID
	// 如果设置了isForceNew则强制创造
	domCreator: function(type, id, isForceNew){
		if(isForceNew){
			BFP_Core.domRemover(id);
		}
		var dom = BFP_Core.domFinder(id) || document.createElement(type);
		dom.id = id;
		return dom;
	},
	// 查找元素
	// 支持模糊查询
	// 支持CSS选择器查询
	// 支持查找列表
	// 返回元素或者false
	// 因为使用JQuery返回永远都是object 有不够方便的地方
	domFinder: function(anything, useSelector, getArray){
		var dom;
		if(useSelector){
			if(getArray){
				dom = document.querySelectorAll(anything);
				if(dom.length === 0){
					dom = false;
				}
			}else{
				dom = document.querySelector(anything);
			}
			return dom;
		}else{
			var flag = anything.id || anything.className || anything.tagName || anything;
			dom = document.getElementById(flag) || document.getElementsByClassName(flag)[0] || document.getElementsByTagName(flag)[0] || false;
			if(getArray && anything.className){
				dom = document.getElementsByClassName(flag);
			}
			if(dom){
				return dom;
			}else{
				BFP_Core.domFinder(anything, true);
			}
		}
	},
	// 移除一个元素 模糊移除法
	domRemover: function(target){
		if(typeof target == "object"){
			target.parentNode.removeChild(target);
		}else if(typeof target == "string"){
			var dom = BFP_Core.domFinder(target);
			if(dom){
				BFP_Core.domRemover(dom);
			}
		}
	},
	// 把一些元素放进一个元素内部
	domAppender: function(){
		var father = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			father.appendChild(arguments[i]);
		}
	},
	// 把一些元素放到一个元素前面
	domBeforer: function(){
		var base = arguments[0];
		var father = base.parentNode;
		father.removeChild(base);
		for (var i = 1; i < arguments.length; i++) {
			var beforer = arguments[i];
			BFP_Core.domAppender(father, beforer);
		}
		BFP_Core.domAppender(father, base);
	},
	// 给一个元素加标签 desc属性
	labelIt: function(dom, label){
		dom.setAttribute("desc", label);
	},
	// 模态对话框的基础
	modalBase: function(){
		var modalBlack = BFP_Core.domCreator("div", "modalBlack");
		BFP_Core.labelIt(modalBlack, "BFP通用的模态遮罩层");
		var modalDialog = BFP_Core.domCreator("div", "modalDialog");
		var modalHeader = BFP_Core.domCreator("div", "modalHeader");
		var modalClose = BFP_Core.domCreator("a", "modalClose");
		var modalContainer = BFP_Core.domCreator("div", "modalContainer");
		var modalButton = BFP_Core.domCreator("a", "modalButton");

		BFP_Core.domAppender(document.body, modalBlack);
		BFP_Core.domAppender(modalBlack, modalDialog);
		BFP_Core.domAppender(modalDialog, modalHeader, modalContainer, modalButton);
		BFP_Core.domAppender(modalHeader, modalClose);
	},
	// 通知中心的盒子
	hintContainer: function(){
		var hintBox = BFP_Core.domCreator("div", "hintBox");
		hintBox.className = "hintDefault smaller transition";

		var hintHeader = BFP_Core.domCreator("div", "hintHeader");
		var hintTitle = BFP_Core.domCreator("span", "hintTitle");
		hintTitle.className = "invisible transition";
		hintTitle.textContent = "BFP消息管理装置";

		var hintSetting = BFP_Core.domCreator("span", "hintSetting");
		hintSetting.className = "transition";

		var hintPool = BFP_Core.domCreator("div", "hintPool");
		var hintFooter = BFP_Core.domCreator("div", "hintFooter");
		var hintFile = BFP_Core.domCreator("input", "hintFile");
		hintFile.type = "file";
		hintFile.className = "invisible";

		BFP_Core.domAppender(document.body, hintBox);
		BFP_Core.domAppender(hintBox, hintHeader, hintPool, hintFooter, hintFile);
		BFP_Core.domAppender(hintHeader, hintTitle, hintSetting);
		BFP_Core.labelIt(hintBox, "BFP通用的消息管理盒子");
	},
	// 追X神器的通用元素追加
	followMaster: function(){
		if(localStorageItems.isFollowMaster == "true"){
			var FM_actived, FM_Text, FM_addToPage, FM_base, FM_class, FM_target, FM_switcher, FM_SPName,
				FM_failText = "BFP追番神器启动失败 试试<a href='#' onclick='location.reload()'>刷新</a>？";
			switch (pos) {
				case "home":
					FM_actived = true;
					var bgmtts = BFP_Core.domFinder(".bgmtts .swc", true);
					if(bgmtts){
						FM_addToPage = BFP_Core.domBeforer;
						FM_base = bgmtts;
						FM_class = "";
						FM_Text = "BFP追番神器: 点击+添加要追的片儿喵~";
						FM_target = ".bgmmbox li";
						FM_switcher = ".bgmtts .swc li";
						FM_SPName = "";
					}else{
						FM_addToPage = BFP_Core.domAppender;
						FM_base = BFP_Core.domFinder(".bgm-calendar .b-head", true);
						FM_class = "FM_newBili";
						FM_Text = "BFP追番神器: 点击+添加要追的专题后刷新页面生效，BFP会记录并标记已点击过的专题内视频，补番追番再也不怕少看一集了>_<";
						FM_target = ".c-list li";
						FM_switcher = ".b-head li";
						FM_SPName = "";
					}
					break;
				case "sp":
					FM_actived = true;
					FM_addToPage = BFP_Core.domAppender;
					FM_base = BFP_Core.domFinder(".sp_small h1", true);
					FM_class = "FM_SP";
					FM_Text = "BFP追番神器:";
					FM_target = ".sp_small h1";
					FM_switcher = "";
					FM_SPName = FM_base.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
					break;
				case "video":
					FM_actived = true;
					FM_addToPage = BFP_Core.domAppender;
					var FM_base_temp = "";
					if(BFP_Core.domFinder(".v_bgm_list a", true)){
						FM_base_temp = ".v_bgm_list a";
						FM_target = ".v_bgm_list a.t";
						FM_switcher = "";
						FM_SPName = BFP_Core.domFinder(".v_bgm_list a", true).innerHTML.replace(/(^\s*)|(\s*$)/g, "");
					}else if(BFP_Core.domFinder("div.viewbox > div.info > h2", true)){
						FM_base_temp = ".viewbox h2";
						FM_target = FM_base_temp;
						FM_switcher = "#alist a";
						FM_SPName = BFP_Core.domFinder("div.viewbox > div.info > h2", true).innerHTML.replace(/(^\s*)|(\s*$)/g, "");
						if(!BFP_Core.domFinder(FM_switcher)){
							FM_actived = false;
						}
					}else{
						FM_base_temp = "body";
						FM_actived = false;
					}
					FM_base = BFP_Core.domFinder(FM_base_temp, true);
					FM_class = "FM_Video";
					FM_Text = "BFP追番神器:";
					break;
				case "space":
					FM_actived = true;
					FM_addToPage = BFP_Core.domAppender;
					FM_base = BFP_Core.domFinder(".spname", true);
					FM_class = "FM_Space";
					FM_Text = "BFP追阿婆神器:";
					FM_target = ".spname";
					FM_switcher = "";
					FM_SPName = BFP_Core.domFinder(".h-mid", true).innerHTML;
					break;
				case "bangumi1":
					break;
				case "bangumi2":
					break;
				case "api":
					break;
				case "letv":
					break;
				case "catalog":
					break;
				case "iqiyi":
					break;
				case "other":
					break;
			}
			if(isVideo){
				if(isVideo[1] == "7"){
					FM_actived = false;
				}
			}
			if(FM_actived){
				var FM_TextContainer = BFP_Core.domCreator("span", "FM_TextContainer");
				FM_TextContainer.innerHTML = FM_Text;
				FM_TextContainer.className = FM_class;
				FM_addToPage(FM_base, FM_TextContainer);

				var wrapper = function(){
					BFP_Core.waitThenCall(
						function(){
							return BFP_Core.domFinder(FM_target, true);
						},
						function(){
							BFP_Core.generateFM(FM_SPName, FM_target);
						},
						100, 10000, FM_failText
					);
				};
				wrapper();

				if(FM_switcher){
					var trigger = BFP_Core.domFinder(FM_switcher, true, true);
					if(trigger){
						for (var i = 0; i < trigger.length; i++) {
							trigger[i].onclick = wrapper;
						}
					}
				}
			}
		}
	},
	// 控制面板获取与追加
	controlPanel: function(){
		BFP_Core.waitThenCall(
			function(){
				return !checkingUpdate;
			},
			function(){
				var panelContainer = BFP_Core.domCreator("div", "panelContainer");
				BFP_Core.labelIt(panelContainer, "控制面板——呱太");
				BFP_Core.domAppender(document.body, panelContainer);
				var panelData = (localStorageItems.mainPanel).split("qwertqwert");
				if(panelData.length > 1){
					BFP_Core.domFinder("panelContainer").outerHTML = panelData[1];
					var latestVersion = panelData[2].replace(/(^\s*)|(\s*$)/mg, "");
					var updateInfo = panelData[3];
					if(latestVersion > version){
						var moreInfo = panelData[4];
						BFP_Core.showModalInfo(updateInfo, moreInfo);
					}
					extraInfo = panelData[5];
				}
			}
		);
	},
	// 表示工作中的动画 就是个呱太～ For Misaka
	switchAnimation: function(){
		var Misaka = document.createElement("div");
		Misaka.id = "Misaka";
		document.body.appendChild(Misaka);
		Misaka.outerHTML = "<div id='forMisaka' class='MisakaJump' desc='To Misaka: 表示工作中的动画 就是个呱太～' style='display:none;left: 47.5%; position: absolute; top: 50%;-webkit-transition: 0.5s all ease-out; transition: 0.5s all ease-out; -ms-transition: 0.5s all ease-out; -moz-transition: 0.5s all ease-out; -o-transition: 0.5s all ease-out;'> <div id='misakaToggle' class='misakaEyes'></div> <div id='misakaClose' class='misakaEyes'></div> <div id='misakaBody'></div> <div id='misakaCover1'></div> <div id='misakaCover2'></div> <div id='misakaMouth'>﹀</div> <div id='misakaWords' style='width: 100px; left: -20px; top: 50px;'>请稍等哟 呱</div></div>";
		// $("#misakaToggle").click(function(){
		// $("#misakaWords").text("戳我眼睛 咬你哟!");
		// });
		// $("#misakaClose").click(function(){
		// $("#misakaWords").text("啊 好讨厌!!!");
		// });
		// $("#misakaMouth").click(function(){
		// $("#misakaWords").text("嘴...不行哒哟...");
		// });
	},
	errorMessage: function(){
		var Error = document.createElement("div");
		Error.id = "errorMessage";
		document.body.appendChild(Error);
		Error.outerHTML = '<div id="errorMessage"><p>呱太正在卖力冲击黑洞中～</p> <p id="failed" style="display:none">额……看片失败惹QAQ?<a href="http://www.bilibili.com/video/av7/?cid=' + localStorage.getItem("cid") +'">开启爆破模式!(如果无效请告知我AV号)</a></p><p>国内用户：某些视频是需要海外IP的哦～</p> <p>海外用户：某些视频时需要天朝IP的哦～</p> <p>如果您翻墙之后依然出错……请告知我AV号<a href="http://tieba.baidu.com/p/2381425050" target="_blank">戳我</a></p> <p>如果您需要稳定靠谱速度快，无限流量价格低的翻墙工具</p> <p>在此强力推荐<a href="http://jingyun.org/" target="_blank">静云ShadowSocks</a>，BFP用户凭优惠码有惊♂喜哦～</p> <p>优惠密码：5Yir56yR77yB5L2g5Lmf5piv5Z+65L2s77yB </p> <p>声明1：BFP会保持一如既往的免费与可靠，接受捐助，静云是收费代理服务，支持全部平台，同样稳定可靠。</p> <p>声明2：没有静云BFP也可以并将继续保持良好的服务～</p> <p>声明3：没有BFP静云也可以作为享受自由网络的利器～</p> <p>声明4：背景图片来自于<a href="http://www.pixiv.net/member_illust.php?mode=medium&illust_id=44557445" target="_blank">Pixiv</a></p> <img src="http://bilifixer.nmzh.net/images/donate.png" alt="捐助BFP～马上得萝莉～"> </div>';
	},
	// 视频播放器下面的BFP按钮收纳箱
	BFPContainer: function(){
		var findPlayer = "";
		switch (pos) {
			case "home":
				break;
			case "sp":
				break;
			case "video":
				var playerDom = BFP_Core.getPlayerDom();
				var oPlayer = playerDom;
				var isBili = BFP_Core.isBili();

				var playerDomFather = playerDom.parentNode;
				var BFPContainer = BFP_Core.domCreator("div", "BFPContainer");
				BFPContainer.className = "transition";

				var BFPName = BFP_Core.domCreator("span", "BFPName");
				BFPName.innerHTML = "BFP";

				var BFPButtonsClassName = "BFPButtons invisible";
				var BFPFlashChanger = BFP_Core.domCreator("span", "BFPFlashChanger");
				BFPFlashChanger.innerHTML = "Flash切换器";
				BFPFlashChanger.className = BFPButtonsClassName;
				var i = 0;
				BFPFlashChanger.onclick = function() {
					if (i < 4) {
						++i;
					} else {
						i = 1;
					}
					BFP_Core.setValue("videoPlay", "videoPlay" + i);
					var playerDom = BFP_Core.getPlayerDom();
					var playerDomFather = playerDom.parentNode;
					playerDomFather.removeChild(playerDom);

					var BFPNewPlayer = BFP_Core.createPlayer();
					var BFPContainer = BFP_Core.domFinder("BFPContainer");
					if (BFPContainer) {
						BFP_Core.domBeforer(BFPContainer, BFPNewPlayer);
					} else {
						BFP_Core.domAppender(playerDomFather, BFPNewPlayer);
					}
					BFP_Core.addListenser();
				};

				var BFPHTML5 = BFP_Core.domCreator("span", "BFPHTML5");
				BFPHTML5.innerHTML = "HTML5播放器";
				BFPHTML5.className = BFPButtonsClassName;
				BFPHTML5.onclick = function() {
					var BFPButtons = BFP_Core.domFinder(".BFPButtons", true, true);
					for (var k = 0; k < BFPButtons.length; k++) {
						BFP_Core.toggleClassName(BFPButtons[k], "invisible");
					}
					var mp4bList = BFP_Core.getValue("mp4_" + BFP_Core.getValue("cid") + "_bArray").split(",");
					var mp4dList = BFP_Core.getValue("mp4_" + BFP_Core.getValue("cid") + "_dArray").split(",");
					for (var j = 0; j < mp4dList.length; j++) {
						var tempd = BFP_Core.domCreator("span", "mp4dList" + j);
						tempd.className = "BFPButtons mp4";
						BFP_Core.labelIt(tempd, "MP4视频源选择器");
						tempd.innerHTML = "主视频源" + (j + 1);
						tempd.setAttribute("data", mp4dList[j]);
						BFP_Core.domAppender(BFPContainer, tempd);
					}
					for (var i = 0; i < mp4bList.length; i++) {
						var tempb = BFP_Core.domCreator("span", "mp4bList" + i);
						tempb.className = "BFPButtons mp4";
						BFP_Core.labelIt(tempb, "MP4视频源选择器");
						tempb.innerHTML = "副视频源" + (i + 1);
						tempb.setAttribute("data", mp4bList[i]);
						BFP_Core.domAppender(BFPContainer, tempb);
					}

					var HTML5hint = BFP_Core.domCreator("span", "HTML5hint");
					HTML5hint.className = "BFPButtons mp4";
					HTML5hint.innerHTML = "目前HTML播放器暂无弹幕";
					BFP_Core.domAppender(BFPContainer, HTML5hint);

					var mp4List = BFP_Core.domFinder(".mp4", true, true);
					for (var m = 0; m < mp4List.length; m++) {
						mp4List[m].onclick = function(){
							var src = this.getAttribute("data");
							var BFPHTML5Player = BFP_Core.domCreator("video", "BFPHTML5Player");
							BFPHTML5Player.src = src;
							BFPHTML5Player.style.width = "100%";
							BFPHTML5Player.setAttribute("controls", true);
							BFPHTML5Player.setAttribute("autoplay", true);
							var playerDom = BFP_Core.getPlayerDom();
							var playerDomFather = playerDom.parentNode;
							playerDomFather.removeChild(playerDom);
							var BFPContainer = BFP_Core.domFinder("BFPContainer");
							if (BFPContainer) {
								BFP_Core.domBeforer(BFPContainer, BFPHTML5Player);
							} else {
								BFP_Core.domAppender(playerDomFather, BFPHTML5Player);
							}
						}
					}
				};

				var BFPRollBack = BFP_Core.domCreator("span", "BFPRollBack");
				BFPRollBack.innerHTML = "原始播放器";
				BFPRollBack.className = BFPButtonsClassName;
				BFPRollBack.onclick = function() {
					var playerDom = BFP_Core.getPlayerDom();
					playerDom.outerHTML = oPlayer.outerHTML;
					BFP_Core.addListenser();
				}

				var BFPGoIQY = BFP_Core.domCreator("span", "BFPGoIQY");
				BFPGoIQY.innerHTML = "奇艺指通车";
				BFPGoIQY.className = BFPButtonsClassName;

				var BFPSohuNoAd = BFP_Core.domCreator("span", "BFPSohuNoAd");
				BFPSohuNoAd.innerHTML = "搜狐无广告";
				BFPSohuNoAd.className = BFPButtonsClassName;
				BFPSohuNoAd.onclick = function(){
					if(isBili == -3){
						var newPlayer = oPlayer;
						newPlayer.src = "http://bilifixer.nmzh.net/BFP/swf/sohu.swf";
						var playerDom = BFP_Core.getPlayerDom();
						playerDom.outerHTML = oPlayer.outerHTML;
					}
				}

				var BFPDownloader = BFP_Core.domCreator("span", "BFPDownloader");
				BFPDownloader.innerHTML = "下载视频/弹幕";
				BFPDownloader.className = BFPButtonsClassName;

				var BFPDonate = BFP_Core.domCreator("span", "BFPDonate");
				BFPDonate.innerHTML = "捐助得萝莉";
				BFPDonate.className = BFPButtonsClassName;

				var BFPBack = BFP_Core.domCreator("span", "BFPBack");
				BFPBack.className = "BFPButtons";
				BFPBack.innerHTML = "返回上级";
				BFPBack.onclick = function(){
					var BFPButtons = BFP_Core.domFinder(".BFPButtons", true, true);
					for (var i = 0; i < BFPButtons.length; i++) {
						BFP_Core.removeClassName(BFPButtons[i], "invisible");
					}
					var mp4List = BFP_Core.domFinder(".mp4", true, true);
					for (var j = 0; j < mp4List.length; j++) {
						BFP_Core.addClassName(mp4List[j], "invisible");
					}
					BFP_Core.addClassName(this, "invisible");
				};

				BFP_Core.domAppender(BFPContainer, BFPName, BFPFlashChanger, BFPHTML5, BFPRollBack, BFPGoIQY, BFPSohuNoAd, BFPDownloader, BFPDonate, BFPBack);
				BFP_Core.domAppender(playerDomFather, BFPContainer);

				var BFPButtons = BFP_Core.domFinder(".BFPButtons", true, true);
				BFPContainer.onmouseover = function(){
					BFP_Core.toggleClassName(BFPContainer, "expand");
					for (var i = 0; i < BFPButtons.length; i++) {
						BFP_Core.toggleClassName(BFPButtons[i], "invisible");
					};
				};
				BFPContainer.onmouseout = function(){
					BFP_Core.toggleClassName(BFPContainer, "expand");
					for (var i = 0; i < BFPButtons.length; i++) {
						BFP_Core.toggleClassName(BFPButtons[i], "invisible");
					};
				};

				if(isVideo[1] == "7"){
					BFPFlashChanger.click();
				}

				if(isBili == -1){
					BFPFlashChanger.click();
				}

				if(isBili == -2){
					// BFPContainer
					BFPHTML5.click();
					BFP_Core.domFinder("HTML5hint").innerHTML = "爱奇艺首选HTML5视频源 Flash或许要翻墙 目前HTML播放器暂无弹幕";
				}

				if(isBili == -3){
					BFPSohuNoAd.click();
				}

				if(isBili == -4){
					BFPFlashChanger.click();
				}

				if(isBili == -5){
					BFPFlashChanger.click();
				}
				break;
			case "letv":
				// BFP按钮－Letv
				break;
			case "iqiyi":
				// BFP按钮－Iqiyi
				break;
			case "bangumi1":
				break;
			case "bangumi2":
				break;
			case "space":
				break;
			case "catalog":
				break;
			case "other":
				break;
		}
	},
	isBili: function() {
		var player = BFP_Core.getPlayerDom();
		console.log(player);
		var num = -1;
		try {
			num = player.src.indexOf("bilibili") + player.src.indexOf("hdslb");
			if (player.src.indexOf("sohu") > -1) {
				num = -3;
			} else if (player.src.indexOf("iqiyi") > -1) {
				num = -2;
			} else if (player.src.indexOf("youku") > -1) {
				num = -1;
			} else if (player.src.indexOf("pptv") > -1) {
				num = -1;
			} else if (player.src.indexOf("tc") > -1) {
				num = -1;
			}else if(player.src.indexOf("letv-wrapper.swf")>-1){
				num = -1;
			}
		} catch (exception) {}
		return num
	},
	createPlayer: function(type) {
		var BFPPlayer;
		var videoPlay = BFP_Core.getValue("videoPlay");
		if (videoPlay == "lebili" || videoPlay == "videoPlay1" || videoPlay == "videoSina" || videoPlay == "videoPlay3") {
			BFPPlayer = BFP_Core.domCreator("embed", "BFPPlayer");
			BFPPlayer.setAttribute("quality", "high");
			BFPPlayer.setAttribute("allowfullscreeninteractive", "true");
			BFPPlayer.setAttribute("allowscriptaccess", "always");
			BFPPlayer.setAttribute("allowfullscreen", "true");
			BFPPlayer.setAttribute("rel", "noreferrer");
			BFPPlayer.setAttribute("wmode", "window");
			BFPPlayer.setAttribute("type", "application/x-shockwave-flash");
			if(BFP_Core.getValue("vid")){
				// BFPPlayer.setAttribute("flashvars", BFP_Core.getPath() + "&vid=" + BFP_Core.getVid());
			}else{
				// BFPPlayer.setAttribute("flashvars", BFP_Core.getPath());
			}
			if (BFP_Core.getValue("bfpStrategy") === "vid") {
				// BFPPlayer.setAttribute("flashvars", "vid=" + BFP_Core.getSinaVid());
			}
			BFPPlayer.setAttribute("pluginspage", "http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash");
		} else {
			BFPPlayer = BFP_Core.domCreator("iframe", "BFPPlayer");
			BFPPlayer.setAttribute("scrolling", "no");
			BFPPlayer.setAttribute("border", "0");
			BFPPlayer.setAttribute("frameborder", "no");
			BFPPlayer.setAttribute("framespacing", "0");
			BFPPlayer.setAttribute("onload", "window.securePlayerFrameLoaded=true");
		}
		BFPPlayer.src = BFP_Core.getURL(videoPlay);
		BFPPlayer.className = "player";
		return BFPPlayer;
	},
	addListenser: function() {
		if (window.postMessage) {
			var onMessage = function(e) {
				if (e.data.substr(0, 6) == "secJS:") {
					var funVal = e.data.substr(6);
					BFP_Core.contentEval(funVal);
					if (funVal.indexOf("fullwin(true)") > -1) {
						BFP_Core.domFinder("season_selector").style.display = "none";
					} else {
						BFP_Core.domFinder("season_selector").style.display = "block";
					}
				}
				if (typeof(console.log) != "undefined") {
					console.log("BFPLog: " + "Func:addListenser" + ", Obj:" + e.origin + ", Msg:" + e.data);
				}
			};
			if (window.addEventListener) {
				window.addEventListener("message", onMessage, false);
			} else if (window.attachEvent) {
				window.attachEvent("onmessage", onMessage);
			}
		} else {
			setInterval(function() {
				if (evalCode = __GetCookie('__secureJS')) {
					__SetCookie('__secureJS', '');
					eval(evalCode);
				}
			}, 1000);
		}
	},
	getPlayerDom: function(){
		var bofqi = document.getElementById("bofqi");
		if(bofqi){
			var o_player = bofqi.getElementsByTagName("object")[0] || bofqi.getElementsByTagName("iframe")[0] || bofqi.getElementsByTagName("embed")[0];
			return o_player;
		}else{
			return false;
		}
	},
	// 根据视频查找他的专题信息
	spInfoFinder: function(){
		switch (pos) {
			case "home":
				break;
			case "sp":
				break;
			case "video":
				break;
			case "letv":
				break;
			case "iqiyi":
				break;
			case "bangumi1":
				// 专题查询功能
				break;
			case "bangumi2":
				// 专题查询功能
				break;
			case "space":
				break;
			case "catalog":
				break;
			case "other":
				break;
		}
	},
	// 追X神器按钮样式判断与追加
	generateFM: function(spName, fmTarget){
		var base = BFP_Core.domFinder(fmTarget, true, true);
		var FMC_Container, FMC_Text = "+", FMC_List = localStorageItems.followList;

		if(base.length == 1){
			FMC_Container = BFP_Core.domCreator("span", "FMC_Container");
			for (var i = 0; i < FMC_List.length; i++) {
				if(FMC_List[i] == spName){
					FMC_Text = "-";
				}
			}
			FMC_Container.innerHTML = FMC_Text;
			BFP_Core.domAppender(base[0], FMC_Container);
		}else{
			for (var j = 0; j < base.length; j++) {
				FMC_Container = BFP_Core.domCreator("span", "FMC_Container" + j);
				spName = base[j].querySelector("a[title]").getAttribute("title").toUpperCase();
				for (var k = 0; k < FMC_List.length; k++) {
					if(FMC_List[k] == spName){
						FMC_Text = "-";
					}
				}
				FMC_Container.innerHTML = FMC_Text;
				BFP_Core.domAppender(base[j], FMC_Container);
			}
		}
	},
	// 把一个通知内容加到通知中心里面
	addToHint: function(info, shouldRepe){

	},
	// 把一个变量存在sessionStorage
	setValue: function(name, value){
		if(localStorage){
			localStorage.setItem(name, value);
		}else{
			BFP_Core.log("浏览器不支持localStorage 建议更新一下");
		}
	},
	getValue: function(name){
		if(localStorage){
			return localStorage.getItem(name);
		}else{
			BFP_Core.log("浏览器不支持localStorage 建议更新一下");
		}
	},
	getPath: function() {
		if (BFP_Core.getValue("bfpStrategy") === "vid") {
			return "vid=" + BFP_Core.getValue("sinavid");
		} else {
			return "cid=" + BFP_Core.getValue("cid") + '&aid=' + BFP_Core.getValue("aid");
		}
	},
	getClassNameList: function(baseDom){
		return baseDom.className.split(" ");
	},
	addClassName: function(baseDom, classToAdd){
		BFP_Core.toggleClassName(baseDom, "thisIsTempClass");
		BFP_Core.changeClassName(baseDom, classToAdd, "thisIsTempClass");
	},
	removeClassName: function(baseDom, classToRemove){
		BFP_Core.changeClassName(baseDom, "thisIsTempClass", classToRemove);
		BFP_Core.toggleClassName(baseDom, "thisIsTempClass");
	},
	toggleClassName: function(baseDom, classToToggle){
		var classList = BFP_Core.getClassNameList(baseDom);
		if(baseDom.classList){
			baseDom.classList.toggle(classToToggle);
		}else{
			for (var i = 0; i < classList.length; i++) {
				if(classList[i] == classToToggle){
					BFP_Core.removeClassName(classToToggle);
				}else{
					BFP_Core.addClassName(classToToggle);
				}
			}
		}
	},
	changeClassName: function(baseDom, classToAdd, classToRemove){
		if(baseDom.classList){
			baseDom.classList.add(classToAdd);
			baseDom.classList.remove(classToRemove);
		}else{
			var classList = BFP_Core.getClassNameList();
			var shouldAdd = true;
			for (var i = 0; i < classList.length; i++) {
				if(classList[i] == classToAdd){
					shouldAdd = false;
				}
				if(classList[i] == classToRemove || classList[i] === ""){
					classList.splice(i, 1);
				}
			}
			if(shouldAdd){
				classList.concat(classToAdd);
			}
			baseDom.className = classList.join(" ");


		}
	},
	// 随机获取一个颜文字
	getEmoticon: function(){
		var emoticons = "(*≧m≦*)@#@(>_<)@#@(,,#ﾟДﾟ)@#@ヽ(ｏ`皿′ｏ)ﾉ@#@o(>< )o@#@ｏ( ><)o@#@ヽ(≧Д≦)ノ@#@（＞д＜）@#@（;≧皿≦）@#@[○･｀Д´･○]@#@ヽ(#`Д´)ﾉ@#@Σ(-`Д´-ﾉ；)ﾉ@#@(((p(>o<)q)))@#@(/ﾟДﾟ)/@#@(¬д¬。)@#@ヽ(#`Д´)ﾉ@#@(¬､¬)@#@（；¬＿¬)@#@(;¬_¬)@#@(；¬д¬)@#@(≧σ≦)@#@o(-`д´- ｡)@#@ヽ(●-`Д´-)ノ@#@(*￣m￣)@#@(´Д｀)@#@(；￣Д￣）@#@(¬_¬)ﾉ@#@(＃｀д´)ﾉ@#@(」゜ロ゜)」@#@Σ(▼□▼メ)@#@(〝▼皿▼）@#@(▼皿▼#)@#@ヽ( ｀0´)ﾉ@#@(︶︹︺)@#@(≧０≦)@#@(=ﾟωﾟ)ﾉ@#@(○’ω’○)@#@[´・ω・`]@#@ヾ(｡･ω･｡)@#@(´-ω-｀)@#@(*･ω･)@#@(*-ω-)@#@┗(･ω･;)┛@#@｛・ω-*}@#@(* >ω<)@#@ヾ(ｏ･ω･)ﾉ@#@w(´･ω･`)w@#@(´・ω・`)@#@(・ω・；)@#@Σ(・ω・`|||)@#@ヾ(・ω・ｏ)@#@(´o・┏ω┓・o｀)@#@ヽ(･ω･｡)ﾉ@#@(ﾉ･ω･)ﾉﾞ@#@ヽ(･ω･ゞ)@#@ヾ(･ω･`｡)@#@(。-`ω´-)@#@(=ﾟωﾟ)ノ@#@(｡+･`ω･´)@#@ヽ(｡ゝω・｡)ﾉ@#@(´・ω・`)";
		var list = emoticons.split("@#@");
		var random = list.length * Math.random();
		return list[Math.floor(random)];
	},
	// 通用的记录器 因为IE不认识console
	log: function(info, shouldRepe){
		if(window.console){
			console.log(info);
		}
		BFP_Core.addToHint(info, shouldRepe);
	},
	// 启动！一次……
	startOnce: function(){
		if(notStarted){
			//防止二次启动
			notStarted = false;

			BFP_Core.switchAnimation();

			//非油猴方式启动则开启兼容模式
			if(!GM_xmlhttpRequest){
				mode = "compatible";
			}

			//需要附加上去的依赖们 包括了CSS和JS和一些页面元素~
			BFP_Core.addDependencies();

			//确保JS文件加载完毕并且生效
			BFP_Core.ensureJSLoaded(
				function(){
					//获取以前就保存好了的信息 都是存在localstorage里面
					BFP_Core.getStoredDate();

					//根据实际情况修改当前页面UI
					BFP_Core.modifyUI();

					//根据实际情况增加按钮功能等
					BFP_Core.setFunctions();

					BFP_Core.domFinder("content").innerHTML = "<p>加载完毕喵~</p><p>窗口五秒后自动消失喵~</p><p>舍不得人家的话就刷新页面喵喵~</p>";
					setTimeout(function(){
						BFP_Core.domFinder("loading").style.display = "none";
					},5000);
				},
				1
			);
		}
	},
	// 获取所需要的数据
	getStoredDate: function(){
		BFP_Core.iniLocalStorage();
		BFP_Core.mainPanelInitial(false);
		localStorageItems.followList = localStorageItems.followList.toUpperCase().split(",");
	},
	// 主面板缓存与更新
	mainPanelInitial: function(isForceUpdate){
		if(BFP_Core.checkUpdate(isForceUpdate)){
			BFP_Core.callNewPanel(isForceUpdate);
		}else{
			BFP_Core.iniLocalStorage("mainPanel", "false");
			if(localStorageItems.mainPanel == "false"){
				BFP_Core.callNewPanel();
			}
		}
	},
	// 面板内容刷新
	callNewPanel: function(isForceUpdate){
		checkingUpdate = true;
		BFP_Core.log("主面板更新中～请稍后哟三3三");
		BFP_Core.DAF(BFP_Core.getURL("panel"), function(){
			localStorage.setItem("mainPanel", BFP_Core.getResTxt() + "#PanelDate#" + new Date().getTime());
			BFP_Core.iniLocalStorage("mainPanel", "false");
			if(localStorageItems.mainPanel == "false"){
				BFP_Core.log("额……控制面版更新失败惹(´Д` )");
			}else{
				BFP_Core.log("主面板更新完毕～");
				checkingUpdate = false;
				if(isForceUpdate){
					BFP_Core.domRemover("MisakaMoe");
					BFP_Core.controlPanel();
				}
			}
		});
	},
	// 初始化localstorage
	iniLocalStorage: function(param, value){
		if(localStorage){
			if(param){
				value = localStorageItems[param] || value || true;
				if(!localStorage.getItem(param)) {
					localStorage.setItem(param, value);
				}
				localStorageItems[param] = localStorage.getItem(param);
			}else{
				for(var i in localStorageItems){
					BFP_Core.iniLocalStorage(i);
				}
			}
		}else{
			BFP_Core.log("建议更新一下您这个老掉牙的浏览器……");
		}
	},
	// 所有的UI修改
	modifyUI: function(){
		// 通用的遮罩层
		BFP_Core.modalBase();
		// 通用的右下角友好通知管理
		BFP_Core.hintContainer();
		// 通用的FollowMaster
		BFP_Core.followMaster();
		// 首页左上角都控制面板
		BFP_Core.controlPanel();

		switch (pos) {
			case "home":
				localStorageItems.showPanel = "true";
				break;
			case "sp":
				break;
			case "video":
				// BFP按钮－Bili

				break;
			case "letv":
				// BFP按钮－Letv
				//BFP_Core.BFPContainer();
				break;
			case "iqiyi":
				// BFP按钮－Iqiyi
				//BFP_Core.BFPContainer();
				break;
			case "bangumi1":
				// 专题查询功能
				//BFP_Core.spInfoFinder();
				break;
			case "bangumi2":
				// 专题查询功能
				//BFP_Core.spInfoFinder();
				break;
			case "space":
				break;
			case "catalog":
				break;
			case "other":
				break;
		}
	},
	// 所有的功能设置
	setFunctions: function(){
		BFP_Core.toggleClassName(BFP_Core.domFinder("forMisaka"), "MisakaJump");
		BFP_Core.linkCheck();
		BFP_Core.hintBoxIni();
		if(pos == "video"){
			if(isVideo[1] != "7"){
				BFP_Core.setValue("aid", isVideo[1]);
				BFP_Core.getCidByAid();
				BFP_Core.waitThenCall(
					function(){
						return Number.isInteger(Number.parseInt(BFP_Core.getValue("cid")));
					},
					function(){
						var typename = BFP_Core.getValue("typename");
						if(!typename || typename == "连载动画"){
							BFP_Core.BFPContainer();
							BFP_Core.videoCheck();
						}
					},
					100,
					10000,
					"暂时不能判断是否为新番",
					true
				);
			}else {
				BFP_Core.BFPContainer();
			}
		}
	},
	// 检查一个链接是否需要处理
	linkCheck: function(){
		var as = BFP_Core.domFinder("a:not([onclick])", true, true);
		if(as){
			for (var i = 0; i < as.length; i++) {
				var tempParam = /\/video\/av(\d+)(?:\/index_(\d+))?/.exec(as[i].href);
				if(tempParam){
					as[i].onclick = function(e){
						var temp = /\/video\/av(\d+)(?:\/index_(\d+))?/.exec(this.href);
						var opener = window.open();
						var tempScript = opener.document.createElement("script");
						var tempStyle = opener.document.createElement("link");
						var tempStyle2 = opener.document.createElement("style");
						tempStyle.href = BFP_Core.toRandomURL("http://bilifixer.nmzh.net/BFP/universe.css");
						tempStyle.setAttribute("rel", "stylesheet");
						tempStyle2.innerHTML = '::-moz-selection{background:rgba(148, 44, 219, 0.3); color:#fc5;} ::selection {background:rgba(148, 44, 219, 0.3); color:#fc5;}body{height: 100%; background-image: url("http://ww2.sinaimg.cn/large/6d9bd6a5gw1elm3om5388j21kw11mwkb.jpg");color: #FFF; text-align: center; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);}';
						tempScript.innerHTML = "var Misaka = " + BFP_Core.switchAnimation;
						tempScript.innerHTML += ";var Error = " + BFP_Core.errorMessage;
						opener.document.head.appendChild(tempScript);
						opener.document.head.appendChild(tempStyle);
						opener.document.head.appendChild(tempStyle2);
						opener.window.Misaka();
						opener.window.Error();

						var Misaka = opener.document.getElementById("forMisaka");
						Misaka.className = "MisakaJump";
						var failed = opener.document.getElementById("failed");
						opener.window.setTimeout(function(){
							Misaka.className = "";
							failed.style.display = "block";
						},10000);

						BFP_Core.setValue("aid", temp[1]);
						BFP_Core.setValue("page", temp[2]);
						BFP_Core.setValue("cid", "");
						BFP_Core.setValue("typename", "");
						e.preventDefault();
						BFP_Core.getCidByAid();
						BFP_Core.waitThenCall(
							function(){
								return Number.isInteger(Number.parseInt(BFP_Core.getValue("cid")));
							},
							function(){
								var typename = BFP_Core.getValue("typename");
								if(!typename || typename == "连载动画"){
									BFP_Core.videoCheck(opener);
								}else{
									opener.location = temp[0];
								}
							},
							100,
							10000,
							"暂时不能判断是否为新番",
							true
						);
					};
				}
			}
		}else{

		}

	},
	// 检查链接视频可用性
	videoCheck: function(videoWindow){
		var cid = BFP_Core.getValue("cid");
		var aid = BFP_Core.getValue("aid");
		var urlFLV = BFP_Core.getURL("FLV", true);
		var urlMP4 = BFP_Core.getURL("MP4", true);
		var urlToOpen = "http://www.bilibili.com/video/av" + aid;
		var checkAvailability = function(type){
			var json = BFP_Core.getJson();
			var dList = json.durl;
			var bList = json.burl;
			var dArray = "";
			var bArray = "";
			if(dList){
				for (var i = 0; i < dList.length; i++) {
					var dLink = dList[i].url || dList.url;
					dArray += dLink + ",";
				}
				if(!bList){
					bList = json.durl[0].backup_url;
				}
			}else{

			}
			if(bList){
				if (bList.hasOwnProperty("url")) {
					bList = bList.url;
				}
				for (var j = 0; j< bList.length; j++) {
					var bLink = bList[j].url || bList[j];
					bArray += bLink + ",";
				}
			}else{

			}
			BFP_Core.setValue(type + "_" + cid + "_dArray", dArray.slice(0, -1));
			BFP_Core.setValue(type + "_" + cid + "_bArray", bArray.slice(0, -1));
			BFP_Core.DAF(urlToOpen, function(){
				setTimeout(function(){
					if(videoWindow){
						videoWindow.location = urlToOpen;
					}
				}, 5000);
			});
		};
		BFP_Core.DAF(urlFLV, function(){
			checkAvailability("flv");
		});
		BFP_Core.DAF(urlMP4, function(){
			checkAvailability("mp4");
		});
	},
	toForceMode: function(){
		var url = BFP_Core.getURL("FM");

	},
	// 打开一个URL 似乎没什么用的样子
	openURL: function(link){
		var tempLink = BFP_Core.domCreator("form", "tempLink");
		tempLink.setAttribute("method", 'get');
		tempLink.setAttribute("action", link);
		tempLink.setAttribute("target", '_black');
		BFP_Core.domAppender(document.body, tempLink);
		tempLink.submit();
	},
	getCidByAid: function(){
		var url = BFP_Core.getURL("CID", true);
		BFP_Core.DAF(url, function(){
			var json = BFP_Core.getJson();
			var cid = 0;
			var typename = "";
			if(json.hasOwnProperty("cid")){
				cid = json.cid;
			}
			if (json.hasOwnProperty("typename")) {
				typename = json.typename;
			}
			BFP_Core.setValue("cid", json.cid);
			BFP_Core.setValue("typename", typename);
		});
	},
	getJson: function(){
		var jsonText = BFP_Core.getResTxt();
		if (jsonText.indexOf("{") == -1) {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(jsonText, "text/xml");

			var durlObj = DT.xmlPaser("durl");
			var burlObj = DT.xmlPaser("backup_url");

			jsonText = "";
			jsonText += '{"durl": [';
			for (var i = 0; i < durlObj.length; i++) {
				jsonText += '{"url": "';
				var dLength = durlObj[i].childNodes.length;
				for (var j = 0; j < dLength; j++) {
					if ("url" == durlObj[i].childNodes[j].nodeName) {
						jsonText += durlObj[i].childNodes[j].childNodes[0].nodeValue;
					}
				}
				if (i == durlObj.length - 1) {
					jsonText += '"}';
				} else {
					jsonText += '"}, ';
				}
			}
			if (burlObj.length > 0) {
				jsonText += '],"burl": [';
				for (var k = 0; k < burlObj.length; k++) {
					var bLength = burlObj[k].childNodes.length;
					for (var m = 0; m < bLength; m++) {
						if ("url" == burlObj[k].childNodes[m].nodeName) {
							jsonText += '{"url": "';
							jsonText += burlObj[k].childNodes[m].childNodes[0].nodeValue;
							jsonText += '"},';
						}
					}
				}
				jsonText = jsonText.slice(0, -1);
			}
			jsonText += '] }';
		}
		if (jsonText.indexOf("length") != -1) {
			jsonText = jsonText.replace(/length/mg, "changdu");
		}

		var json = JSON.parse(jsonText);
		if (json.hasOwnProperty("query")) {
			json = json.query.results;
			if (json) {
				if (json.hasOwnProperty("video")) {
					json = json.video;
				} else if (json.hasOwnProperty("json")) {
					json = json.json;
				}
				if (json.hasOwnProperty("durl")) {
					if (json.durl.order == "1") {
						var newText = "[" + JSON.stringify(json.durl) + "]";
						json.durl = JSON.parse(newText);
					}
				}
			}
		}
		if(json.title){
			BFP_Core.setValue("title", json.title);
		}else{
			BFP_Core.setValue("title", "获取标题失败……");
		}
		return json;
	},
	hintBoxIni: function(){
		var hintSetting = BFP_Core.domFinder("hintSetting");
		var hintFile = BFP_Core.domFinder("hintFile");
		var fileReader = new FileReader();
		var hintTitle = BFP_Core.domFinder("hintTitle");
		var hintBox = BFP_Core.domFinder("hintBox");
		hintBox.style.backgroundImage = localStorage.userHintBGI;
		hintBox.onmouseover = function(){
			BFP_Core.toggleClassName(hintTitle, "invisible");
			this.className = "hintDefault biggerthanbigger transition";
		};
		hintBox.onmouseout = function(){
			BFP_Core.toggleClassName(hintTitle, "invisible");
			this.className = "hintDefault smaller transition";
		};
		fileReader.onload = function(){
			localStorage.setItem("userHintBGI", "url(" + this.result + ")");
			hintBox.style.backgroundImage = localStorage.userHintBGI;
		};
		hintFile.onchange = function(e){
			var tempFile = e.target.files[0];
			fileReader.readAsDataURL(tempFile);
		};
		hintSetting.onclick = function(){
			hintFile.click();
		};
		hintSetting.onmouseover = function(){
			BFP_Core.setValue("hintTitle", hintTitle.textContent);
			hintTitle.textContent = "请上传宽度为200的图片";
		};
		hintSetting.onmouseout = function(){
			hintTitle.textContent = BFP_Core.getValue("hintTitle");
		};
	},
	spIni: function(){

	},
	// 检查更新频率
	checkUpdate: function(isForceUpdate){
		if(isForceUpdate){
			return true;
		}else{
			var thenTime = localStorageItems.mainPanel.split("#PanelDate#")[1];
			var thisTime = new Date().getTime();
			return Number.isNaN(Number(thenTime)) || (thisTime - thenTime) > (localStorageItems.updateIn * 86400);
		}
	},
	// 等待某个东西完成之后再进行某个事情 超时了就显示失败消息
	waitThenCall: function(waitWhat, callWhat, retryIn, timeout, showWhenFail, forceCall){
		var st = 0;
		var target = waitWhat();
		var waiting = self.setInterval(function(){
			st++;
			if(target){
				clearInterval(waiting);
				callWhat();
			}
			if(st >= ((timeout || 10000) / (retryIn || 100))){
				clearInterval(waiting);
				BFP_Core.log(showWhenFail || "额……上一个操作失败惹ˊ_>ˋ");
				if(forceCall){
					callWhat();
				}
			}
			target = waitWhat();
		},retryIn || 100);
	},
	// 给URL加上随机参数
	toRandomURL: function(oldURL, noRandom){
		var newURL = oldURL;
		if(!noRandom){
			if(oldURL.indexOf("?") > -1){
				newURL = oldURL + "&random=" + Math.random();
			}else{
				newURL = oldURL + "?random=" + Math.random();
			}
		}
		return newURL;
	},
	// 不知道算不算是一个安全的eval替代办法
	contentEval: function(funcName, funcText){
		var script = BFP_Core.domCreator('script', "BFP_" + funcName, true);
		script.textContent = "(function(){" + funcText + "})()";
		BFP_Core.domAppender(document.head, script);
	},
	// 检查一个函数是否已经存在
	ensureFuncActived: function(funcStr, callback){
		var isActived = false;
		var funcName = funcStr.split("#")[0];
		var funcText = "localStorage.setItem('" + funcName + "', ((typeof " + funcName + ") == 'function') ||  ((typeof " + funcName + ") == 'object'))";
		var checkIsLoaded = self.setInterval(function(){
			BFP_Core.contentEval(funcName, funcText);
			if(localStorage.getItem(funcName) == "true"){
				BFP_Core.log(funcStr.split("#")[1] + "加载成功" + BFP_Core.getEmoticon());
				num++;
				clearInterval(checkIsLoaded);
				if(typeof callback == "function"){
					callback();
				}
			}
		},1000);
		return isActived;
	},
	// 保证添加的几个JS文件都已经完全载入
	ensureJSLoaded: function(callback, number){
		BFP_Core.ensureFuncActived("ini#BFP核心");
		// BFP_Core.ensureFuncActived("hex_md5#BFP哈希校验");
		// BFP_Core.ensureFuncActived("heimu#B站播放器核心");
		// BFP_Core.ensureFuncActived("CryptoJS#BFP加密核心", function(){
			// var Base64_Script = BFP_Core.domCreator("script", "Base64_Script");
			// Base64_Script.src = "//bilifixer.nmzh.net/BFP/JS/enc-base64-min.js";
			// BFP_Core.domAppender(document.head, Base64_Script);
		// });
		// BFP_Core.ensureFuncActived("CryptoJS.enc.Base64#BFPBase64加密");
		if(!number){
			number = 5;
		}
		var flag = 0;
		var waiting = self.setInterval(function(){
			BFP_Core.log("依赖组件加载中～倒计时" + (60 - flag) + "秒");
			flag++;
			if(num == number){
				BFP_Core.log("依赖组件全部加载完毕～");
				clearInterval(waiting);
				callback();
			}
			if(flag == 60){
				BFP_Core.log("网络不稳定或服务器挂掉 已切换离线模式");
				// BFP_Core.offlineMode();
				BFP_Core.domFinder("content").innerHTML = "<p>加载失败惹QAQ</p><p>请尝试刷新额QAQ</p><p>窗口五秒后自动消失QAQ</p>";
				setTimeout(function(){
					BFP_Core.domFinder("loading").style.display = "none";
				},5000);
				callback();
				clearInterval(waiting);
			}
		},1000);
	},
	offlineMode: function(){

	},
	// 获取一个URL
	getURL: function(urlName, noRandom){
		var targetURL = "";
		switch(urlName){
			case "panel":
				targetURL = "http://bilifixer.nmzh.net/BFP/2.html";
			break;
			case "CID":
				var page = BFP_Core.getValue("page");
				var aid = BFP_Core.getValue("aid");
				if(!Number.isInteger(Number.parseInt(page))){
					page = 1;
				}
				targetURL = "http://api.bilibili.com/view?type=json&appkey=0a99fa1d87fdd38c&id=" + aid + "&page=" + page;
			break;
			case "FLV":
				targetURL = "http://interface.bilibili.cn/playurl?type=flv&otype=json&appkey=0a99fa1d87fdd38c&platform=bilifixer&cid=" + BFP_Core.getValue("cid");
			break;
			case "MP4":
				targetURL = "http://interface.bilibili.cn/playurl?type=mp4&otype=json&appkey=0a99fa1d87fdd38c&platform=bilifixer&cid=" + BFP_Core.getValue("cid");
			break;
			case "FM":
				targetURL = "http://www.bilibili.com/video/av7/?cid=" + BFP_Core.getValue("cid");
			break;
			case "videoPlay1":
				targetURL = "http://static.hdslb.com/play.swf?" + BFP_Core.getPath();
			break;
			case "videoPlay2":
				targetURL = "https://secure.bilibili.tv/secure," + BFP_Core.getPath();
			break;
			case "videoPlay3":
				targetURL = "https://static-s.bilibili.tv/play.swf?" + BFP_Core.getPath();
			break;
			case "videoPlay4":
				targetURL = "https://static-s.bilibili.com/play.swf?" + BFP_Core.getPath();
			break;
		}
		return BFP_Core.toRandomURL(targetURL, noRandom);
	}
};
