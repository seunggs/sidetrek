import React from 'react'

const Spinner = () => (
  <div className="fixed top-0 right-0 bottom-0 left-0" style={{ backgroundColor: 'rgba(255,255,255,.6)' }}>
    <div className="flex items-center justify-center z-5" style={{ height: '100%' }}>
      <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </div>
)

export default Spinner
