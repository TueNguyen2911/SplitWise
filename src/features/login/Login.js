import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Button, Link, Paper, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { login } from '../../redux/slices/userAuthSlice'
import { saveAppState } from '../../redux/slices/appSlice'

const Login = () => {
  const userAuth = useSelector((state) => state.userAuth)
  const dispatch = useDispatch()
  const validationSchema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8).required('Password is required')
  })
  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      dispatch(login({ email: loginForm.values.email, password: loginForm.values.password }))
    }
  })
  const toSignup = () => {
    dispatch(saveAppState({ login: false }))
  }
  return (
    <div className="Login">
      <Paper elevation={10} className="login-paper">
        <img alt="logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} />
        <form onSubmit={loginForm.handleSubmit} style={{ width: '70%' }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={loginForm.values.email}
            onChange={loginForm.handleChange}
            error={loginForm.touched.email && Boolean(loginForm.errors.email)}
            helperText={loginForm.touched.email && loginForm.errors.email}
          />
          <br /> <br />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={loginForm.values.password}
            onChange={loginForm.handleChange}
            error={loginForm.touched.password && Boolean(loginForm.errors.password)}
            helperText={loginForm.touched.password && loginForm.errors.password}
          />
          <br /> <br />
          <Button color="primary" variant="contained" fullWidth type="submit">
            Log-in
          </Button>
          <div>{userAuth.status === 'failed' ? userAuth.error : null}</div>
        </form>
        <Link component="button" variant="body2" onClick={toSignup}>
          Sign-up here
        </Link>
      </Paper>
    </div>
  )
}

export default Login
