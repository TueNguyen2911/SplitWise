import React, { useState, useEffect } from 'react'
import { getMemeImages } from '../../firebase/operations'
import { Typography, Box, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import Login from '../login/Login'
import SignUp from '../signUp/SignUp'
import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => ({
  landing_row_flex_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    height: '100vh',
    [theme.breakpoints.down('mobile')]: {
      flexDirection: 'column',
      justifyContent: 'space-evenly'
    }
  }
}))

const Landing = () => {
  const { login } = useSelector((state) => state.app.data)
  const classes = useStyles()
  return (
    <div className="Landing">
      <Box className={classes.landing_row_flex_container}>
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
