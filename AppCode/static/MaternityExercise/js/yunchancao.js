/**
 * Created by zhouyi on 2017/5/31.
 */

/**
 * 解析帧格式
 */
var g_MemoryData = [];  //转换好的数据的缓存
var g_FramCache = "";   //帧格式校验的缓存
var g_StandardData = [];    //环境参数的采集的标准值缓存
var g_AccuCache = [];   //累积缓存

var g_SampleRateGroup = 5;   //连续多个值后，表示有波形出现
var g_SampleRate = 5;   //采样率，每几个值累加计算
var g_bDataState = true;        //true表示在检车波形，false表示在检测静止

var g_StandardParam = 2000*g_SampleRate;    //波形识别门限


var g_nDayMoveCount = 0;    //今天的运动次数
/**
 * 判断动作类型
 */
function JudgeMoveType() {
    //如果g_AccuCache 有了数据可以，通过g_bDataState判读是运动数据(falsee)和静止数据(tru)
    if(!g_bDataState){
        //这里和前面是相反的，所以g_bDataState 为 false的时候是运动的
        var type = 1;
        var optData = [type,0];
        SaveOptData(optData);
    }

    return;
}

/**
 * 保存数据
 * "type":0 ;0表示原始采集数据，1表示操作数据
 */
 function SaveSourceData(arg) {
    $.ajax({
        type: "POST",
        url: "/device/MaternityExercise/index",
        dataType: "text",
        data: {"type":0,"Openid":openid
            ,"LX":arg[0],"LY":arg[1],"LZ":arg[2]
            ,"RX":arg[3],"RY":arg[4],"RZ":arg[5]},
        success: function(arg){
            console.log("save success!");
        },
        error:function (arg) {
            console.log("save error!");
        },
    });
}

function SaveOptData(arg) {
    $.ajax({
        type: "POST",
        url: "/device/MaternityExercise/index",
        dataType: "text",
        data: {"type":1,"Openid":openid,"MoveType":arg[0],"Time":arg[1]},
        success: function(arg){
            console.log("save success!");
        },
        error:function (arg) {
            console.log("save error!");
        },
    });

    g_nDayMoveCount++;
    $("#sp_cur_count").html(g_nDayMoveCount);
}
/**
 * 每100个数据处理一次。
 * 判断有动作了
 */
function JudgeStandarValue(arData){
    var i = 0,nCount = 0;
    for (;i < 3;i++){
        var item = arData[i];
        if (g_StandardParam < item){
            nCount++;
        }
    }

    if (2 <= nCount){
        return true;
    }

    nCount = 0;
    for (i = 3;i < 6;i++){
        var item = arData[i];
        if (g_StandardParam < item){
            nCount++;
        }
    }

    if (2 <= nCount){
        return true;
    }

    return false;
}

function JudgeMove(arMemData) {
    var j = 0;

    //采样率数据的平均值存储
    var arArgData = arMemData[0].slice(0);
    //把采样率的数据的数据进行累加
    var arItemData = arMemData[0].slice(0);
    for(var k = 1; k < g_SampleRate; k++){
        for (j = 0; j < arItemData.length; j++){
            var nTemp1 = arItemData[j] + arMemData[k][j];
            var nTemp2 = (arArgData[j]+arMemData[k][j])/2;
            arItemData[j] = nTemp1;
            arArgData[j] = nTemp2;
        }
    }

    SaveSourceData(arArgData);

    //判断是否到达标准
    var bJudge = JudgeStandarValue(arItemData);
    if (!g_bDataState){
        bJudge = !bJudge;
    }

    if(bJudge){
        g_AccuCache.push(arItemData);
        if(g_SampleRateGroup <= g_AccuCache.length){
            g_bDataState = !g_bDataState;
            return true;
        }
    }
    else{
        g_AccuCache = [];
    }

    return false;
}

function AnalysisData() {
    var i = 0,j = 0;

    if(0 == g_StandardData.length){
        if (100 > g_MemoryData.length){
            return;
        }
        //计算过出基准数据100次做平均值
        var arStandardDataTemp = [];
        g_StandardData = g_MemoryData[0].slice(0);
        for (i = 1; i < g_MemoryData.length; i++){
            arStandardDataTemp = g_MemoryData[i];
            for (j = 0; j < g_StandardData.length; j++){
                var nTemp1 = (g_StandardData[j] + arStandardDataTemp[j])/2;
                g_StandardData[j] = nTemp1;
            }
        }

        var Tip = "噪声值(主XYZ,从XYZ):{";
        //根据采样率的值的扩大倍数
        for (j = 0; j < g_StandardData.length; j++){
            var nTemp1 = g_StandardData[j]*g_SampleRate;
            g_StandardData[j] = nTemp1;
            Tip += nTemp1 + ":";
        }
        Tip += "}";

        //清空缓存
        g_MemoryData = [];

        alert(Tip);

        //提示出噪声值

        return;
    }

    //现在基础超声环境已经采集到，开始判断是否有波形出现
    while(g_SampleRate <= g_MemoryData.length){
        var arMemData = g_MemoryData.splice(0,g_SampleRate);
        if (JudgeMove(arMemData)){
            //有一个数据有效动作过来
            //分析数据的波,根据g_AccuCache的数据来分析是那个动作
            JudgeMoveType();
        }
    }
}

function FramDataExchange(data16) {
    var arSplitData = [];
    var arDataRes = [];
    var i = 0;
    for (;i < data16.length; i+=2){
        if(36 >  i || 40 <=  i){
            arSplitData.push(data16.substring(i,i+2));
        }
    }

    var dataVaule = 0;
    var flag = 1;
    for (i = 0;i < arSplitData.length; i += 6){
        dataVaule = 0;
        for (var axisIndex = 0; axisIndex < 6;axisIndex++) {
            var strFlag = arSplitData[axisIndex];
            if(0 == axisIndex){
               if("2D" == strFlag){
                    flag = -1;
                }
                else if("20" == strFlag){
                    flag = 1;
                }
            }
            else {
                var valueStr = arSplitData[axisIndex].substr(0);
                dataVaule += (parseInt(valueStr)-30)*Math.pow(10,6-(axisIndex+1));
            }
        }

        dataVaule *= flag;
        arDataRes.push(dataVaule);
    }

    g_MemoryData.push(arDataRes);
}

function ParseFramData(){
    var nPosFrom = g_FramCache.indexOf("FA"); // 基于0开始,找不到返回-1
        if(-1 == nPosFrom){
            //如果连帧头都找不到，所有数据都是无效的。
            g_FramCache = "";
            return;
        }

        var EffcDataLen = g_FramCache.length - nPosFrom;
        if(80 > EffcDataLen){
            if (0 < nPosFrom){
                var strTemp = g_FramCache.substr(nPosFrom);
                g_FramCache = strTemp;
            }
            return;
        }

        var nPosTo = g_FramCache.indexOf("AB");
        if(-1 == nPosTo){
            //这个数据头帧错误，放弃该帧头
            var strTemp = g_FramCache.substr(nPosFrom+2);
            g_FramCache = strTemp;
            ParseFramData();
            return;
        }

        if(78 != nPosTo-nPosFrom) {
            //这个数据帧长度错误，放弃帧尾
            var strTemp = g_FramCache.substr(nPosTo+2);
            g_FramCache = strTemp;
            ParseFramData();
            return;
        }

        //经过以上的校验了，后面就是处理正常的数据帧
        //首先把要处理的数据获取到
        var EffcOneData = g_FramCache.substring(nPosFrom+2,nPosTo);
        var nPosMid = EffcOneData.indexOf("AAFB");
        if (36 != nPosMid){
            //这个数据帧长度错误，放弃帧尾
            var strTemp = g_FramCache.substr(nPosTo+2);
            g_FramCache = strTemp;
            ParseFramData();
            return;
        }
        FramDataExchange(EffcOneData);

        //处理了的数据的帧要删除
        var strTemp = g_FramCache.substr(nPosTo+2);
        g_FramCache = strTemp;

        ParseFramData();
}

function DataDeal(data16) {
    var temp = "DataDeal:" + data16;
    console.log(temp);
    //alert(temp);
    var dataTemp = g_FramCache;
    g_FramCache = dataTemp.concat(data16.toUpperCase());
    ParseFramData()
    //分析数据
    AnalysisData();
}

var myChartRadar = echarts.init(document.getElementById("radar_ycc"));
var optionRadar = {
    radar: [
        {
            indicator: [
                { text: '脚踝运动' },
                { text: '脚部运动' },
                { text: '盆骨运动' },
                { text: '盘腿运动' },
                { text: '电梯式运动' },
                { text: '猫姿运动' },
                { text: '蹬车运动' }
            ],
            center: ['50%', '52%'],
            radius: 110,
            startAngle: 90,
            splitNumber: 4,
            shape: 'circle',
            name: {
                formatter:'{value}',
                textStyle: {
                    color:'#72ACD1'
                }
            },
            // splitArea: {
            //     areaStyle: {
            //         color: ['rgba(114, 172, 209, 0.2)',
            //             'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
            //             'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
            //         shadowColor: 'rgba(0, 0, 0, 0.3)',
            //         shadowBlur: 10
            //     }
            // },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5,1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5,1)'
                }
            }
        }
    ],
    series: [
        {
            name: '雷达图',
            type: 'radar',
            itemStyle: {
                emphasis: {
                    // color: 各异,
                    lineStyle: {
                        width: 4
                    }
                }
            },
            data: [
                {
                    value: [60, 5, 0.30, -100, 1500,30,100],
                    areaStyle: {
                        normal: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                }
            ]
        }
    ]
}

function SetRadar(data) {
    var option = myChartRadar.getOption();
    data = 0;
    myChartRadar.setOption(option);
};

$(document).ready(function() {
    var winH = $(window).height();
    var height = winH - 330;
    $("#box_below").height(height);
    $("#box_left").height(height);
    InitWX(DataDeal);

    myChartRadar.setOption(optionRadar);

    //ajax获取数据初始化
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        xAxis: {
            type: 'category',
            name: 'x',
            splitLine: {show: false},
            data: OptDateCache
        },
        grid: {
            top:'5%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'log',
            name: 'y'
        },
        series: [
            {
                name: '2的指数',
                type: 'line',
                data: OptDataCache
            }
        ]
    };
    var myChart = echarts.init(document.getElementById("box_rB"));
    myChart.setOption(option);

    g_nDayMoveCount = OptDataCache[OptDataCache.length-1];
    $("#sp_cur_count").html(g_nDayMoveCount);
});