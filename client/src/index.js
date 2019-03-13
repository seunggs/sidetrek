import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'tachyons'
import './styles/flexboxgrid.css'
import './styles/spinner.css'
import './styles/editor.css'
import './styles/animation.css'
import './styles/transition.css'
import './styles/pages.css'
import './styles/nav.css'
import './styles/override/colors.css'
import './styles/override/bg-colors.css'
import './styles/override/border-colors.css'
import './styles/override/shadow.css'
import './styles/override/typescale.css'
import './styles/override/emoji.css'
import './styles/override/antd.css'

import App from './App'
import * as serviceWorker from './serviceWorker'
import TagManager from 'react-gtm-module'

const tagManagerArgs = { gtmId: 'GTM-KP22TBQ' }
TagManager.initialize(tagManagerArgs)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
