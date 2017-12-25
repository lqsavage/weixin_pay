<template lang="jade">
    .feedback_list_add_reply.inline-block
        a.btn.btn-default.btn-xs(@click="showModal")
            span.glyphicon.glyphicon-share
            span &nbsp;推送

        Modal(title="推送", :show.sync="isShow", @ok="ok", okClass="btn btn-primary")
            table.col-lg-12(style="color:blank;", v-if="channels")
                tr.bold.tc
                    td ID
                    td 名称
                    td 类型
                    td 推送频率(天/次)
                    td 创建时间
                    td 操作
                tr.black(v-for="i in channels")
                    td.p2 {{i.id  }}
                    td.p2 {{i.name}}
                    td.p2 {{i.type}}
                    td.p2 {{i.frequent}}
                    td.p2 {{new Date(i.created_at).toLocaleDateString() + new Date(i.created_at).toLocaleTimeString()}}
                    td.p2
                        .btn.btn-default.btn-xs(@click="push(i.id)") 推送该频道

</template>

<script>

  import Modal from './vue_bootstrap_modal.vue'
  import {agent} from '../utils/request'
  import {datePattern} from  '../utils/dateFormat'
  import {HEALTH_API_URL} from '../config/const'
  export default {
    components: {Modal},
    data() {
      return {
        isShow: false,
        isLoading: false, // 数据是否请求完成
        created_at_FMT: '加载中...',
        updated_at_FMT: '加载中...',
        channels: [],
      }
    },
    props: {
      values: Object, //要查看或修改的当前实体
    },
    mounted(){
      this.format()
      window.vueComponents = {}
      window.vueComponents.push_by_tag = {}
      window.vueComponents.push_by_tag[this.values.id] = this
    },
    methods: {
      format(){
        this.created_at_FMT = datePattern( this.values.created_at, 'yyyy-MM-dd HH:mm' )
        this.updated_at_FMT = datePattern( this.values.updated_at, 'yyyy-MM-dd HH:mm' )
      },
      showModal: function () {
        this.isShow = true
        this.getChannelList()
      },
      ok       : function () {
            this.isShow = false
      },
      cancel   : function () {
        this.isShow       = false
      },
      getChannelList(){
        agent.get(HEALTH_API_URL +'channel?order=id.desc').end((err, res)=>{
          Math.floor( res.status / 100 ) === 2 && this.$set(this.$data, 'channels', res.body)
        })
      },
      push(channel_id){
        agent.post(HEALTH_API_URL + 'node/push-by-tag')
          .send({
            tag_id    : this.values.id,
            tag_type  : this.values.route,
            channel_id: channel_id,
            hos_appid : 'wxfc623ff79ce99489'
          })
          .end((err, res)=>{
            let successCount = 0
            res.body && res.body.length && res.body.forEach( i => {
              typeof i === 'string' && i.indexOf('"success":true') > -1 && successCount++
              typeof i === 'object' && i.success && successCount++
            })
            alert(`共推送${res.body.length}个用户, 成功${successCount}个.`)
          })
      }
    }
  }
</script>
<style lang="stylus">
    .feedback_list_add_reply
        .ng-admin-column-actions
            font-weight 0
            color #333 !important
        .modal-dialog{ /*transform: translateY(50%) !important*/ transform: translateY(0%);}

    .check-item
        opacity 0
        z-index 10
        width 100%
        height 100%

    .item-cursor
        cursor pointer
</style>
