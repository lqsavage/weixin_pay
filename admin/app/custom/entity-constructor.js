/**
 * Created by yezq on 2017/7/6.
 */

export default function(nga, entity, constructConfig){
  var cConfig = constructConfig
  if(!cConfig) return
  if(cConfig.listView){
    cConfig.listView.fields && entity.listView().fields(cConfig.listView.fields)
    cConfig.listView.listActions && entity.listView().listActions(cConfig.listView.listActions)
    cConfig.listView.filters && entity.listView().filters(cConfig.listView.filters)
  }
  if(cConfig.showView){
    cConfig.showView.fields && entity.showView().fields(cConfig.showView.fields)
    cConfig.showView.template && entity.showView().template(cConfig.showView.template)
  }
  if(cConfig.creationView){
    cConfig.creationView.fields && entity.creationView().fields(cConfig.creationView.fields)
    cConfig.creationView.template && entity.creationView().template(cConfig.creationView.template)
  }
  if(cConfig.editionView){
    cConfig.editionView.fields && entity.editionView().fields(cConfig.editionView.fields)
    cConfig.editionView.template && entity.editionView().template(cConfig.editionView.template)
  }

}