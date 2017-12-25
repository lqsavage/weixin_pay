import dashboardTemplate from './dashboard.html'

function dashboard(Restangular) {
    'use strict';

    return {
        restrict: 'EA',
        scope: {},
        controller: ['$scope', '$element', '$attrs' , function($scope, $element, $attrs) {
                //定义颜色
                var mainColor = '#65CEA7'
                var grayColor = '#bbb'
                var barColor = '#5AB6DF'
                //获取用户、咨询、预约、回访DOM
                var userChart = echarts.init(document.getElementById('user'))
                var consultChart = echarts.init(document.getElementById('consult'))
                var bookChart = echarts.init(document.getElementById('book'))
                var followupChart = echarts.init(document.getElementById('followup'))
                //初始化定义图标用到的list
                var date = [], date_list = [], new_pat_list = [], new_consult_list = [], new_book_list = [],followup_success_list = [],followup_todo_list = []
                for(var i = 6; i>=0; i--){
                    var day = new Date(new Date().getTime() - i*1000*60*60*24).getDate()
                    var month = new Date(new Date().getTime() - i*1000*60*60*24).getMonth() + 1
                    date.push(day)
                    date_list.push(month + '-' + day)
                    new_pat_list.push(0)
                    new_consult_list.push(0)
                    new_book_list.push(0)
                    followup_success_list.push(0)
                    followup_todo_list.push(0)
                }
                //board第一行展示统计数据
                $scope.countList = []

          $scope.role = $attrs.role
          if($scope.role !== 'followuper') {
            Restangular
              .all('boardcount')
              .getList()
              .then(data => {


                var obj = data.data[0]
                $scope.countList.push({name: '总用户', count: obj.pat_count})
                $scope.countList.push({name: '七日新增用户', count: obj.new_pat_count})
                $scope.countList.push({name: '流失用户', count: 1})
                $scope.countList.push({name: '总消息', count: obj.consult_count})
                $scope.countList.push({name: '七日新增消息', count: obj.new_consult_count})
                $scope.countList.push({name: '待处理消息', count: obj.consult_todo_count})
              });
            //最近七日新增用户
            Restangular
              .all('new_pat')
              .getList()
              .then(data => {
                var obj = data.data
                for (var i = 0; i < 7; i++) {
                  for (var j = 0; j < obj.length; j++) {
                    if (new Date(obj[j].dday).getDate() == date[i]) {
                      new_pat_list[i] = obj[j].pat_count
                    }
                  }
                }
                userChart.setOption(LineOption('七日新增用户', '人数', new_pat_list, date_list))
              });
            //最近七日新增用户
            Restangular
              .all('new_consult')
              .getList()
              .then(data => {
                var obj = data.data
                for (var i = 0; i < 7; i++) {
                  for (var j = 0; j < obj.length; j++) {
                    if (new Date(obj[j].dday).getDate() == date[i]) {
                      new_consult_list[i] = obj[j].consult_count
                    }
                  }
                }
                consultChart.setOption(LineOption('七日新增咨询', '人数', new_consult_list, date_list))
              });
            //最近七日新增预约
            Restangular
              .all('new_book')
              .getList()
              .then(data => {
                var obj = data.data
                for (var i = 0; i < 7; i++) {
                  for (var j = 0; j < obj.length; j++) {
                    if (new Date(obj[j].dday).getDate() == date[i]) {
                      new_book_list[i] = obj[j].book_count
                    }
                  }
                }
                bookChart.setOption({
                  title : {'text': '七日新增预约', right: '45%'},
                  grid  : {left: 25},
                  xAxis : {
                    name     : '日期',
                    axisLine : {lineStyle: {color: grayColor}},
                    axisLabel: {margin: 6},
                    axisTick : {lineStyle: {color: grayColor}},
                    data     : date_list
                  },
                  yAxis : {
                    name     : '人数',
                    axisLine : {lineStyle: {color: grayColor}},
                    splitLine: {lineStyle: {color: ['#eee'], type: 'solid'}},
                    axisTick : {show: false}
                  },
                  series: [{
                    type     : 'bar',
                    itemStyle: {normal: {color: barColor}},
                    data     : new_book_list
                  }]
                })
              });
            //最近七日随访任务完成情况
            Restangular
              .all('followup_success')
              .getList()
              .then(data => {
                var obj = data.data
                for (var i = 0; i < 7; i++) {
                  for (var j = 0; j < obj.length; j++) {
                    if (new Date(obj[j].dday).getDate() == date[i]) {
                      followup_success_list[i] = obj[j].followup_success_count
                    }
                  }
                }
                //最近七日随访任务未完成情况
                Restangular
                  .all('followup_todo')
                  .getList()
                  .then(data => {
                    var obj = data.data
                    for (var i = 0; i < 7; i++) {
                      for (var j = 0; j < obj.length; j++) {
                        if (new Date(obj[j].dday).getDate() == date[i]) {
                          followup_todo_list[i] = obj[j].followup_todo_count
                        }
                      }
                    }
                    followupChart.setOption({
                      title : {'text': '七日随访任务完成情况', left: 0},
                      grid  : {left: 25},
                      legend: {
                        data : ['已完成', '进行中'],
                        right: 0
                      },
                      xAxis : {
                        name     : '日期',
                        axisLine : {lineStyle: {color: grayColor}},
                        axisLabel: {margin: 6},
                        axisTick : {lineStyle: {color: grayColor}},
                        data     : date_list
                      },
                      yAxis : {
                        name     : '条数',
                        axisLine : {lineStyle: {color: grayColor}},
                        splitLine: {lineStyle: {color: ['#eee'], type: 'solid'}},
                        axisTick : {show: false}
                      },
                      series: [{
                        name     : '已完成',
                        type     : 'bar',
                        itemStyle: {normal: {color: mainColor}},

                        data: followup_success_list
                      }, {
                        name     : '进行中',
                        type     : 'bar',
                        itemStyle: {normal: {color: barColor}},

                        data: followup_todo_list
                      }]
                    })
                  })
              });
          }
            function LineOption(title, yAxisName, c, t) {
              return {
                title : {'text': title, right: '45%'},
                grid  : {left: 25},
                xAxis : {
                  name       : '日期',
                  boundaryGap: false,
                  axisLine   : {lineStyle: {color: grayColor}},
                  axisLabel  : {margin: 6},
                  axisTick   : {lineStyle: {color: grayColor}},
                  data       : t
                },
                yAxis : {
                  name     : yAxisName,
                  axisLine : {lineStyle: {color: grayColor}},
                  splitLine: {lineStyle: {color: ['#eee'], type: 'solid'}},
                  axisTick : {show: false}
                },
                series: [{
                  type     : 'line',
                  itemStyle: {normal: {color: mainColor}},
                  lineStyle: {normal: {color: mainColor}},
                  areaStyle: {normal: {color: 'rgba(31,166,122,0.1)'}},
                  data     : c
                }]
              }
            }



          if ($scope.role === 'followuper') {

            $scope.countList = [
              {name: '复诊提醒', count: '加载中'},
              {name: '随访任务', count: '加载中'},
              {name: '复诊提醒', count: '加载中'},
              {name: '随访任务', count: '加载中'},
            ]

            Restangular.all('v_return_mention_today').getList().then(data => {
              $scope.countList[0].count = data.status === 200 ? data.data.length : null
            })
            Restangular.all('v_followup_task_today').getList().then(data => {
              $scope.countList[1].count = data.status === 200 ? data.data.length : null
            })
            Restangular.all('v_return_mention_overdue').getList().then(data => {
              $scope.countList[2].count = data.status === 200 ? data.data.length : null
            })
            Restangular.all('v_followup_task_overdue').getList().then(data => {
              $scope.countList[3].count = data.status === 200 ? data.data.length : null
            })

          }
        }],
            template: dashboardTemplate
        };
    }

    dashboard.$inject = ['Restangular']

    export default dashboard
