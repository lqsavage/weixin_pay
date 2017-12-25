<template lang="jade">
  .pat_list_add_tag.inline-block
    a.btn.btn-default.btn-xs(@click="showModal")
      span.glyphicon.glyphicon-share
      |&nbsp;
      span
        |打标签
    Modal(title="给患者打标签", :show.sync="isShow", @ok="ok", @cancel="cancel", cancelClass="btn btn-default", okClass="btn btn-primary")
      form.from-control(v-if="isLoading")
        .form-group
          label.ng-admin-column-actions 患者姓名: {{ values.name }}
        .form-group
          label.ng-admin-column-actions.label-name.mb2 添加新标签
          div
            div.label-item.inline-block.relative.mb2(v-for="item in tags", :key="item.id")
              input.check-item.item-cursor.absolute.m0(type="checkbox", :id="item.id", :value="item.id", v-model="newPatTags")
              label(:for="item.id", :class="[newPatTags.indexOf(item.id) === -1 ? 'label-default' : 'label-primary', 'label', 'item-cursor']") {{ item.name }}
      div(v-else) 正在加载数据请稍后……

</template>

<script>
  import Modal from './vue_bootstrap_modal.vue'
  import { agent } from '../utils/request'
  import async from 'async'
  const array = require('lodash/array')

  export default {

    components: { Modal },

    data() {
      return {
        tags: JSON.parse(localStorage.getItem("allTags")) || [],
        patTags: [],// 原患者已有标签
        newPatTags: [], // 修改后患者标签
        tagMapPatTag: {}, // tag_id映射到pat_tag_id
        isShow: false,
        isLoading: false, // 数据是否请求完成
        succeCounts: 0,// 新增或者需要删除的标签调用服务器成功总数量,用于判断是否全部更新好然后刷新页面
        changeCounts: 0,// 新增或需要删除的总标签数量, 如果succeCounts等于该数量,则表示全部数据更新完成,刷新页面
      }
    },
    props: {
      values: Object, //要查看或修改的当前实体
    },
    watch: {
      succeCounts(newValue){
        if(newValue === this.changeCounts){// 如果更新成功数量等于需要更新的总数量则刷新页面
          window.location.reload(true); // todo:ng刷新部分路由
          this.isShow = false
        }
      }
    },
    methods: {
      showModal: function () {
        this.isShow = true
        this.isLoading = false
        this.patTags = []
        this.newPatTags = []
        this.tagMapPatTag = {}
        agent
          .get( 'pat_tag' )
          .query( { pat_id: `eq.${this.values.id}` } )
          .query( { select: 'id, tag(id, name)' } )
          .end( (err, res) => {
            this.isLoading = true;
            const tags = JSON.parse(res.text)
            tags.forEach( item => {
                this.patTags.push( item.tag.id )
                this.newPatTags.push( item.tag.id )
                this.tagMapPatTag[item.tag.id] = item.id
              }
            )
          } )
      },
      ok: function () {
        // 需要删除的标签
        const delTags =  array.difference(this.patTags, this.newPatTags)
        // 需要添加的标签
        const addTags = array.difference(this.newPatTags, this.patTags)
        // 需要删除和添加的总标签数量
        this.changeCounts = delTags.length + addTags.length
        async.series([
          // 遍历删除去除的标签 todo:去重+批量
          // 外层不嵌套函数报错
          () => {
            delTags.forEach( item => {
              agent
                .delete( "pat_tag" )
                .set({ Prefer: 'return=representation' })
                .query( { id: `eq.${this.tagMapPatTag[item]}` } )
                .end( ( err, res ) => {
                  if(res.ok){// 调用成功,数量加1
                    this.succeCounts += 1
                  }
                })
            })
          },
          // 遍历更新新加的标签 todo:去重+批量
          addTags.forEach( item => {
            agent
              .post( 'pat_tag' )
              .send( {
                pat_id: this.values.id,
                tag_id: item
              } )
              .end( ( err, res ) => {
                if(res.ok){ // 调用成功,数量加1
                  this.succeCounts += 1
                }
                // window.location.reload(true); // todo:ng刷新部分路由
                // this.isShow = false
              })
          })
        ])
      },
      cancel: function () {
        // 初始化数组
        this.patTags = [];
        this.newPatTags = [];
        this.tagMapPatTag = {};
        this.succeCounts = 0
        this.changeCounts = 0
        this.isShow = false
      }

    }

  }
</script>
<style lang="stylus" scoped>
  .pat_list_add_tag
    .ng-admin-column-actions
       font-weight 0
       color #333!important
  .check-item
    opacity 0
    z-index 10
    width 100%
    height 100%
  .item-cursor
    cursor pointer
  .label-default
    background #999999 !important
</style> 