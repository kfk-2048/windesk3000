$(function() {
	//input 控制float输入
	$(".in").keyup(function() {
		var v = this.value;
		var matches = /\d+(\.\d*)?/.exec(v);
		if(matches && matches[0] != undefined)
			this.value = matches[0];
		else
			this.value = "";
	});
	//左侧tab切换
	$('.jtab li').on('click', function() {
		$('.jtab .active').removeClass('active');
		$(this).addClass('active');
		if(!$(".detailR").is(":hidden")) {
			$(".detailR").hide(500);
		}
		jsdetail.change($(this).index());
	});
});
//买入价：P1
//买入数：P2
//补仓价：P3
//补仓数：P4
//手续费：C1
//过户费：C2
//印花税：D3
//通信费：C3
var jsdetail = {
	currIndex: 0,
	content: '',
	isclick: 0,
	change: function(i) {

		this.isclick = 0;
		if(this.currIndex == i) return;
		if(i == 3) {
			//			this.clear();
			this.currIndex = i;
			$('#cent').hide();
			$('.d').show();
			return;
		}
		if(this.currIndex == 3) {
			$('#cent').show();
			$('.d').hide();
		}

		this.content = $('.content_body');
		var detailR = $('.detailR');
		if(i == 0) {
			this.content.find('#T3').html('补仓价');
			this.content.find('#T4').html('补仓数');
			this.showBJ();

			detailR.find('#S1').html('买入成本价: ');
			detailR.find('#S3').html('补仓后成本价: ');
			detailR.find('#S4').html('补仓买入成交金额: ');

		} else if(i == 1) {
			this.content.find('#T3').html('减仓价');
			this.content.find('#T4').html('减仓数');
			this.showBJ();

			detailR.find('#S1').html('买入成本价: ');
			detailR.find('#S3').html('减仓后成本价: ');
			detailR.find('#S4').html('减仓卖出成交金额: ');
		} else if(i == 2) {
			this.content.find('#T1').html('初买价');
			this.content.find('#T2').html('初买数');
			this.content.find('#T3').html('卖出价');
			this.content.find('#H1').hide();
			this.content.find('#H2').hide();
			this.content.find('#H3').hide();
			this.content.find('#xx').hide();

			detailR.find('#S1').html('保本成本价: ');
			detailR.find('#S3').html('卖出盈亏: ');
			detailR.find('#S4').html('卖出成交金额: ');

		}

		this.clear();
		this.currIndex = i;

	},
	showBJ: function() {
		if(this.content.find('#H1').is(":hidden"))
			this.content.find('#H1').show();
		if(this.content.find('#H2').is(":hidden"))
			this.content.find('#H2').show();
		if(this.content.find('#H3').is(":hidden"))
			this.content.find('#H3').show();
		if(this.content.find('#xx').is(":hidden"))
			this.content.find('#xx').show();
	},
	clear: function() {
		this.content.find('#P1').val('');
		this.content.find('#P2').val('');
		this.content.find('#P3').val('');
		this.content.find('#P4').val('');

		this.content.find('#D1').val('');
		this.content.find('#D2').val('');

		this.content.find('.nxt1').html('');
		this.content.find('.nxt2').html('');
		this.content.find('.nxt3').html('');
		this.content.find('.nxt4').html('');
		this.content.find('.nxt5').html('');
		this.content.find('.nxt6').html('');
		this.content.find('.nxt7').html('');
		this.content.find('.nxt8').html('');
		this.content.find('.nxt9').html('');
		this.content.find('.nxt10').html('');
		this.content.find('.nxt11').html('');
		this.content.find('.nxt12').html('');
		this.content.find('.nxt13').html('');
		this.content.find('.nxt14').html('');
	},
	jsresult: function() {
		
		if(this.currIndex == 2) {
			this.qcres();
			return;
		}
		var content = $(".content_body");
		var P1 = parseFloat(content.find('#P1').val());
		if(isNaN(P1)) {
			return;
		}
		var P2 = parseFloat(content.find('#P2').val());
		if(isNaN(P2)) {
			return;
		}
		var P3 = parseFloat(content.find('#P3').val());
		if(isNaN(P3)) {
			return;
		}
		var P4 = parseFloat(content.find('#P4').val());
		if(isNaN(P4)) {
			return;
		}
		if(this.currIndex==1 && P2==P4){
			alert('请到【清仓】中计算该结果');
			return;
		}
		var R2 = P2 + P4;
		var R1 = (P1 * P2 + P3 * P4) / R2;
		if(this.currIndex == 1) {
			R2 = P2 - P4;
			R1 = (P1 * P2 - P3 * P4) / R2;
		}

		content.find('#D1').val(R1.toFixed(2));
		content.find('#D2').val(R2);
		this.isclick = 1;
	},
	resultQs: function() {
		var content = $(".detailR");
		content.find('#S1').html('保本成本价: ');
		//		content.find('#S2').html('保本成本价:');
		content.find('#S3').html('卖出盈亏: ');
		content.find('#S4').html('卖出成交金额: ');
		content.find('#S5').show();
	},
	qcres: function() {
		var num = 21;
		var content = $(".content_body");

		var P1 = parseFloat(content.find('#P1').val());
		if(isNaN(P1)) {
			return;
		}
		var P2 = parseFloat(content.find('#P2').val());
		if(isNaN(P2)) {
			return;
		}
		var P3 = parseFloat(content.find('#P3').val());
		if(isNaN(P3)) {
			return;
		}

		var P0 = P1,
			V = V0 = P2,

			t = parseFloat(0.001),
			y = parseFloat(0.3) / 100,
			bonus = 0,
			dt = 0,
			P = 0;
		if(num == 23) {
			b = 0;
		} else {
			b = parseFloat(1);
		} //过户费

		if(isNaN(b)) {
			b = 0;
		}
		var bonusList = [];

		var F1 = P1 * P2;
		var F2 = Math.max(F1 * y, 5); //手续费
		var F3 = Math.max((P2 / 1000), 1); //过户费
		console.log("买进金额：" + (F1 + F2 + F3));

		P = this.getPriceA(P0, V0, V, bonus, dt, t, y, b);
		P = this.Formatx(P); //保本成本价
		var G1 = P * P2; //卖出成交金额
		var G2 = Math.max(G1 * y, 5); //手续费
		var G3 = Math.max((P2 / 1000), 1); //过户费
		var G4 = G1 * t; //印花税
		console.log("保本成本价" + P);
		console.log("卖出成交金额" + G1);
		console.log("手续费" + G2);
		console.log("过户费" + G3);
		console.log("印花税" + G4);
		console.log("总计费用" + (G1 - G2 - G3 - G4));

		var K1 = P2 * P3;
		var K2 = Math.max(K1 * y, 5); //手续费
		var K3 = Math.max((P2 / 1000), 1); //过户费
		var K4 = K1 * t; //印花税
		console.log('-----------------------');
		console.log(K2);
		console.log(K3);
		console.log(K4);
		console.log("卖出盈亏" + (-F2 - F3 - K2 - K3 - K4 - K1));
		console.log("总计费用" + (K1 - K2 - K3 - K4));

		content.find('.nxt1').html(P + '元');
		content.find('.nxt2').html(G1.toFixed(2) + '元');
		content.find('.nxt3').html(G2.toFixed(2) + '元');
		content.find('.nxt4').html(G3.toFixed(2) + '元');
		content.find('.nxt5').html(0.00 + '元');
		content.find('.nxt6').html(G4.toFixed(2) + '元');
		content.find('.nxt7').html((G1 - F3 - G2 - G3 - G4).toFixed(2) + '元');
		content.find('.nxt8').html((-F1 - F2 - F3 +K1 - K2 - K3 - K4).toFixed(2) + '元');
		content.find('.nxt9').html(K1.toFixed(2) + '元');
		content.find('.nxt10').html(K2.toFixed(2) + '元');
		content.find('.nxt11').html(K3.toFixed(2) + '元');
		content.find('.nxt12').html(0.00 + '元');
		content.find('.nxt13').html(K4.toFixed(2) + '元');
		content.find('.nxt14').html((K1 - K2 - K3 - K4).toFixed(2) + '元');
		//		content.find('.nxt15').html((R5 - R2 - R3 - R4.toFixed(2) - R1).toFixed(2) + '元');
		$('.detailR').show(500);

	},
	bjcres: function() {
		var content = $(".content_body");

		var P1 = parseFloat(content.find('#P1').val());
		if(isNaN(P1)) {
			return;
		}
		var P2 = parseFloat(content.find('#P2').val());
		if(isNaN(P2)) {
			return;
		}
		var P3 = parseFloat(content.find('#P3').val());
		if(isNaN(P3)) {
			return;
		}
		var P4 = parseFloat(content.find('#P4').val());
		if(isNaN(P4)) {
			return;
		}		
		var C1 = parseFloat(content.find('#C1').val());
		if(isNaN(C1)) {
			return;
		}
		var C2 = parseFloat(content.find('#C2').val());
		if(isNaN(C2)) {
			return;
		}
		var C3 = parseFloat(content.find('#C3').val());//通信费
		if(isNaN(C3)) {
			return;
		}		
		var K1 = parseFloat(0.3) / 100;//手续费比例
		var F1 = P1 * P2;
		var F2 = Math.max(F1 * K1, 5); //手续费
		var F3 = Math.max((P2 / 1000) * C2, 1); //过户费

		var F4 = P3 * P4;
		var F5 = Math.max(F4 * K1, 5); //手续费
		var F6 = Math.max((P2 / 1000) * C2, 1); //过户费
		var F7 = F4 * 0.001;//印花税
		var C1 = F2+F3+C3+F1;
//		var C2 = F5+F6+C3+F4;//补仓
		var C2 =this.currIndex==0?(F5+F6+C3+F4):(F4-F5-F6-F7-C3);//减仓
		var C4 = ((C1+C2)/(P2+P4)).toFixed(3);

		content.find('.nxt1').html((C1/P2).toFixed(2) + '元');
		content.find('.nxt2').html(F1.toFixed(2) + '元');
		content.find('.nxt3').html(F2.toFixed(2) + '元');
		content.find('.nxt4').html(F3.toFixed(2) + '元');
		content.find('.nxt5').html(C3.toFixed(2) + '元');
		content.find('.nxt6').html(0 + '元');
		content.find('.nxt7').html((-C1).toFixed(2) + '元');
		//content.find('.nxt8').html(C4 + '元');//补仓
		debugger;
		var T;
		if(this.currIndex==0)
			T = C4;
		else
			T = ((C1-C2)/(P2-P4)).toFixed(2);
		content.find('.nxt8').html(T + '元');//减仓
		content.find('.nxt9').html(F4.toFixed(2) + '元');
		content.find('.nxt10').html(F5.toFixed(2) + '元');
		content.find('.nxt11').html(F6.toFixed(2) + '元');
		content.find('.nxt12').html(C3.toFixed(2) + '元');
		content.find('.nxt13').html((this.currIndex==0?0:F7).toFixed(2) + '元');
//		content.find('.nxt14').html((-C2) + '元');//补仓
		content.find('.nxt14').html((this.currIndex==0?(-C2):(C2)).toFixed(2) + '元');//减仓
		//		content.find('.nxt15').html((R5 - R2 - R3 - R4.toFixed(2) - R1).toFixed(2) + '元');
		$('.detailR').show(500);
	},
	detailShow: function() {
		if(!$(".detailR").is(":hidden")) {
			$(".detailR").hide(500);
			return;
		}
		if(this.isclick == 1){
			this.bjcres();
		}
			
	},
	getPriceA: function(P0, V0, V, bonus, dt, t, y, b, max) {
		max = max || 5;
		//累加
		function calc(P, P0, V0, V, bonus, dt, t, y, b, max) {
			return(P0 * V0 + Math.max(max, P0 * V0 * y) + (b != 0 ? Math.max(1, V0 * b / 1000) : 0) +
				P * V * t + Math.max(max, P * V * y) + (b != 0 ? Math.max(1, V * b / 1000) : 0) - bonus + dt
			) / P;
		}

		//初始参数
		var UP = P0 * 50,
			DOWN = 0.001,
			limit = 0.0001,
			X0 = (UP - DOWN) / 2,
			Vt = 0;

		do {
			Vt = calc(X0, P0, V0, V, bonus, dt, t, y, b, max);
			//取中值	
			if(Vt < V) {
				UP = X0;
				X0 = (UP + DOWN) / 2;
			} else {
				DOWN = X0;
				X0 = (UP + DOWN) / 2;
			}
		} while ((Math.abs(Vt - V) > 0.001) && (Math.abs(UP - DOWN) > limit))

		return X0;
	},
	Formatx: function(myFloat) {
		return Math.round(myFloat * Math.pow(10, 2)) / Math.pow(10, 2);
	}

};