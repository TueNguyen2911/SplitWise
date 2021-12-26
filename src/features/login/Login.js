import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Button, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { login } from '../../redux/slices/userAuthSlice'

const Login = () => {
  const error = useSelector((state) => state.auth.error)
  const status = useSelector((state) => state.auth.status)
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
  return (
    <div>
      <br />
      <form onSubmit={loginForm.handleSubmit} style={{ width: '50%', margin: '0 auto' }}>
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
          Submit
        </Button>
        <div>{status === 'failed' ? error : null}</div>
      </form>
    </div>
  )
}

export default Login
