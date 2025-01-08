'use client'

import { AppBar, Menu, Button, Container, Toolbar } from '@mui/material';
import { useState } from 'react';
import AdbIcon from '@mui/icons-material/Adb';
const navbarStyles = require('../styles/navbar.module.css');
const { NavbarParser } = require('../content/navbarParser');
const topBar = require('../content/navMenu.json');

export default function NavBar() {
  const parser = new NavbarParser(topBar);
  const firstLayer = parser.getFirstLayer();
  const [expandedPaths, setExpandedPaths] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});

  const renderMenu = (menuItems, path = []) => {
    return menuItems.map((menuItem, index) => {
      const currentPath = [...path, index];
      const isExpanded = expandedPaths.some(expPath =>
        JSON.stringify(expPath) === JSON.stringify(currentPath)
      );
      const subMenuItems = 
        typeof menuItem === 'object' && !Array.isArray(menuItem)
          ? Object.values(menuItem)[0]
          : [];
      
      const label = 
        typeof menuItem === 'object' && !Array.isArray(menuItem)
          ? Object.keys(menuItem)[0]
          : menuItem;
      
      return (
        <div key={index}>
          <Button onClick={(event) => handleClick(currentPath, subMenuItems, event.currentTarget)} ref={el => {
            if (el && el.offsetParent !== null && anchorEls[currentPath.join('-')] !== el) {
              setAnchorEls(prev => ({ ...prev, [currentPath.join('-')]: el }));
            }
          }}>
            {label}
          </Button>
          {isExpanded && subMenuItems.length > 0 && (
            <Menu
              anchorEl={anchorEls[currentPath.join('-')]}
              open={isExpanded}
              onClose={handleClose}
              MenuListProps={{ onClick: () => handleClose }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              getcontentanchorel={null}
              anchorReference="anchorPosition"
              anchorPosition={{
                top: anchorEls[currentPath.join('-')]?.getBoundingClientRect().bottom || 0,
                left: anchorEls[currentPath.join('-')]?.getBoundingClientRect().right || 0
              }}
            >
              {renderMenu(subMenuItems, currentPath)}
            </Menu>
          )}
        </div>
      );
    });
  };

  const toggleMenu = (path, subMenuItems) => {
    setExpandedPaths(prevPaths => {
      const pathExists = prevPaths.some(expPath =>
        JSON.stringify(expPath) === JSON.stringify(path)
      )

      if (pathExists) {
        // Close the menu
        return prevPaths.filter(expPath =>
          JSON.stringify(expPath) !== JSON.stringify(path)
        );
      } else if (subMenuItems.length > 0) {
        // Open the menu
        return [...prevPaths, path];
      } else {
        // Close the menu if no submenu exists
        return []; // No change if no submenu exists
      }
    });
  };

  const handleClick = (path, items, anchorEl) => {
    setAnchorEls(prev => ({ ...prev, [path.join('-')]: anchorEl }));
    toggleMenu(path, items);
  };
  

  const handleClose = () => {
    setExpandedPaths([]);
    setAnchorEls({});
  };  

  return (
    <AppBar className={navbarStyles.NavBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { md: 'flex' }, mr: 1 }} />
          {renderMenu(firstLayer.map(item => ({ [item]: parser.getItemListFrom(item) })))}
        </Toolbar>
      </Container>
    </AppBar>
  );
};