/** @namespace window.onJsSendMessageToCpp */
/** @namespace data.post_phone_record */
/** @namespace data.post_phone_record.remote_uri */
/** @namespace data.post_phone_record.call_state */
/** @namespace data.patch_phone_record.end_time */
export default function (angularModule) {

  angularModule.controller('phone', ['$scope', 'Restangular', 'notification','$http', function ($scope, Restangular, notification, $http) {
    let ok = window.ok = this.ok = function (){return}
    let defaultRemoteUserInfo = {base: {}, pat_tag: {},consult: {}, diagnose_record: {},  feedback: {}, book_record: {}, followup_task: {}, survey_result: {}}
    let _this = this
    this.isDialerVisiable = true
    this.isCallInTipsVisiable = false
    this.isOneThePhone = false
    this.hide = true
    this.isRemoteUserInfoHide = true
    this.number = '13800138000'
    this.phoneNumberInfo = '请输入号码'
    this.s = 0
    this.m = 0
    this.h = 0
    this.remoteUserInfo = defaultRemoteUserInfo
    this.entityTitle = {
      pat_tag         : '患者标签',
      diagnose_record : '诊断记录',
      consult         : '咨询记录',
      feedback        : '反馈记录',
      book_record     : '预约记录',
      followup_task   : '随访记录',
      survey_result   : '问卷结果'
    }
    window.onCppSendMessageToJs = (jsonStr) => {
      let data = JSON.parse(jsonStr)
      if(data.post_phone_record){

        this.number = data.post_phone_record.remote_uri
        this.isOneThePhone = false
        this.isDialerVisiable = false
        this.getPhoneNumberInfo()

        this.getRemoteUserInfo({mobile: data.post_phone_record.remote_uri})
        this.isRemoteUserInfoHide = false

        data.post_phone_record.call_state === 'GRIF_CALL_MISS'
        && (this.isCallInTipsVisiable = true)
        && notification.log(this.number + '来电', { addnCls: 'humane-flatty-success' })
        && (this.hide = false)

        data.post_phone_record.call_state === 'GRIF_CALL_OUT'
        && (this.isOneThePhone = true)

      }
      if(data.patch_phone_record && data.patch_phone_record.end_time){
        this.getOffPhoneSuccess()
        this.hangUp()
      }

      data.message && notification.log(data.message.text ? data.message.text: data.message, { addnCls: 'humane-flatty-error'})

      //数据操作
      data.post_phone_record &&
        Restangular.all("call_record")
          .post(JSON.stringify(data.post_phone_record))
          //.then(res => notification.log('修改成功!', { addnCls: 'humane-flatty-success' }))

      data.patch_phone_record && data.patch_phone_record.id &&
        Restangular.all("call_record?id=eq." + data.patch_phone_record.id)
          .patch(JSON.stringify(data.patch_phone_record))
          //.then(res => notification.log('修改成功!', { addnCls: 'humane-flatty-success' }))

      data.patch_phone_record && data.patch_phone_record.end_time && notification.log('通话结束!', { addnCls: 'humane-flatty-error' })

    }
    typeof window.onJsSendMessageToCpp === 'function' || (window.onJsSendMessageToCpp = function (args) {notification.log('您的电脑没有接入电话服务!', { addnCls: 'humane-flatty-error'})})
    window.getPhoneNumberInfoCallback = (args) => {
      //console.log(this, arguments, args)
      if(args.message === 'success'){
        args.data.isp && args.data.isp.indexOf('中国') !== 0 && (args.data.isp = '中国' + args.data.isp)
        this.province        = args.data.province
        this.city            = args.data.city
        this.isp             = args.data.isp
        this.phoneNumberInfo = `${args.data.province||''} ${args.data.city||''} ${args.data.isp||''}`
      }
      args.message === 'success' || (this.phoneNumberInfo = '未知地区或医院内部号码')
    }
    this.getPhoneNumberInfo = cb => {
      //console.log('getPhoneNumberInfo', arguments)
      //this.number.length < 7 && (this.phoneNumberInfo = '')
      //this.phoneNumberInfo || this.number.length > 6 &&
      this.number && $http({
        url   : `http://${window.location.hostname}:13800/mobile/${this.number}?callback=getPhoneNumberInfoCallback`,
        method: 'jsonp'
      }).success(function (data, header, config, status) {})
        .error(  function (data, header, config, status) {})
    }
    this.sendMessageToCpp = function (jsonStr) {
      onJsSendMessageToCpp(jsonStr)
      notification.log('sendMessageToCpp')
    }

    this.dialUp = function () {
      let NumberWithPrefix = this.number
      this.getPhoneNumberInfo()
      //this.getRemoteUserInfo({mobile: this.number})
      this.isRemoteUserInfoHide = false

      NumberWithPrefix = (this.city !== '金华' ? '0'.toString() : '') + this.number.toString()

      setTimeout( ()=>{
        console.log('dial up:', NumberWithPrefix)
        onJsSendMessageToCpp(`{"action": "dial_up", "number_for_dialing_up": "${NumberWithPrefix}"}`) && this.getOnPhoneSuccess()
      }, 150)

    }
    $scope.$on('dialUp', (e, v) => {
      this.openPhoneUiWithNumber(v)
    })
    $scope.$on('openPhoneUiWithId', (e, v) => {
      this.openPhoneUiWithId(v)
    })

    this.openPhoneUiWithNumber = function(number){
      _this.number = number.toString()
      _this.getRemoteUserInfo({mobile: this.number.toString()})
      _this.hide = false
      _this.isRemoteUserInfoHide = false
      //_this.dialUp(v)

    }
    this.openPhoneUiWithId = function(id){
      _this.id = id
      _this.getRemoteUserInfo({id: this.id})
      _this.hide = false
      _this.isRemoteUserInfoHide = false
      //_this.dialUp(v)

    }

    this.pickUp = function () {
      onJsSendMessageToCpp('{"action": "pick_up"}')
      this.getRemoteUserInfo({mobile: this.number.toString()})
      this.isRemoteUserInfoHide = false
      this.getOnPhoneSuccess()
    }

    this.hangUp = function () {
      onJsSendMessageToCpp('{"action": "hang_up"}')
      this.isOneThePhone = false
      this.s = this.m = this.h = 0
    }

    this.refuse = function () {
      onJsSendMessageToCpp('{"action": "refuse"}')
      this.isCallInTipsVisiable = false
      this.getOffPhoneSuccess()
    }

    this.getOnPhoneSuccess = function () {
      this.isCallInTipsVisiable = false
      this.isOneThePhone = true
      timer(this)
    }

    this.getOffPhoneSuccess = function () {
      this.isOneThePhone = false
      this.isCallInTipsVisiable = false
      this.isDialerVisiable = true
    }

    let timer = (args) => {
      args.s < 59 &&  ++args.s || (++args.m && (args.s = 0))
      args.m < 59 || (++args.h && (  args.m = 0))
      //console.log(`${args.h}:${args.m}:${args.s}`)
      setTimeout( () =>{
        this.a = !this.a
        args.isOneThePhone && timer(args)
      } , 995)
    }

    this.getPhoneNumberInfo()
    this.getRemoteUserInfo = (args) => {
      _this.remoteUserInfo = defaultRemoteUserInfo
      if(!args) return
      let queryName = args.id ? 'id' : 'mobile'
      let queryValue = args.id || args.mobile

      let entity = 'pat'
      if(args.id)
        entity += '?id=eq.' + args.id
      else
        entity += '?order=updated_at.desc&mobile=eq.' + args.mobile + ''

      ;(args.id || args.mobile) &&
        Restangular.all(`pat?${queryName}=eq.` + queryValue)
          .get('').then( res =>{
            if(res.data){
              res.data.birthday && (res.data.age = new Date().getFullYear() - new Date(res.data.birthday).getFullYear())
              _this.remoteUserInfo.base = res.data
              _this.number = res.data.mobile
              res.data.id && getMoreInfo(res.data.id)
              _this.tab = 'consult'
              console.log(_this)
            }
          })

      function getMoreInfo(id) {
        console.log(this)
        let entityNames = ['pat_tag', 'diagnose_record', 'consult', 'feedback', 'book_record', 'followup_task', 'survey_result']
        entityNames.forEach( name =>
          Restangular.all(`${name}?pat_id=eq.` + id)
          .getList('').then( res => {

            if( name === 'pat_tag' ){
              console.log(res.data)
              res.data && res.data.forEach(pat_tag=>{
                Restangular.all(`tag?id=eq.` + pat_tag.tag_id).get('').then( res => { pat_tag.tag = res.data || {} })
                _this.remoteUserInfo[name] = res.data || []
              })
            }
            _this.remoteUserInfo[name] = res.data || []
          })
        )
      }

      function getTagById(id){
        let tag = {}
      }
    }
    this.toPatInfo = function () {
      this.remoteUserInfo.base.id && (window.location.href = '#/pat/show/' + this.remoteUserInfo.base.id)
    }

    //this.getRemoteUserInfo({mobile: this.number.toString()})
    // setTimeout( () => {
    //   console.log(JSON.parse(JSON.stringify( _this.remoteUserInfo)))
    // },5000)

  }])

}