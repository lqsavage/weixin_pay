/**
 * Created by yezq on 2017/7/4.
 */
let defaultImg = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADcANwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAowKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApjypGMuwH1qO5uUt4i7HGK5DUtWlu5CiH932NAG9da7FbthcN9KonxYA2PJrnhCTySaf5HFAHT2/iNJmwyha14bmKYZRwfpXn7QemantL6axcbTx70Ad/RVDTtQS8iHPz45FX6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkZgqknsKWqGqXP2e3J9eKAOe1vUGuJvLQ4XoRWbHEAPegAvKzHuamHSgAAxS4oopAJio3jDDpUtFABp921ncjk4JxXbQSiWJWBzxXByLgg+ldL4eufMtirHnOKANyiiimAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXPeJJcwqo9a6GuX185OPegDIjHFSU1BxTqQBRRRQAUUUUANcZFXtElKXSp6mqR6VPpPGqRD3oA7YjBpKc33qbTAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArmvECYAb1NdLWPrsHm264HSgDm06U+mLwSPSnUALRSUUALRSUUAIelWtHTOoxt71UbpWxoEBdhLjoetAHTP96m0rcmkoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqG4iEsTA+lTUUAcPcQtBOwYdTTBXR6tp/nDzEHTtXOsrRnawIpAFFFFMAoopDk8AZoAFUySKo7muw0u1+yWuCOvNZWj6YWfzJBx1Ga6E4AAHagBKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKQkDqQKAAgEYNc5rcKR5cdT2rdluoogSXX865rV7tbgkL60AZ6nIp1NTpTqAA9KtaVGs1+iNVU9Kk02cW+oI7dBQB26qI12LwBSVBFeRTchgPxqYMD0OaAFooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKazBRkkCgB1NeRYxljgVk32uQW+VB+b2rnbrWLq5YhX+SgDpbvW4IQdjgn0rDufEU8xKqmB61leUXOW61KsIHakBG8s8z5LsKeiN3JNTBAO1KABQIAMUtFFAAelROpPSpaMUAVA80TbldvzrTtfEE8OFZcj1NVSmajaEGgDq7TW4JwN7gGtNJFkGVORXnZiZDlODV601i5tmAd/lFMZ3FFZVjrcFyAufm9zWoGDDIINAC0UUUAFFFFABRRRQAUUUUAFFFZeq6mtnGVB+cjigCxd6hFbKSWG70NcvqGtS3TFEyoHcVRmnlvJC0h606OHAoAiEbyHLsSfepkiAqQDFLSEIFpaKKACiiigAooooAKKKKAFzSYoooAQjNRvEGqWigCoyPHyjEfStOw1yS3IRwWHTJqsRmoXiBFAHa2uoQ3Kghxu9KuZyM155DLLaOGjPIro9N11X2pM3zHimM6CikVgygjvS0AFFFFABRRRQA2Q4jY+griNSma5uTk5wcV20v+pf6GuEkXFzJn+8aQgRABUlIKWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKMUUUAMZAe1QbDHIrDsatVHIOKAOu0eY3FpuJzitCsjw0CNPbPrWvTGFFFFABRRRQA1xmNh7Vxd9EYrk5GMmu2PSs680iK8kDOxGPSgDlaWuk/4Ry27SGj/hHLf/noaAOborpP+Ect/wDnoaP+Ect/+ehoA5uiuk/4Ry3/AOeho/4Ry3/56GgDm6K6T/hHLf8A56Gj/hHLf/noaAOborpP+Ect/wDnoaP+Ect/+ehoA5uiuk/4Ry3/AOeho/4Ry3/56GgDm6K6T/hHLf8A56Gj/hHLf/noaAOborpP+Ect/wDnoaP+Ect/+ehoA5uiuk/4Ry3/AOeho/4Ry3/56GgDm6aRuZR6103/AAjlv/z0NC+HLZXVvMPBzQBPosRhsipGOav0KixoFXoKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopaAP/Z'
let dictionary = require('./dictionary')
function task(nga, field) {
  var referenceEntityName
  var imgStr = field._name.match(/image|avatar/)

  //字段包含image或avatar
  if (field._type === 'template' && imgStr) {
    field._template = function (entry) {
      return `<img src="${entry.values[this._name]}" width=25 class="image-field ${entry._entityName}-image-field" onerror="this.src = '${defaultImg}'"/>`
    }
  }

  //字段类型为引用
  if (field._type === 'reference' && field._name.indexOf('_id') > 0 && !field._targetEntity) {
    referenceEntityName = field._name === 'followuper_id' ? 'adminer' : field._name.split('_id')[0]
    field.targetEntity(nga.entity(referenceEntityName))
  }

  if (field._type === 'reference' && !field._targetField) {
    //一般主显字段
    field.targetField(nga.field('name'));
    //特殊主显字段
    var specialDisplay = {
      question       : 'title',
      survey         : 'title',
      followup_task  : 'id',
      book_source    : 'id',
      book_schedule  : 'id',
      medical_record : 'id',
      diagnose_record: 'id',
    }
    field.targetField(nga.field(specialDisplay[referenceEntityName] || 'name'))

    //开启远程搜索支持
    var referenceEntityName_FOR_SEARCH = referenceEntityName + '_FOR_SEARCH'
    field._remoteComplete || field.remoteComplete(true, {
      refreshDelay: 200,
      //searchQuery : q => JSON.parse(`{"${specialDisplay[referenceEntityName] || 'name'}_FOR_SEARCH": "${q}"}`)
      searchQuery : q => JSON.parse(`{"search": "${q}"}`)
    })
  }

  //字段类型是choice
  if (field._type === 'choice') {
    (!field._choices || field._choices.length === 0) && field.choices(nga.custom.choices[field._name])
  }

  //字段类型是boolean
  if (field._type === 'boolean') {
    field.choices(nga.custom.choices.enable)
  }

  //填充label
  field._label || (field._label = dictionary(field._name))

  //跳转至引用字段时, 默认使用showView
  field._detailLinkRoute = 'show'
  field._targetEntity && field._targetEntity._identifierField && (field._targetEntity._identifierField._detailLinkRoute = 'show')

  //发现部分属性类型是field则递归调用
  field._targetField && /*(field._targetField._detailLinkRoute = 'show') &&*/ task(nga, field._targetField)
  field._targetFields && field._targetFields.forEach(field=>task(nga, field))

}

export default task