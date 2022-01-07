import React, { useState, useEffect } from 'react'
import { getMemeImages } from '../../firebase/operations'
import { Typography, Box, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import Login from '../login/Login'
import SignUp from '../signUp/SignUp'
const Landing = () => {
  const { login } = useSelector((state) => state.app.data)
  return (
    <div className="Landing">
      <Box className="landing-row-flex-container">
        {login ? <Login /> : <SignUp />}
        <img
          className="landing-meme-img"
          src={`${process.env.PUBLIC_URL}/images/meme${Math.floor(Math.random() * 8)}.jpg`}
          alt="meme"
        />
      </Box>
      <br />
    </div>
  )
}

export default Landing
