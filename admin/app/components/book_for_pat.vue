<template lang="jade">
  .book-for-pat.ml2
    .book-header.row.py2.bb.clearfix
      h4.pull-left 新建预约
      .pull-right
        button.btn.btn-default(@click="handleSave") 保存
        button.btn.btn-default.ml2(@click="handleCancel") 取消
    form.form-horizontal.book-form.center-block
      .form-group
        label.col-sm-2.control-label 预约人
        .col-sm-10.search-wrap
          multiselect(placeholder="输入姓名/手机号/身份证/就诊卡号查询", id='ajax', :allow-empty="true", :options="searchResult", :show-labels="false",
          :searchable="true", :internal-search="false", track-by="name", :show-no-results="false", :loading="isPatsLoading", label="name", @search-change="searchPat", @select="patSelect")
            template(slot="option", scope="props")
              div
                span.mr2 {{ props.option.name }}
                span.mr2 {{ '手机号: ' + props.option.mobile }}
              div.mt1
                span.mr2 {{ '就诊卡号: ' + props.option.medical_card_number }}
                span.mr2 {{ '身份证号: ' + props.option.identity_card_number }}
      .form-group
        label.col-sm-2.control-label 预约科室
        .col-sm-10
          select.form-control(v-model="deptId", @change="deptChange")
            option(v-for="item in allDepts", :value="item.id", :key="item.id") {{ item.name }}
      .form-group
        label.col-sm-2.control-label 预约医生
        .col-sm-10
          select.form-control(v-model="docId", @click="selectDoc")
            option(v-for="item in allDocs", :value="item.id", :key="item.id") {{ item.name }}
      .form-group(v-if="dates.length > 0")
        label.col-sm-2.control-label(style="padding-top: 0") 就诊日期
        .col-sm-10.flex.wrap
          div.flex1.justify-between(v-for="(item,index) in dates")
            input(type="radio", :id="item", :value="item", name="item", :checked="index === 0", v-model="date")
            label.cursor-pointer.vt(:for="item") {{ item }}
      .form-group(v-if="!!bookSources[date]")
        label.col-sm-2.control-label.vt(style="padding-top: 0") 选择号源
        .col-sm-10
          label 上午
          div(v-for="item in bookSources[date]")
            div.mt1(v-if="item.amOrPm === 'am'")
              input(type="radio", :id="item.id", :value="item.id", name="sources" v-model="sourceId")
              label.cursor-pointer.vt(:for="item.id") {{item.see_doc_time}}
          label.mt1 下午
          div(v-for="item in bookSources[date]")
            div.mt1(v-if="item.amOrPm === 'pm'")
              input(type="radio", :id="item.id", :value="item.id", name="sources" v-model="sourceId")
              label.cursor-pointer.vt(:for="item.id") {{item.see_doc_time}}
</template>

<script>
  import { agent } from '../utils/request'
  import Multiselect from 'vue-multiselect'
  const collection = require('lodash/collection')
  const array = require('lodash/array')

  export default{
    data () {
      return {
        deptId: null, // 当前选择的科室id
        docId: null, // 当前选的医生id
        patInfo: {}, // 当前选的患者id
        allDepts: JSON.parse(localStorage.getItem("allDepts")) || [],
        allDocs: [], // 根据科室获取的医生列表
        dates: [], // 就诊日期数组
        date: '', // 当前选中的如期
        bookSources: [], // 所有号源
        sourceId: "", // 选择的号源id
        searchResult: [], // 搜素结果
        isPatsLoading: false, // 患者列表是否加载完成
      }
    },

    components: {
      Multiselect
    },

    watch: {
      docId(newValue){ // 医生变化重新选择号源
        if(this.docId) // 如果日期和医生都已经选择
          this.getSources();
      }
    },

    methods: {
      deptChange(){ // 选择的科室改变时触发，获取该科室医生列表
        this.docId = null; // 重新选择科室清空医生id
        agent
          .get('doc')
          .query({ dept_id: 'eq.' + this.deptId })
          .end((req, res) => {
            if(res.ok)
              this.bookSources = [] // 清空号源
              this.dates = [] // 清空日期
              this.allDocs = res.body
          })
      },
      selectDoc(){
        if(!this.deptId)
          alert('请先选择科室')
      },
      getSources(){
        // 如果使用reftful则需要调用两次请求，分两次遍历，会比较麻烦。
        this.bookSources = []
        this.dates = []
        agent
          .get('book_schedule')
          .query( { 'doc_id': `eq.${this.docId}` } )
          .query( {
            'select': 'id, date, am_or_pm, book_sources:book_source(id, is_booked, see_doc_time)'
          } )
          .end( (err, res) => {
            const bookSchedules = res.body
            bookSchedules.forEach( schedule => { // 获取号源
              this.dates.push(schedule.date) // 获取所有就诊日期
              const bookSources = schedule.book_sources
              let dateInfo = {} // 用于储存日期和上下午,然后合并到号源数据中,方便后面根据日期分组
              bookSources.forEach( source => {
                dateInfo.date = schedule.date
                dateInfo.amOrPm = schedule.am_or_pm
                for (let i in dateInfo) source[i] = dateInfo[i]
                this.bookSources.push(source)
              })
            })
            this.dates = array.uniq(this.dates) // 去除重复日期
            this.bookSources = collection.groupBy(this.bookSources, 'date') // 根据日期分组
            this.date = this.dates[0] || ''; // 默认选中第一个选中的日期
          })
      },
      patSelect(pat){ // 点击选中患者, 存在数据安全问题，这里取到患者所有数据包含密码
        this.patInfo = pat
      },
      searchPat(searchKey){ // 模糊搜索
        this.isPatsLoading = true
        agent
          .post('rpc/search_pats')
          .send({ search: searchKey })
          .end((req, res) => {
            this.isPatsLoading = false
            this.searchResult = res.body
          })
      },
      handleSave(){
        agent
          .post('rpc/book_for_user')
          .send({
            pat_id: this.patInfo.id,
            book_source_id: this.sourceId
          })
          .end((req, res) => {
            if(res.ok){
              alert('保存成功')
              self.location = '#/book_record/list'
            }
          })
      },
      handleCancel(){
      }
    }
  }
  
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang='stylus'>
  .book-for-pat
    .vt
      vertical-align top
    input[type=radio]
      max-width 30px
      width 16px
      height 16px
      margin-top 2px
    .cursor-pointer
      cursor pointer
    .multiselect__tags
      border-radius 0
      min-height 30px
      padding: 6px 40px 0 8px
      border: 1px solid #ccc
    .multiselect__input
      margin-bottom 6px
    .multiselect__select
      width 19px
      padding: 7px 4px
    .multiselect__select::before
      border-width 6px 3px 0
      border-color: #555 transparent transparent
    .book-form
      margin-top 30px
      max-width 650px
      min-width 500px
</style>