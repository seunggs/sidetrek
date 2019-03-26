import notification from 'antd/es/notification'
import 'antd/es/notification/style/css'

/*
  Usage:
  notification.open({
    type,
    message,
    description,
  })
*/

const myNotification = {
  open: ({ type, ...config }) => {
    let style
    switch (type) {
      case 'success':
        style = { backgroundColor: '#52c41a', color: '#fff' }
        break
      case 'info':
        style = { backgroundColor: '#F4F4F4' }
        break
      case 'warning':
        style = { backgroundColor: '#faad14', color: '#fff' }
        break
      case 'error':
        style = { backgroundColor: '#ff634c', color: '#fff' }
        break
      default:
        style = { backgroundColor: '#F4F4F4' }
    }
    notification.open({ style, type, ...config })
  },
  close: key => {
    notification.close(key)
  },
}

export default myNotification
