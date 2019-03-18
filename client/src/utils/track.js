import * as R from 'ramda'
import moment from 'moment'

export const track = {
  identify: ({ email, name }) => {
    console.log(`Identified as ${name}, ${email}`)
    
    const [first_name, last_name] = R.split(' ', name)
    
    // global.mixpanel.identify(email)

    _dcq.push(['identify', {
      email,
      name,
      created_at: moment().unix(),
      first_name,
      last_name,
    }])
  },
}