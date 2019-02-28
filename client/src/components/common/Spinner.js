import React from 'react'

const Spinner = ({ page = false, width = 65, height = 65 }) => {
  const Icon = () => (
    <svg className="spinner" width={`${width}px`} height={`${height}px`} viewBox={`0 0 ${width + 1} ${height + 1}`} xmlns="http://www.w3.org/2000/svg">
      <circle className="path" fill="none" strokeWidth={width / 10} strokeLinecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  )
  return page ? (
    <div className="fixed z-5 top-0 right-0 bottom-0 left-0" style={{ backgroundColor: 'rgba(255,255,255,.6)' }}>
      <div className="flex items-center justify-center" style={{ height: '100%' }}>
        <Icon />
      </div>
    </div >
  ) : (
    <Icon />
  )
}

export default Spinner
