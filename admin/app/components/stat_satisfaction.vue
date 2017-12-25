<template>
  <div>
    <p class="title">满意度统计</p>
    <div class="choose">
      <div class="form-group col-lg-4">
        <label  class="col-lg-4 control-label">选择问卷</label>
        <div class="col-lg-8">
          <select class="form-control" v-model="surveyId">
            <option v-for="item in allsurvey" :value="item.id" :key="item.id">{{ item.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group col-lg-4">
        <label  class="col-lg-4 control-label">选择科室</label>
        <div class="col-lg-8">
          <select class="form-control" v-model="deptId">
            <option v-for="item in allDept" :value="item.id" :key="item.id">{{ item.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group col-lg-4">
        <label  class="col-lg-4 control-label">选择医生</label>
        <div class="col-lg-8">
          <select class="form-control" v-model="docId">
            <option v-for="item in allDdoc" :value="item.id" :key="item.id">{{ item.name }}</option>
          </select>
        </div>
      </div>
      <div class="col-lg-12" style="height:15px"></div>
      <div class="form-group col-lg-4">
        <label  class="col-lg-4 control-label">选择项目</label>
        <div class="col-lg-8">
          <select class="form-control" v-model="itemId">
            <option v-for="item in allItem" :value="item.id" :key="item.id">{{ item.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group col-lg-4">
        <label  class="col-lg-4 control-label">开始时间</label>
        <div class="col-lg-8">
          <input type="date" class="form-control">
        </div>
      </div>
      <div class="form-group col-lg-4">
        <label  class="col-lg-4 control-label">结束时间</label>
        <div class="col-lg-8">
          <input type="date" class="form-control">
        </div>
      </div>
      <div style="clear:both"></div>
    </div>
    <div class="list col-lg-12">
      <div id="doc" class="chart"></div>
      <div id="treat" class="chart"></div>
      <div id="hos" class="chart"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        deptId:1,
        surveyId:1,
        docId:1,
        itemId:1,
        allsurvey:[
        {
          id:1,
          name:"全院满意度调查"
        },
        {
          id:2,
          name:"全院满意度调查1"
        }
        ],
        allDept:[
        {
          id:1,
          name:"心理科"
        },
        {
          id:2,
          name:"肿瘤科"
        }
        ],
        allDdoc:[
        {
          id:1,
          name:"兰台书"
        },
        {
          id:2,
          name:"袁从波"
        }
        ],
        allItem:[
        {
          id:1,
          name:"脂肪肝"
        },
        {
          id:2,
          name:"肺结核"
        }
        ]
      }
    },
    mounted () {
      let doc = echarts.init(document.getElementById('doc'))
      let treat = echarts.init(document.getElementById('treat'))
      let hos = echarts.init(document.getElementById('hos'))
      let doclist = [
              {value:335, name:'满意'},
              {value:310, name:'一般'},
              {value:135, name:'不满意'},
              {value:1548, name:'非常满意'}
            ]
      doc.setOption(this.option('1、您对医生的服务态度满意吗？',doclist))
      treat.setOption(this.option('2、您对医生的治疗效果满意吗？',doclist))
      hos.setOption(this.option('3、您对医院的服务态度满意吗？',doclist))
    },
    methods: {
      testMethod: function () {
        alert('you click me!')
      },
      option(title,data){
        return {
          title : {
            text:title,
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
          {
            name: title,
            type: 'pie',
            radius : '70%',
            center: ['50%', '60%'],
            data:data,
            itemStyle: {
              normal:{
                label:{
                  show:true,
                  formatter: '{b} : {c} \n ({d}%)'
                },
                labelLine:{
                  show:true
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
          ]
        }
      }
    }
  }
</script>
<style lang="stylus">
  .title
    font-size 36px
    padding 15px 0 10px
    width 100%
    border-bottom 1px solid rgba(0,0,0,.08)
  .choose
    margin-top 20px
    padding-bottom 10px
    border-bottom 1px solid rgba(0,0,0,.08)
  .chart
    position relative
    text-align center
    width 100%
    height 320px
    margin 30px auto 15px
</style>