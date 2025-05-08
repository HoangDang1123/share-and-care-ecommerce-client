'use client'

import React from 'react'
import ScrollToTop from 'react-scroll-to-top'

export default function ScrollToTopButton() {
  return (
    <div>
      <div className='sm:hidden md:block'>
        <ScrollToTop
          smooth
          color='white'
          style={{
            display: 'flex',
            position: 'fixed',
            bottom: "20px",
            left: "20px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000",
            padding: "10px 0px",
            borderRadius: "10px",
            width: "50px",
            height: "50px",
          }}
        />
      </div>
      <div className='sm:block md:hidden'>
        <ScrollToTop
          smooth
          color='white'
          style={{
            display: 'flex',
            position: 'fixed',
            bottom: "20px",
            left: "20px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "38a59f",
            padding: "10px 0px",
            borderRadius: "10px",
            width: "40px",
            height: "40px"
          }}
        />
      </div>
    </div>
  )
}
