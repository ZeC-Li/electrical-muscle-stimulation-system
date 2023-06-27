option = {
    title: {
        text: '多雷达图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: 'center',
        data:['某软件']
    },
    radar: [
        {
            indicator: [
                {text: '品牌', max: 100},
                {text: '内容', max: 100},
                {text: '功能', max: 100}
            ],
            center: ['25%','40%'],
            radius: 80
        },
    ],
    series: [
        {
            type: 'radar',
             tooltip: {
                trigger: 'item'
            },
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: [
                {
                    value: [60,73,85],
                    name: '某软件'
                }
            ]
        },
        
    ]
};