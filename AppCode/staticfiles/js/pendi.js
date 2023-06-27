/**
 * Created by zhouyi on 2017/5/29.
 */


var myChartLida = echarts.init(document.getElementById('main'));
var optionLida = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: '80',
        data: ['查看']
    },
    radar: [{
        indicator: [
            {
                text: '压力',
                max: 6000
            },
            {
                text: '持久',
                max: 6
            },
            {
                text: '次数',
                max: 100
            }
        ],
        center: ['50%', '50%'],
        radius: 300
    }, ],
    series: [{
        type: 'radar',
        tooltip: {
            trigger: 'item'
        },
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default'
                }
            }
        },
        data: [{
            value: [2000, 5, 20],
            name: '查看'
        }]
    },

    ]
};
myChartLida.setOption(optionLida);
function refreshDataLida(data){
     if(!myChartLida){
          return;
     }
     //更新数据
      var option = myChartLida.getOption();
      option.series[0].data[0].value = data;
      myChartLida.setOption(option);
}

var myChartZx   = echarts.init(document.getElementById('box_zx'));
var optionZx = {
    title: {
        text: '对数轴示例',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
    },
    legend: {
        left: 'left',
        data: ['次数', '压力','持久']
    },
    xAxis: {
        type: 'category',
        name: 'x',
        splitLine: {
            show: false
        },
        data: ['2017/05/20', '2017/05/21', '2017/05/22', '2017/05/23', '2017/05/24', '2017/05/25', '2017/05/26']
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '10%',
        containLabel: true
    },
    yAxis: {
        type: 'log',
        name: 'y'
    },
    series: [
        {
            name: '次数',
            type: 'line',
            data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669]
        },
        {
            name: '压力(Pa)',
            type: 'line',
            data: [1, 2, 4, 8, 16, 32, 64, 128, 256]
        },
        {
            name: '持久(s)',
            type: 'line',
            data: [1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32, 1 / 64, 1 / 128, 1 / 256, 1 / 512]
        }
    ]
};

// myChartZx.setOption(optionZx);

function refreshDataZx(timeD,pressD,pressTD,pressCD){
     if(!myChartZx){
          return;
     }
     //更新数据
      var option = optionZx;//myChartZx.getOption();
      option.xAxis.data = timeD;
      option.series[0].data = pressCD;
      option.series[1].data = pressD;
      option.series[2].data = pressTD;

      myChartZx.setOption(option);
}

