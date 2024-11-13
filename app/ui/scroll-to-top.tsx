'use client'

import React from 'react'
import ScrollToTop from 'react-scroll-to-top'

export default function ScrollToTopButton() {
    return (
        <div>
            <ScrollToTop
                smooth
                color='white'
                style={{ 
                    display: 'flex', 
                    justifyContent: "center", 
                    alignItems: "center", 
                    backgroundColor: "black", 
                    padding: "10px 0px",
                    borderRadius: "10px",
                    width: "50px",
                    height: "50px"
                }} 
            />
        </div>
    )
}
