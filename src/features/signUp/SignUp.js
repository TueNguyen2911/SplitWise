import { Button, Card, Input, Link, TextField, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import { useFormik, Formik, Form } from 'formik'
import * as yup from 'yup'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import uniqid from 'uniqid'
import React, { useRef, useEffect, useState } from 'react'
import Preview from './Preview'
import { Paper } from '@mui/material'
import { useDispatch } from 'react-redux'
import { updateExpenseForm } from '../../redux/slices/expenseFormSlice'
import { useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { createGroup, createUser, uploadImgToStorage } from '../../firebase/operations'

const SignUp = () => {
  const dispatch = useDispatch()
  const groups = useSelector((state) => state.groups)
  const appState = useSelector((state) => state.app)
  const [imgFile, setImgFile] = useState(null)
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    userName: yup.string().max(15).required('Username is required'),
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    avatar: yup.string(),
    password: yup.string().min(8).required('Password is needed'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same')
      })
  })
  const signUpForm = useFormik({
    initialValues: {
      name: '',
      userName: '',
      email: '',
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/default-avatar.png?alt=media&token=04c9d72c-c171-4717-9b13-94733eba3c86',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      const { msg, error } = await createUser(signUpForm.values)
      console.log(msg, error)
    }
  })
  const inputImgRef = useRef()

  const setAvatar = async (e) => {
    setImgFile(e.target.files[0])
  }
  const toLogin = () => {
    dispatch(saveAppState({ login: true }))
  }
  return (
    <div className="SignUp">
      <Paper elevation={10} className="login-signup-paper">
        <img className="SWLogo" alt="logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} />
        <Formik>
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '70%',
              justifyContent: 'center'
            }}
            onSubmit={signUpForm.handleSubmit}
          >
            <TextField
              fullWidth
              type="text"
              name="name"
              value={signUpForm.values.name}
              onChange={signUpForm.handleChange}
              label="Real name"
              error={signUpForm.errors.name && Boolean(signUpForm.touched.name)}
              helperText={signUpForm.touched.name && signUpForm.errors.name}
            />
            <br />
            <TextField
              fullWidth
              type="text"
              name="userName"
              value={signUpForm.values.userName}
              onChange={signUpForm.handleChange}
              label="UserName"
              error={signUpForm.errors.userName && Boolean(signUpForm.touched.userName)}
              helperText={signUpForm.touched.userName && signUpForm.errors.userName}
            />
            <br />
            <TextField
              fullWidth
              type="email"
              name="email"
              value={signUpForm.values.email}
              onChange={signUpForm.handleChange}
              label="Email"
              error={signUpForm.errors.email && Boolean(signUpForm.touched.email)}
              helperText={signUpForm.touched.email && signUpForm.errors.email}
            />
            <br />
            <TextField
              fullWidth
              type="password"
              name="password"
              value={signUpForm.values.password}
              onChange={signUpForm.handleChange}
              label="Password"
              error={signUpForm.errors.password && Boolean(signUpForm.touched.password)}
              helperText={signUpForm.touched.password && signUpForm.errors.password}
            />
            <br />
            <TextField
              fullWidth
              type="password"
              name="confirmPassword"
              value={signUpForm.values.confirmPassword}
              onChange={signUpForm.handleChange}
              label="Confirm Password"
              error={
                signUpForm.errors.confirmPassword && Boolean(signUpForm.touched.confirmPassword)
              }
              helperText={signUpForm.touched.confirmPassword && signUpForm.errors.confirmPassword}
            />
            <br />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <Button
                onClick={() => inputImgRef.current.click()}
                htmlFor="billImg"
                color="secondary"
                variant="outlined"
              >
                <FileUploadIcon /> Avatar
              </Button>
              <input
                ref={inputImgRef}
                name="avatar"
                id="avatar"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setAvatar(e)}
              />
              <Preview imgFile={imgFile} />
            </div>
            <br />
            <Button fullWidth variant="contained" type="submit">
              Sign up
            </Button>
          </Form>
        </Formik>
        <Link component="button" variant="body2" onClick={toLogin}>
          Log-in here
        </Link>
      </Paper>
    </div>
  )
}

export default SignUp
