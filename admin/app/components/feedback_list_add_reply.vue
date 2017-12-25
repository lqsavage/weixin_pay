<template lang="jade">
    .feedback_list_add_reply.inline-block
        a.btn.btn-default.btn-xs(@click="showModal")
            span.glyphicon.glyphicon-share
            span &nbsp;回复
        Modal(title="回复", :show.sync="isShow", @ok="ok", @cancel="cancel", cancelClass="btn btn-default", okClass="btn btn-primary")
            form.from-control
                .form-group
                    label.ng-admin-column-actions 反馈时间:&nbsp; {{ created_at_FMT }}
                .form-group
                    label.ng-admin-column-actions 联系方式:&nbsp; {{ values.pat_mobile }}
                .form-group
                    label.ng-admin-column-actions 反馈内容:&nbsp; {{ values.content }}
                div
                    label.ng-admin-column-actions 处理结果:&nbsp;
                        span.red(v-if="values.is_dealed") 该问题已处理过, 重新处理会覆盖之前回复给用户的内容!
                .form-group
                    div( style="margin: 0 65px;")
                        textarea.flex10.p2(v-model="values.deal_result", style="height: 200px; color: #000;")
                .form-group
                    label.ng-admin-column-actions 处理部门:&nbsp;
                        span
                            input(v-model="values.dealer_dept")
                .form-group
                    label.ng-admin-column-actions 投诉类型:&nbsp;
                        span
                            input(v-model="values.complain_type")
                .form-group(v-if="values.is_dealed")
                    label.ng-admin-column-actions 回复时间:&nbsp; {{ updated_at_FMT }}

</template>

<script>

  import Modal from './vue_bootstrap_modal.vue'
  import {agent} from '../utils/request'
  import {datePattern} from  '../utils/dateFormat'
  export default {
    components: {Modal},
    data() {
      return {
        isShow: false,
        isLoading: false, // 数据是否请求完成
        created_at_FMT: '加载中...',
        updated_at_FMT: '加载中...'
      }
    },
    props: {
      values: Object, //要查看或修改的当前实体
    },
    mounted(){
      this.format()
    },
    methods: {
      format(){
        this.created_at_FMT = datePattern( this.values.created_at, 'yyyy-MM-dd HH:mm' )
        this.updated_at_FMT = datePattern( this.values.updated_at, 'yyyy-MM-dd HH:mm' )
      },
      showModal: function () {
        this.isShow = true
      },
      ok       : function () {

        agent.patch('feedback?id=eq.' + this.values.id)
          .send({
            deal_result: this.values.deal_result,
            dealer_dept: this.values.dealer_dept,
            complain_type: this.values.complain_type,
            is_dealed: true
          })
          .end((err, res) => {
            Math.floor( res.status / 100 ) === 2 && window.location.reload(true)
            this.isShow = false
          })
      },
      cancel   : function () {
        this.isShow       = false
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
