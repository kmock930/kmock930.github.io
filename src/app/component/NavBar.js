'use client'

import { AppBar, Menu, Button, Container, MenuItem, Toolbar } from '@mui/material';
import { useState } from 'react';
import AdbIcon from '@mui/icons-material/Adb';
const navbarStyles = require('../styles/navbar.module.css');
import '../content/navbarParser';
import { navbarParser } from '../content/navbarParser';
const topBar = require('../content/navMenu.json');

export default function NavBar() {
  const parser = new navbarParser(topBar);
  const firstLayer = parser.getFirstLayer();

  const handleClick = (btnText) => {
    console.log(btnText);
  }

  return (
    <AppBar className={navbarStyles.NavBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { md: 'flex' }, mr: 1 }} />

          {firstLayer.map((item) => {
            return (
                <Button 
                  key={item}
                  className={navbarStyles.btn}
                  onClick={handleClick(item)}
                >
                  {item}
                </Button>
            )
          })}
        </Toolbar>
      </Container>
    </AppBar>
  );
}