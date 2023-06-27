/**
 * Created by lzc on 2017/6/19.
 */

var temp=0;
function DataDeal(data16) {
    temp = "DataDeal:" + data16;
    alert(temp);
}

function Sleeper() {
    alert("进入延时函数");
     var self = this;

     self.step    = 0;

     self.actions = [];
     self.values = [];



     self.push = function(func, value) {
         self.actions.push(func);
         self.values.push(value);
         return self;
     }
     self.run_next = function() {
         if (self.step < self.actions.length) {
             var action = self.actions[self.step];
             action(self.values[self.step]);
             self.step++;

             setTimeout(self.run_next, 10);
         }
     }
     self.run = function() {
         self.run_next();
     }
     return self;
}

	 //初始化图片
    var arr = ['/static/LungMeter/img/00.jpg','/static/LungMeter/img/01.jpg',
        '/static/LungMeter/img/02.jpg', '/static/LungMeter/img/03.jpg',
        '/static/LungMeter/img/04.jpg', '/static/LungMeter/img/05.jpg',
        '/static/LungMeter/img/06.jpg', '/static/LungMeter/img/07.jpg',
        '/static/LungMeter/img/08.jpg', '/static/LungMeter/img/09.jpg',
        '/static/LungMeter/img/10.jpg', '/static/LungMeter/img/11.jpg',
        '/static/LungMeter/img/12.jpg', '/static/LungMeter/img/13.jpg',
        '/static/LungMeter/img/14.jpg', '/static/LungMeter/img/15.jpg',
        '/static/LungMeter/img/16.jpg', '/static/LungMeter/img/17.jpg',
        '/static/LungMeter/img/18.jpg', '/static/LungMeter/img/19.jpg',
        '/static/LungMeter/img/20.jpg', '/static/LungMeter/img/21.jpg',
        '/static/LungMeter/img/22.jpg', '/static/LungMeter/img/23.jpg',
        '/static/LungMeter/img/24.jpg', '/static/LungMeter/img/25.jpg'];

    var oImage = new Image();

    var iCur = 0;

function xunlei() {
   oImage.src = arr[iCur];

    oImage.onload = function() {
        iCur++;
        if (iCur < arr.length) {
                 xunlei();    //递归
        }
    }
}

    /**
    * 更蓝牙数据接收图片变
    * @param k
    * @param v
    */
    function showImg(v){
        alert("进入切换图片函数");
    var img = v/1000;
        var i = parseInt(img);
        $("#showImg").attr("src",arr[i]);
    }



$(document).ready(function() {
    alert("开始啦");
    xunlei();
    alert("加载完成");
    InitWX(DataDeal);
    alert("数据获取完成");

    var sleeper = new Sleeper();
    sleeper.push(showImg, temp);
    sleeper.run();
});