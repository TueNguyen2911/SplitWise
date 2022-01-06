import { Button, Card, Input, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useFormik, Formik, Form } from 'formik'
import * as yup from 'yup'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import uniqid from 'uniqid'
import React, { useRef, useEffect } from 'react'
import Preview from './Preview'
import { Paper } from '@mui/material'
import { useDispatch } from 'react-redux'
import { updateExpenseForm } from '../../redux/slices/expenseFormSlice'
import { useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import { createGroup, uploadImgToStorage } from '../../firebase/operations'
const StyledCard = styled(Card)(({ theme }) => ({
  width: '330px',
  boxShadow: '1px 1px 2px',
  [theme.breakpoints.down('md')]: {
    width: '280px'
  },
  transition: 'width 0.2s',
  '&:hover': {
    opacity: '0.5'
  }
}))
const CreateGroup = () => {
  const dispatch = useDispatch()
  const groups = useSelector((state) => state.groups)
  const appState = useSelector((state) => state.app)
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    avatar: yup.string()
  })
  const createGroupForm = useFormik({
    initialValues: {
      id: uniqid(),
      name: '',
      avatar: '',
      memberIds: []
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      const { successMsg, errorMsg } = JSON.parse(JSON.stringify(appState.data))
      const { msg, error } = await createGroup(createGroupForm.values)
      if (msg) {
        successMsg.push(msg)
        dispatch(saveAppState({ successMsg: successMsg }))
        dispatch(saveAppState({ createGroup: false }))
      } else {
        errorMsg.push(error)
        dispatch(saveAppState({ errorMsg: errorMsg }))
      }
    }
  })
  useEffect(() => {
    if (groups.createStatus === 'succeeded') {
      window.alert(`Added ${createGroupForm.values.name} successfully`)
      dispatch(saveAppState({ createGroup: false }))
    }
  }, [groups.createStatus])
  const inputImgRef = useRef()

  const setAvatar = async (e) => {
    const { url, error } = await uploadImgToStorage(e.target.files[0])
    createGroupForm.setValues({ ...createGroupForm.values, avatar: String(url) })
  }
  return (
    <div
      className="add-group"
      style={{ position: 'absolute', top: '50px', left: '35%', transform: 'translate(0, 25%)' }}
    >
      <Paper
        elevation={24}
        sx={{
          pointerEvents: 'auto',
          padding: '40px'
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Create a group</h1>
        <Formik className="add-group-form" style={{ textAlign: 'left', margin: '10px 20px' }}>
          <Form onSubmit={createGroupForm.handleSubmit}>
            <TextField
              type="text"
              name="name"
              value={createGroupForm.values.name}
              onChange={createGroupForm.handleChange}
              label="Name"
              error={createGroupForm.touched.name && Boolean(createGroupForm.errors.name)}
              helperText={createGroupForm.touched.name && createGroupForm.errors.name}
            />
            <br /> <br />
            <div>
              <Button
                onClick={() => inputImgRef.current.click()}
                htmlFor="billImg"
                color="primary"
                variant="contained"
              >
                Upload an avatar
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
            </div>
            <Preview url={createGroupForm.values.avatar} />
            <br /> <br />
            <Button type="submit" variant="contained">
              Create
            </Button>
            <Button
              variant="outlined"
              onClick={() => dispatch(saveAppState({ createGroup: false }))}
            >
              Cancel
            </Button>
          </Form>
        </Formik>
      </Paper>
    </div>
  )
}
export default CreateGroup
