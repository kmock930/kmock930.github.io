'use client';

import NavBar from './component/NavBar'
import React, { useEffect } from 'react'
import { useState } from 'react';
import TopBar from './component/TopBar';
import { CircularProgress } from '@mui/material';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <title>{"Kelvin's Site"}</title>
      {loading ? (
        <center>
          <CircularProgress />
        </center>
      ) : (
        <>
          <TopBar title="Welcome to Kelvin's Site!" />
          <NavBar />
        </>
      )}
    </div>
  );
}