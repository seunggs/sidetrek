import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { history } from './routers/AppRouter'
import * as serviceWorker from './serviceWorker'
import { PRISMA_HTTP_URL } from './utils/constants'

ReactDOM.render(<App />, document.getElementById('root'))

// // Handle Google auth event from Node
// console.log('google auth event endpoint', `${PRISMA_HTTP_URL}/auth/google/callback`)
// let googleAuthEventSource = new EventSource(`http://localhost:4000/auth/google/callback`)
// googleAuthEventSource.addEventListener('googleAuthenticated', ({ data }) => {
//     console.log(data)
//     googleAuthEventSource.close()
//     history.push('/')
// })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
