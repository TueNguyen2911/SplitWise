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
import { createGroup } from '../../redux/slices/groupSlice'
import { saveAppState } from '../../redux/slices/appSlice'
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
    onSubmit: () => {
      dispatch(createGroup(createGroupForm.values))
    }
  })
  useEffect(() => {
    if (groups.createStatus === 'succeeded') {
      window.alert(`Added ${createGroupForm.values.name} successfully`)
      dispatch(saveAppState({ createGroup: false }))
    }
  }, [groups.createStatus])
  const inputImgRef = useRef()
  const uploadImgToStorage = (e) => {
    const storage = getStorage()
    const name = uniqid('group-avatar-')
    const storageRef = ref(storage, name)

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(ref(storage, name)).then((url) => {
        console.log(url)
        createGroupForm.setValues({ ...createGroupForm.values, avatar: String(url) })
      })
    })
  }
  return (
    <div className="add-group">
      <Paper
        elevation={24}
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, -50%)',
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
                onChange={(e) => uploadImgToStorage(e)}
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
