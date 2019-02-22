import lunr from 'lunr'
import * as R from 'ramda'

/**
 * 
 * @param {*} data fields = [{ name, boost }, ...]
 * @param {*} searchTerm 
 */
const search = ({ data, id = 'id', fields }, searchTerm) => {
  const index = lunr(function() {
    this.ref(id)
    fields.forEach(({ name, boost }) => { 
      // names of fields that contains search string
      if (boost) {
        this.field(name, { boost })
      } else {
        this.field(name)
      }
    })
    
    data.forEach(function(item) {
      const fieldNames = R.compose(R.prepend(id), R.pluck('name'))(fields)
      const itemToBeAdded = R.pickAll(fieldNames, item)
      this.add(itemToBeAdded)
    }, this)
  })
  
  // A bug in lunr where * doesn't match an empty string
  const isWildCard = R.includes('*', searchTerm)
  const wildCardSearchResults = index.search(searchTerm)
  const exactSearchResults = isWildCard ? index.search(R.replace('*', '')(searchTerm)) : []
  const searchResults = R.compose(R.uniqBy(R.prop('ref')), R.concat(exactSearchResults))(wildCardSearchResults)
  const matchedItems = R.map(result => {
    const matchedId = result.ref
    return R.find(R.propEq('id', matchedId))(data)
  })(searchResults)
  return matchedItems
}

export default search