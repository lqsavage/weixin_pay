/**
 * @name ngaSearchField
 * @author admin@yeernet.com
 * @createdAt 2017-07-04 14:46
 * @lastModified 2017-07-04 14:46

 * @function
 * 
 * @param {object} nga
 * @param {string} fieldName
 * @param {string} placeholder
 * 
 * @return ngaField
 */
var setSearchTemplate = require('./setTemplate')
export default function(nga, fieldName, placeholder){
  return nga
    .field( fieldName || 'search' )
    .label(' ')
    .pinned(true)
    .template( setSearchTemplate( placeholder || null ) )
}