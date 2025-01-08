import NavBar from './component/NavBar'
import React from 'react'
import TopBar from './component/TopBar';

export default function Home() {
  return (
    <div>
      <title>{"Kelvin's Site"}</title>
      
      <TopBar title = "Welcome to Kelvin's Site!" />
      <NavBar />
    </div>
  )
}