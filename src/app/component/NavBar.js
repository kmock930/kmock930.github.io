import { AppBar, Toolbar, Typography } from "@mui/material";
import styles from '../styles/navbar.module.css';

export default function NavBar(props) {

  return (
    <AppBar position="static">
      <Typography>
        <center>{props.title}</center>
        <Typography/>
      </Typography>
    </AppBar>
  );
}