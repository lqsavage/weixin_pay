const entityNames = [
  'app',
  'recharge',
  'refund',
  'transfer',
]
const entityConfigFunctions = {}
entityNames.forEach( name => { entityConfigFunctions[name] = require('../entities/' + name) })
export default entityConfigFunctions


/*
import { agent } from '../utils/request'

export default entityConfigFunctions

function getEntityConfigFunctions(nga, app, menu) {
  const entityConfigFunctions = {}

  agent.get('relations_map').end((err, res) =>{
    console.log(res.body)
    let relations_map  = res && res.body || []
    relations_map.forEach( relation => {

      let e = nga.entity( relation.name )
      let fields = []
      relation.columns.forEach( column => fields.push( nga.field(column.column_name, typeTransForm(column)) ) )

      e.listView().fields(fields).filters([...fields, nga.custom.searchField(nga)])

      e.title = relation.name
      e.parentMenu = 'base'
      e.icon = 'fa-user-md'
      e.parentMenu = 'base'
      e.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']

      entityConfigFunctions[relation.name] = e
      app.addEntity(e)
      console.log(entityConfigFunctions[relation.name])

    })
    console.log(entityConfigFunctions)

  })

  function typeTransForm(column) {
    if (column.data_type === 'integer' || column.data_type === 'text') return undefined
    if( column.data_type === 'timestamp without time zone') return 'datetime'
  }
}

*/