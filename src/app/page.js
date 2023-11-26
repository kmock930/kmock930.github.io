import Image from 'next/image'
import styles from './styles/page.module.css'
import NavBar from './component/NavBar'
import React from 'react'

export default function Home() {
  return (
    <div>
      <title>{"Kelvin's Site"}</title>
      
      <NavBar title="Welcome to Kelvin Mock's Website!" />
      <p>
        {"Feel free to have a look :)"}
      </p>
      <p>
        {"Wow Wowww!!!"}
      </p>      
    </div>
  )
}