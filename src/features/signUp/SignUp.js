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
import { createGroup, uploadImgToStorage } from '../../firebase/operations'

const SignUp = () => {
  const dispatch = useDispatch()
  const groups = useSelector((state) => state.groups)
  const appState = useSelector((state) => state.app)
  const [imgFile, setImgFile] = useState(null)
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    userName: yup.string().required('Username is required'),
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    avatar: yup.string()
  })
  const signUpForm = useFormik({
    initialValues: {
      name: '',
      userName: '',
      email: '',
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/default-avatar.png?alt=media&token=04c9d72c-c171-4717-9b13-94733eba3c86'
    },
    validationSchema: validationSchema,
    onSubmit: async () => {}
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
        <img alt="logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} />
        <Formik>
          <Form style={{ width: '70%' }} onSubmit={signUpForm.handleSubmit}>
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
            <br /> <br />
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
            <br /> <br />
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
            <br /> <br />
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
