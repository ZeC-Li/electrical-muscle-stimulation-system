var myChart = echarts.init(document.getElementById('box_zx'));

			option = {
					title: {
						text: '历史记录',
						left: '500',
						textStyle:{
							fontSize:30
						}

					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c}',
						fontSize:30
					},
					legend: {
						left: '10',
						data: ['FVC', 'FEV1','PEF'],
						textStyle:{
							fontSize:30
						}
					},
					xAxis: {
						type: 'category',
						name: '',
						splitLine: {
							show: false
						},
						data: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
						axisLabel:{
           					 textStyle:{
               					 fontSize:30
          					  }
       					 }
					},
					grid: {
						left: '5%',
						right: '5%',
						bottom: '30%',
						containLabel: true
					},
					yAxis: {
						type: 'log',
						name: '',
						axisLabel:{
           					 textStyle:{
               					 fontSize:20
          					  }
       					 }
					},
					series: [{
							name: 'FVC',
							type: 'line',
							data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669],

						},
						{
							name: 'FEV1',
							type: 'line',
							data: [1, 2, 4, 8, 16, 32, 64, 128, 256]
						},
						{
							name: 'PEF',
							type: 'line',
							data: [1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32, 1 / 64, 1 / 128, 1 / 256, 1 / 512]
						}
					]
				};
    myChart.setOption(option);