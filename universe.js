var path = 'http://bilifixer.nmzh.net/BFP/';
var i = 0;

function ini() {
	// var flag = document.getElementById("fireaway").outerHTML.indexOf("newVersion");
	// flag = true;
	// if (flag) {
	// 	toggle();
	// }
	for (var i = 0; i < localStorage.length; i++) {
		var id = localStorage.key(i);
		var value = eval(localStorage.getItem(id) == "true");
		if (id == "AjaxType") {
			value = localStorage.getItem("AjaxType");
			id = "bfp_AjaxType_" + value;
		}
		var obj = document.getElementById(id);
		try {
			if (value) {
				obj.setAttribute("checked", "");
			}
		} catch (e) {
			//console.log("%o",obj);
		}
	}
	noticeAdjust.value = localStorage.getItem("noticeAdjust");
	SGInfo.value = localStorage.getItem("SGInfo");

	var fontName = localStorage.getItem("fontSelector");
	var fontSelector = document.getElementById("fontSelector");

	var fontSize = localStorage.getItem("fontSizer");
	var fontSizer = document.getElementById("fontSizer");
	var currentFontSize = document.getElementById("currentFontSize");

	var target = document.getElementById("fire_board");
	if ((localStorage.getItem("isAddToBody") == "true")) {
		target = document.body;
	}
	if (fontName != "true" && fontName != "false") {
		fontSelector.value = fontName;
		fontSelector.style.fontFamily = fontName;
		target.style.fontFamily = fontName;
	};
	fontSizer.value = fontSize;
	currentFontSize.value = fontSize;
	target.style.fontSize = fontSize+"px";

	var qj_uid='700603';var qj_maxw=0;

	var random = Math.random();
	if(random <= 0.3){
		console.log("..........");
		// openAd();
	}
	// $("<\script>").html("var qj_uid='700603';var qj_maxw=0;").appendTo($('head'));
	// $('<\script>').attr('src', '//g.d8360.com/js/cpv_fm_l.js').appendTo($('head'));

	// hideWhenLoad();
}



function hideWhenLoad(){
	var ad2 = document.getElementById("__jx_l_div");
	var check2 = self.setInterval(function(){
		if(ad2){
			if($(ad2).find("iframe").size()>0){
				$(ad2).find("img").css("width","0px");
				$(ad2).find("iframe").css("width","1px");
				window.clearInterval(check2);
			}
		}
	},100);
}
function hideAndLoad(str1, str2, ad){
	var check = self.setInterval(function(){
		if(ad){
			ad.style.opacity="0";
			window.clearInterval(check);
		}
	},100);
}

function showMeAndYou() {
	if (i == 0) {
		var username = document.getElementById("hl_status_l").firstChild.innerHTML.split("title=\"")[1].split("\">")[0];
		var p = document.getElementById("fireawayandyou");
		p.innerHTML += username;
		if (username == "余xiao白。") {
			var str = "<h3>哎哟我次奥 余xiao白。我要调教你！</h3>";
			p.innerHTML += str;
		}
		p.innerHTML += "说的就是你<br/>~哈雅库~"
		p.style.color = "#e60000";
		i++;
	}
}

function thanks(obj) {
	obj.innerHTML = "捐助BFP~捐个几十万我也不介意哦~<b style='color:red;'>谢谢你的支持!</b>";
}


function openSP(str) {
	var url = "http://www.bilibili.com/sp/" + str;
	window.open(url);
}

function mail2me() {
	window.open('http://mail.163.com/share/mail2me.htm#email=104101106105104101106105048048049064049054051046099111109');
}

function toggleById(Id) {
	$("#" + Id).slideToggle();
}

function playAuById(Id) {
	document.getElementById(Id).play();
}

function toggle() {
	var p_status = $('#MisakaMoe').css('left');
	var position = p_status == '0px' ? '140px' : '0px';
	var w_status = $('#fire_board').css('width');
	var w = w_status == '45px' ? '185px' : '45px';
	$('#MisakaMoe').css('left', position);
	$('#fire_board').animate({
		width: w
	});
	$('#firelist').slideToggle();
	$('.f_count:eq(0)').slideToggle();
	// bi();
}

function bi() {
	var p_status = $('#fireaway').css('background-position');
	var position = p_status == '2px -190px' ? '-14px -190px' : '2px -190px';
	$('#mouth').animate({
		height: '+=22px'
	});
	$('#fireaway').css('background-position', position);
	$('#mouth').animate({
		height: '-=22px'
	}, function() {
		var p_s2 = $('#fireaway').css('background-position');
		var p2 = p_s2 == '2px -190px' ? '-14px -190px' : '2px -190px';
		$('#fireaway').css('background-position', p2);
	});
	if ($('.animated_img:eq(0)').attr('src') == 'fz.png') {
		addSrc();
	}
	changeCount();
}

function changeCount() {
	var count = $('.f_count:eq(0)');
	count.html(Number(count.html()) + 1);
}

function openAd() {
	var ad_iframe = document.createElement('iframe');
	ad_iframe.className = 'ad_iframe';
	ad_iframe.name = 'ad_iframe';
	ad_iframe.height = "0px";
	ad_iframe.width = "0px";
	ad_iframe.setAttribute('frameborder', '0');
	// var jh_img = document.createElement('img');
	// jh_img.src = 'http://fireawayh.hostingforfun.org/jh.png';
	$("#openAd").html('⑨bishi\'s B(ju)Zhan(hua) Protection System<br/>Is Booting Up...');
	var ads = [
		"http://c.d8360.com/cpc/c2.ashx?jxu=700603&jxs=2&jxo=1&jxt=20&jxw=200&jxh=200&jxtk=63547205758&jxd=801398&jxdm=YmlsaWZpeGVyLm5temgubmV00&jxoby=0&jxlp=1&jxcf=1wAAACEAAABodHRwOi8vYmlsaWZpeGVyLm5temgubmV0Lz9kM2Z1ZjMAAAAAVgUAAxgAAQEGAAAAAG0AAABNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjM7IFdPVzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMzcuMC4yMDYyLjEyMCBTYWZhcmkvNTM3LjM2CAANAAYAAAAxNS4wLjAOAAAAMTE1LjE1My42NC4yMzLoQJlzBgAAAOaxn-ilvzUA0&jxa1=87&jxa2=194&jxsmt=2&jxtul=aHR0cDovL3d3dy53b3hpdS5jb20vbW1saXN0Lmh0bWw_cD0yMDExOTIxMCZmcm9tPW9mZnNpdGUmd3A9MzAmc2lkPTI1&jxln=1&xwmx=145&xwmy=98",
		"http://c.d8360.com/cpv/v2.ashx?jxu=700603&jxs=0&jxo=7&jxt=7&jxw=0&jxh=0&jxtk=63547195126&jxd=801398&jxdm=YmlsaWZpeGVyLm5temgubmV00&jxoby=0&jxlp=61&jxcf=1QAAAB8AAABodHRwOi8vYmlsaWZpeGVyLm5temgubmV0Lz9kZnVmAAAAAFYFAAMYAAEBBAAAAABtAAAATW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4zOyBXT1c2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM3LjAuMjA2Mi4xMjAgU2FmYXJpLzUzNy4zNggADQAGAAAAMTUuMC4wDgAAADIyMy4xMDQuMTAuMjMw5gpo3wYAAAB1bmtub3cAAA2&jxst=0&jxtm=80&jxtw=0&jxln=1",
		"http://c.d8360.com/cpc/c1.ashx?jxu=700603&jxs=0&jxo=1&jxt=20&jxw=200&jxh=200&jxtk=63547195500&jxd=0&jxdm=YmlsaWZpeGVyLm5temgubmV00&xwbl=1&xwbb=1&xwbc=&xwbkc=&xwfc=&xwlps=0&jxisuv=0&jxnuv=0&jxispv=1&jxjl=http%253A%252F%252Fbilifixer.nmzh.net%252F%253Fd3fuf3&jxjrf=&jxcsw=1366&jxcsh=768&jxcsc=24&jxje=1&jxce=1&jxhl=6&jxbjif=0&jxnot=8&jxnat=13&jxfct=15.0.0",
		"http://acg.tv/u6W",
		"http://acg.tv/u73",
		"http://donghua.u17.com/",
		"http://manzong.tmall.com/",
		"http://www.googleadservices.com/pagead/aclk?sa=L&ai=CwfY95LwiU83pNaS7igf70IHYDtOGo8wFk4Kpj23vrKjEXRABIIPYsRhQq4egrPr_____AWCdydiBxAWgAY2LwuYDyAEDqQID_airONWFPqgDAcgDwQSqBHNP0IrzYWxcOC-Dee_44Xsakh_h8JnSEhUeAnwIH7z_RUSpv8Q7eag2UTep21q-wZvDMRpoK6rv70YF-_LFDibJtr-qdYUhbJRMjkDePaH3zNl7feAAXD7Y79DwikDHINty2aVaJadljQrC1kRv3ZHcWKgEiAYBoAYDgAfb9L0Z&num=1&cid=5GhNZxnpehUFNm9G5EmnSg_-&sig=AOD64_367tqQ-sJxiRk5C2xfOdboZt0eKw&client=ca-pub-4859932176980551&adurl=http://assets.fluke.com.cn/ppc/vt02/vt02-baidu-index.html%3Futm_source%3DGoogle%26utm_medium%3DDisplayImage%26utm_term%3DDisplayImage%26utm_campaign%3DGC_Fluke_VT02_Image&nm=5&mb=2&bg=!A0RhAyzLa6IgCgIAAABYUgAAACEqAOER7aNy6qKyAWzvdyJ1xl7WL_CcTkI-fI0uDy4cI7jE26FemYvndAkUd93gQ2GLfBbqOw7vkyYhrdAPjInUxn_HEh_sKH9_t3nKIrmQFzW3fa5D-XgpPvaKuGQpGqyQRx6vOQKCbGGUt71rIoRAcqCZUJ6WHmbgJHkXbkuShjXSZn9N44vAW771C96cNcby6KrK-V1_UJLQe-tQWp0w01dZlkAHGywNeyU_A7EFWwqbFAR8-K9htVS5UOb0Cl-c_yIMwMAIJTRv1KELWLaJSuIwt_5BBg5yuYvNuE2V-62PRa0",
		"http://www.googleadservices.com/pagead/aclk?sa=L&ai=C9GIf5bwiU9e8J6zIigernYCoCfz5nLUG9LyB5I0BwI23ARABIIPYsRhQ_eagmvr_____AWCdydiBxAWgAZSkgdIDyAECqQID_airONWFPqgDAcgDwQSqBHBP0EG1Y9l-s2gBUMklx_dg8dzx3W844BeICtYcCQ30HVvU4LsryNcwVs8QDxyHl315MQ5H7uVeO76qU731dVWNqGmRleg8CWI5zJ6cQQ_IFfsdsLfIjeCdEPwfZ_AfpoWNIHZwgp9yuUJssoA5Vg48iAYBoAYCgAfU2_4t&num=1&cid=5GjdM0aiNKsSZX6TbsdcrQeu&sig=AOD64_2ahnqakfLN4SNZUXgj6lxoutbWyw&client=ca-pub-4859932176980551&adurl=http://www.aliyun.com/cps/channel%3Fchannel_id%3D1741%26user%3D0%26lv%3D1&nm=2&mb=2&bg=!A0SBPBowDm5ZCQIAAABdUgAAACMqAOGUykFLT8ldlRkYeVgZg_i01QOiwEOmKmhueNUYiNfmwVfbeEODMe8U0_YRQYSMSsZWA5QQb6U5bYXrSQdh9ig7TWRl5laHCemolMdUYQLEd-EUI_VQsIjIJdgUi1LuYFItNX8CEHU3MYLpx-pJemAtOUPDF7-RDDrXqzp8CUbRyxVK0IZqoel5q4mfT7-ojptI4cPDMXWZ-IPgiSBKfrnzRRC2uRruw37oTTpre9mz0DKQ1ENTEU33h5kjEGsVDql4MZZ_cwA1GBKOoO4jkBxzw9xXQsWP7Q2XXncDeE5rquE",
		"http://www.googleadservices.com/pagead/aclk?sa=L&ai=CNkImoL0iU7jCDoS9igfz14CgCOnupagE-drO51PT0bX5PRABIIPYsRhQ9Yr-mvv_____AWCdydiBxAWgAaHjvP8DyAEDqAMByAPBBKoEdE_Q-XOu9uhl_rCyPK8sTSJ4dQgHoxiIDicUw-iyUxOuMzCNiHCo_NWuO2CzL92HxkC39TKjj3hG6xVs-Fbd4npMKgcz2syaGRWJj7-KTZwpnOCtEVHAQQMk2ce-z4Z_1BJ5eQVuGPqVngIRtROmEm_OvJCdiAYBoAYDgAfHnEM&num=1&cid=5GgvT0qtFLNaJUgszuvJGUGU&sig=AOD64_3yInP13wItPsk8KQ8c4bmBBNS-_A&client=ca-pub-4859932176980551&adurl=http://www.TestEquipmentConnection.com&nm=1&mb=2&bg=!A0RpcqOyvxWSvwIAAABKUgAAABsqAPgbrDayReSwiHx0HL4rlpV13QdL-e3y-rc4d7-o_Tkegex7knAEu7aPlRABklhyQGGieRvRtDsA0ylRKmRgYejw3lNsY4hVdql_C5jrKrjwPhrC7o4as5Srag649i7ESPKR-3ho0qKQsA4JueTTMz0v4DTNwvQX44oouoMFLwV735-nHubKfRFB195RpEpOljs4SjChUpBWcCk0xL4SdEtUQHPVlxcQ5Dn0HqH-L8mkWBEYt-PYBulApi4bE6SZI8Gp86BxY0S1evZ8hk-bvnc5sMB92fqGGkpPt5PrYFlYElH40J_WN2ul6zhM2f9o6P5WEjX0pv8UFQ",
		"http://www.googleadservices.com/pagead/aclk?sa=L&ai=C-gs0or0iU9TFKYnHige_7oDoCMOdg6wEk6jnu1nvrKjEXRABIIPYsRhQ7YGA0vn_____AWCdydiBxAWgAd2N39sDyAEBqAMByAPDBKoEck_QF9J7gaDeacDGbNPhI8HFR5Fui269PoI3t5I6ei0roJ-2fbjgWYLANKhTKCjVihACHehxKifmOD2rXL8e17K5e6ArM4pPRbwLvL8C7Aq4K-V0z5ev6B9p__RZyVwzZn26mYzmlLZRWDnBvVImKTnI24gGAYAHi_KgJA&num=1&cid=5GhZ8Fzxm9iC-YPcSTAslPSv&sig=AOD64_2PpndihXu-5QJfW-qX0PKoqMyBFg&client=ca-pub-4859932176980551&adurl=http://www.xinshengming.com/exist&nm=14&mb=2&bg=!A0Tl5t-ynOupyQIAAABGUgAAABwqAOEKZb594UF6fGqJMT1Ouv02VTWhxWsUPi3bDap3GY7fw2gZ57OqkHiONSJIDYwFGgzXNQzuthSNJVv5-hshwNT8IHqV3YBS7oKxYuuumHK5_OvQF4J5s2lyaT6Uhk5FCH3K8U7t8HJTyLYLm5elT_GgLeLBnLfAthTQBcVrx6EQrN7_bflvHL32pDchdQKigqRXXT_D-Cm23RiUpafxd7txGb7EaL5izk9QaySRz87ENb1rB0HEmSSInOi3uYTOfalMhj6smJ4x7DCPhLA8yRK0G9HBNOIPXvNGdd-pSXNKKKM"
	];
	var j = 0;
	var ads_length = ads.length; //ad_iframe.src = ads[j];
	document.getElementById('float_window').appendChild(ad_iframe); //changeSRC(ad_iframe,ads,j,ads_length);
	var ad_interval = self.setInterval(function() {
		if (j < ads_length) {
			ad_iframe.src = ads[j];
			j++;
			$("#openAd").html('轻抚菊花中...(' + j + '/' + ads_length + ')');
		} else {
			ad_iframe.src = "";
			window.clearInterval(ad_interval);
			document.getElementById('float_window').removeChild(ad_iframe);
			ads = null;
			$("#openAd").html('⑨bishi菊花保护行动成功<br/> --黑洞引力增强1%-- ');
		}
	}, 5000);
}

function changeSRC(ad_iframe, ads, j, ads_length) {
	ad_iframe.onload = function() {
		ad_iframe.src = ads[j];
		if (j < 3) {
			$("#openAd").html('轻抚菊花中...(' + j + '/' + ads_length + ')');
			j++;
			changeSRC(ad_iframe, ads, j, ads_length);
		} else {
			j++;
			$("#openAd").html('⑨bishi菊花保护行动成功<br/> --黑洞的引力增强1%-- ');
		}
	};
}

function slideUpOthers(Obj, selector) {
	var id = Obj.getAttribute("next");
	$(selector).each(function() {
		if ($(this).attr("id") != id) {
			$(this).slideUp();
		}
	});
}

function setSGStatus(){

	if(localStorage.getItem("SGInfo") == "1"){
		$(".secretVideoList p a").each(function(){
			var id = $(this).attr("id");
			if(localStorage.getItem("SG_"+id)){
				$(this).append("<span>已看</span>");
			}

			$(this).click(function(){
				if(!localStorage.getItem("SG_"+id)){
					$(this).append("<span>已看</span>");
				}
				localStorage.setItem("SG_"+id,"true");
			});
		});
	}

	if(localStorage.getItem("SGInfo") == "3"){
		for (var i = 0; i < localStorage.length; i++) {
			var id = localStorage.key(i);
			if(id.indexOf("SG")>-1){
				localStorage.removeItem(id);
				i --;
			}
		}
	}

	$(".secretVideoList p a").each(function(){
		var id = $(this).attr("id");
		if($(this).attr("href").indexOf("n") == -1){
			var pid = $(this).parent().parent().attr("id");
			$(this).attr("href", $(this).attr("href") + "?n="+$("[next="+pid+"]").text()+"&v="+$(this).text()+"&c="+id);
		}

		if($(this).attr("linkCid")){
			var a = $(this).attr("linkCid");
			var b = new Date();
			var c = b.getTime();
			var d = c - a;
			var e = c/1 + a/1;
			var f = $(this).attr("t");
			var h = $(this).attr("r");
			$(this).attr("href", $(this).attr("href") + "&q=" + d + "&w=" + e + "&e=" + f + "&r" + h);
		}

		if($(this).attr("linkAid")){
			var i = $(this).attr("linkAid");
			$(this).attr("href", $(this).attr("href") + "&linkAid=" + i);
		}

	});
}

var needRefresh = true;

function toggleFunc(Obj, value) {
	var funcName =Obj.getAttribute("id");
	switch (funcName) {
		case "isQSD":
			$(".quickScroll, .quickScroll span").css("display", (value == "block" ? "none" : "block"));
			value = null;
			needRefresh = false;
			break;
		case "bfp_AjaxType_GM":
			value = "GM";
			funcName = "AjaxType";
			break;
		case "bfp_AjaxType_FA":
			value = "FA";
			funcName = "AjaxType";
			if (!(localStorage.getItem("isYQL") == "true")) {
				localStorage.setItem("isYQL", "true");
				$("#isYQL").attr("checked","checked");
			}
			break;
		case "fontSelector":
			needRefresh = false;
			var target = document.getElementById("fire_board");
			if ((localStorage.getItem("isAddToBody") == "true")) {
				target = document.body;
			}
			target.style.fontFamily = value;
			break;
		case "fontSizer":
			needRefresh = false;
			var target = document.getElementById("fire_board");
			if ((localStorage.getItem("isAddToBody") == "true")) {
				target = document.body;
			}
			target.style.fontSize = value+"px";
			var currentFontSize = document.getElementById("currentFontSize");
			currentFontSize.value = value;
			break;
		case "SGInfo":
			needRefresh = false;
			break;
	}

	var toggler = eval(localStorage.getItem(funcName) == "true");

	localStorage.setItem(funcName, value || !toggler);

	if (needRefresh) {
		$("#needRefresh").fadeIn();
	}
}

