var viewSize = (function(){

    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;

    if (typeof pageWidth != 'number') {
        if (document.compatMode == 'CSS1Compat') {
            pageHeight = document.documentElement.clientHeight;
            pageWidth = document.documentElement.clientWidth;
        } else {
            pageHeight = document.body.clientHeight;
            pageWidth = document.body.clientWidth;
        }
    };
    if(pageWidth >= pageHeight){
        pageWidth = pageHeight * 360 / 640;
    }
    pageWidth = pageWidth >  414 ? 414 : pageWidth;
    pageHeight = pageHeight > 736 ? 736 : pageHeight;

    return {
        width: pageWidth,
        height: pageHeight
    };

})();

(function(){
    var lastTime = 0;
    var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;

    var prefix;
//通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
    for( var i = 0; i < prefixes.length; i++ ) {
        if ( requestAnimationFrame && cancelAnimationFrame ) {
            break;
        }
        prefix = prefixes[i];
        requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
        cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
    }

//如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
    if ( !requestAnimationFrame || !cancelAnimationFrame ) {
        requestAnimationFrame = function( callback, element ) {
            var currTime = new Date().getTime();
            //为了使setTimteout的尽可能的接近每秒60帧的效果
            var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
            var id = window.setTimeout( function() {
                callback( currTime + timeToCall );
            }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };

        cancelAnimationFrame = function( id ) {
            window.clearTimeout( id );
        };
    }

//得到兼容各浏览器的API
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
})()

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image(),
    k= viewSize.height / 600,
    canClick,
    gameover,
    canCount,
    isStarted,
    timer,
    ground,
    bird,
    score,
    Pies,
    startBtn = document.getElementById('restart');
//导入图像
img.onload = start;
img.src = '/static/img/flappybird.png';
//设置画布宽高
canvas.width = viewSize.width;
canvas.height = viewSize.height;
init();
function init(){
    canClick = true;
    gameover = false;
    canCount = true;
    isStarted = false;
    startBtn.style.display = 'none';
    ground = new Ground();
    bird = new Bird();
    score = new Score();
    Pies = [];
    createPie();
}
function destroy(){
    ground = null;
    bird = null;
    score = null;
    for(var i = 0, len = Pies.length; i < len; i++){
        Pies[i] = null;
    }
    Pies = [];
}
/**
 * 开始游戏
 */
function start(){
    check();
    if(gameover){
        console.log(1)
        ctx.drawImage(img, 170, 990, 300, 90, Math.ceil(viewSize.width * 0.5 - k * 277 * 0.5), Math.ceil(200 / 800 * viewSize.height), 277 * k, 75 * k)
        ctx.drawImage(img, 550, 1005, 160, 90, Math.ceil(viewSize.width * 0.5 - k * 160 * 0.5), Math.ceil(400 / 800 * viewSize.height), 160 * k, 90 * k)
        startBtn.style.width = 160 * k + 'px';
        startBtn.style.height = 90 * k + 'px';
        startBtn.style.left = Math.ceil(viewSize.width * 0.5 - k * 160 * 0.5) + 'px';
        startBtn.style.top = Math.ceil(400 / 800 * viewSize.height) + 'px';
        startBtn.style.display = 'block';
        cancelAnimationFrame(timer);
        destroy();
    }else{
        //清除
        ctx.clearRect(0,0,viewSize.width,viewSize.height);
        //画背景
        ctx.drawImage(img, 0, 0, 800, 600, 0, 0, Math.ceil(k * 800), viewSize.height);
        if(isStarted){
            //第一组水管出左边屏幕，移除水管
            if(Pies[0].canX <= -Pies[0].canW && Pies.length == 4){
                Pies[0] = null;
                Pies[1] = null;
                Pies.shift();
                Pies.shift();
                canCount = true;
            }
            //画小鸟
            bird.draw();
            //创建水管
            if(Pies[0].canX <= 0.5 * (viewSize.width - Pies[0].canW) && Pies.length == 2){
                createPie();
            }
            //画水管
            for(var i = 0, len = Pies.length; i < len; i++){
                Pies[i].draw();
            }

        }else{
            //画ready
            ctx.drawImage(img, 170, 900, 300, 90, Math.ceil(viewSize.width * 0.5 - k * 277 * 0.5), Math.ceil(200 / 800 * viewSize.height), 277 * k, 75 * k)
            ctx.drawImage(img, 170, 1150, 230, 150, Math.ceil(viewSize.width * 0.5 - k * 200 * 0.5), Math.ceil(400 / 800 * viewSize.height), 200 * k, 150 * k)
        }
        //画分数
        score.draw();
        //画地板
        ground.draw();
        //设置定时器
        timer = requestAnimationFrame(start);

    }

};
/**
 * 检查是否碰撞、得分
 */
function check(){
    function isOverLay(rect1, rect2){
        var flag = false;
        if(rect1.top > rect2.bottom || rect1.bottom < rect2.top || rect1.right < rect2.left || rect1.left > rect2.right) flag = true;
        return !flag;
    }
    //地板碰撞
    if(bird.canY[0] + bird.canH[0] >= ground.canY){
        console.log(viewSize)
        console.log(bird.canY[0],bird.canH[0],ground.canY)
        gameover = true;
        return;
    }
    //水管碰撞
    var birdRect = {
        top: bird.canY[0],
        bottom: bird.canY[0] + bird.canH[0],
        left: bird.canX[0],
        right: bird.canX[0] + bird.canW[0]
    };
    for(var i = 0, len = Pies.length; i < len; i++){
        var t = Pies[i];
        var pieRect = {
            top: t.canY,
            bottom: t.canY + t.canH,
            left: t.canX,
            right: t.canX + t.canW
        };
        if(isOverLay(birdRect,pieRect)){
            gameover = true;
            return;
        }
    }
    //是否得分
    if(Math.floor(bird.canX[0]) > Math.floor(Pies[0].canX + Pies[0].canW) && canCount){
        canCount = false;
        score.score++;
    };
}
/**
 * 点击
 */
document.ontouchstart = document.onmousedown = function(e){
    if(gameover) return;
    if(isStarted){
        if(canClick){
            for(var i = 0; i < 3; i++){
                bird.y[i] = bird.canY[i];
            }
            bird.t = 0;
        }else{
            return;
        }
    }else{
        isStarted = true;
    }
    var e = e || window.event;
    if(e.preventDefault){
        e.preventDefault();
    }else{
        e.returnValue = false;
    }
};

startBtn.ontouchstart = startBtn.onmousedown = function(e){
    var e = e || window.event;
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = false;
    }
    init();
    timer = requestAnimationFrame(start);
}
/**
 * 分数类
 */
function Score(){
    this.imgX = 900;
    this.imgY = 400;
    this.imgW = 36;
    this.imgH = 54;
    this.canW = Math.ceil(36 * k);
    this.canH = Math.ceil(54 * k);
    this.canY = Math.ceil(50 / 800 * viewSize.height);
    this.canX = Math.ceil(viewSize.width / 2 - this.canW / 2);
    this.score = 0;
}
Score.prototype.draw = function(){
    var aScore = ('' + this.score).split('');
    var len = aScore.length;
    this.canX = 0.5 * (viewSize.width - (this.canW + 10) * len + 10);
    for(var i = 0; i < len; i++){
        var num = parseInt(aScore[i]);
        if(num < 5){
            var imgX = this.imgX + num * 40;
            var imgY = 400;
        }else{
            var imgX = this.imgX + (num - 5) * 40;
            var imgY = 460;
        }
        var canX = this.canX + i * (this.canW + 2);
        ctx.drawImage(img, imgX, imgY, this.imgW, this.imgH, canX, this.canY, this.canW, this.canH);
    }
};
/**
 * 小鸟类
 */
function Bird(){
    this.imgX = [170, 222, 275];
    this.imgY = [750, 750, 750];
    this.imgW = [34, 34, 34];
    this.imgH = [24, 24, 24];
    this.index = 2;
    this.count = 0;
    this.step = 1;
    var canX = Math.ceil(110 / 450 * viewSize.width);
    this.canX = [canX, canX, canX];
    var canY = Math.ceil(380 / 800 * viewSize.height);
    this.canY = [canY, canY, canY];
    var canW = Math.ceil(34 * k);
    this.canW = [canW, canW, canW];
    var canH = Math.ceil(24 * k);
    this.canH = [canH, canH, canH];
    this.t = 0;
    this.y = [canY, canY, canY];
}
Bird.prototype.draw = function(){
    var index = this.index;
    //翅膀拍动
    this.count++;
    if(this.count == 6){
        this.index += this.step;
        this.count = 0;
    }
    if((this.index == 2 && this.step == 1) || this.index == 0 && this.step == -1) this.step = - this.step;
    //计算垂直位移，使用公式 y = a * t * (t - c)
    var c = 0.7 * 60;
    var minY = - 85 * viewSize.height / 800;
    var a = -minY * 4 / (c * c);
    var dy = a * this.t * (this.t - c);

    if(this.y[0] + dy < 0){
        canClick = false;
    }else{
        canClick = true;
    }
    for(var i = 0; i < 3; i++){
        this.canY[i] = this.y[i] + Math.ceil(dy);
    }
    this.t++;
    ctx.drawImage(img, this.imgX[index], this.imgY[index], this.imgW[index], this.imgH[index], this.canX[index], this.canY[index], this.canW[index], this.canH[index])

};
/**
 * 水管基类
 */
function Pie(){
    this.imgY = 751;
    this.imgW = 52;
    this.imgH = 420;
    this.canX = viewSize.width;
    this.canW = Math.ceil(80 / 450 * viewSize.width);
    this.canH = Math.ceil(this.canW * 420 / 52);
}
/**
 * 上水管类
 */
function UpPie(top){
    Pie.call(this);
    this.imgX = 70;
    this.canY = top - this.canH;
    this.draw = drawPie;
};
UpPie.prototype = new Pie();
/**
 * 下水管类
 */
function DownPie(top){
    Pie.call(this);
    this.imgX = 0;
    this.canY = top + Math.ceil(150 / 800 * viewSize.height);
    this.draw = drawPie;
}
DownPie.prototype = new Pie();

function drawPie(){
    var speed = 2 * k;
    this.canX -= speed;
    ctx.drawImage(img, this.imgX, this.imgY, this.imgW, this.imgH, this.canX, this.canY, this.canW, this.canH);
}

/**
 * 创建水管
 */
function createPie(){
    var minTop = Math.ceil(90 /800 * viewSize.height),
        maxTop = Math.ceil(390 /800 * viewSize.height),
        top = minTop + Math.ceil(Math.random() * (maxTop - minTop));
    Pies.push(new UpPie(top));
    Pies.push(new DownPie(top));
};
/**
 * 地板类
 */
function Ground(){
    this.imgX = 0;
    this.imgY = 600;
    this.imgH = 112;
    this.imgW = 600;
    this.canH = Math.ceil(112 * k);
    this.canW = Math.ceil(k * 800);
    this.canX = 0;
    this.canY = viewSize.height - this.canH;
}
Ground.prototype.draw = function(){
    if(this.imgX > 24) this.imgX = 0;
    ctx.drawImage(img, this.imgX, this.imgY, this.imgW, this.imgH, this.canX, this.canY, this.canW, this.canH);
    this.imgX += 2;
};



