import Image from 'next/image'
import styles from './styles/page.module.css'
import { AppBar, Container } from '@mui/material'
import NavBar from './component/NavBar'

export default function Home() {
  return (
    <>
      <div>
        <head>
              <title>{"Kelvin's Site"}</title>
        </head>

        <body>
          <NavBar title="Welcome to Kelvin Mock's Website!" />
          <p>
            <center>
              {"Feel free to have a look :)"}
            </center>
          </p>
          <p>
            <center>
              {"Wow Wowww!!!"}
            </center>
          </p>
        </body>
      </div>
    </>
  )
}