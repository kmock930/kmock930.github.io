"use client";

import { AppBar, CssBaseline, Grid, Menu, Toolbar,  Button, MenuItem} from "@mui/material";
import styles from '../styles/navbar.module.css';
import { useState } from "react";

export default function NavBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{background: "#FFA700"}}>
      <CssBaseline/>
      <Grid>
        <center>
          <h2>
            {"Welcome to Kelvin's Site :)"}
          </h2>
        </center>
      </Grid>
      <Grid>
        <center>
          <Toolbar>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-label="Dashboard button"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              color="secondary"
              sx={{
                fontWeight: "bold"
              }}
            >
              Dashboard
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem 
                onClick={handleClose}
              >
                Profile
              </MenuItem>
              <MenuItem 
                onClick={handleClose}
              >
                My account
              </MenuItem>
              <MenuItem 
                onClick={handleClose}
              >
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </center>
      </Grid>
    </AppBar>
  );
}