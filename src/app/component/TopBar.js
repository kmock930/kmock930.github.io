'use client'

import React, { useEffect, useState } from 'react'
import { AppBar } from "@mui/material";
import topBarStyles from '../styles/topBar.module.css'
import { CircularProgress } from '@mui/material';

export default function TopBar(props) {
    const [TopbarLoading, setTopbarLoading] = useState(true);
    useEffect(() => {
        setTopbarLoading(false);
    });

    return (
        TopbarLoading ? <center><CircularProgress /> </center> :
        <AppBar className={topBarStyles.TopBar}>
            <center>
                <h3>
                    {props.title}
                </h3>
            </center>
        </AppBar>
    )
};