'use client'

import React from 'react'
import { AppBar } from "@mui/material";
import topBarStyles from '../styles/topBar.module.css'
export default function TopBar(props) {
    return (
        <AppBar className={topBarStyles.TopBar}>
            <center>
                <h3>
                    {props.title}
                </h3>
            </center>
        </AppBar>
    )
};