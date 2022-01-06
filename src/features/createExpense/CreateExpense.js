import {
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import * as yup from 'yup'
import { Formik, Form, useFormik } from 'formik'
// import DatePicker from '@mui/lab/DatePicker'
import DatePicker from 'react-datepicker'
import React, { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { createExpense } from '../../firebase/operations'
import { useParams } from 'react-router-dom'
const Title = ({ initialValues, form }) => {
  const dispatch = useDispatch()

  return (
    <Box>
      <Typography variant="h4" align="center">
        Create Expense
      </Typography>
      <IconButton
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8
        }}
        onClick={() => {
          form.resetForm()
          dispatch(saveAppState({ createExpense: false }))
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  )
}
const CreateExpense = () => {
  const appState = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const { groupId } = useParams()

  const validationSchema = yup.object().shape({
    singleDay: yup.boolean(),
    date: yup.date().when('singleDay', {
      is: true,
      then: yup.date().required('Date is required'),
      otherwise: yup.date().nullable()
    }),
    from: yup.date().when('singleDay', {
      is: false,
      then: yup.date().required('Start date is required'),
      otherwise: yup.date().nullable()
    }),
    to: yup.date().when('singleDay', {
      is: false,
      then: yup.date().required('From date is required'),
      otherwise: yup.date().nullable()
    }),
    name: yup.string().required('Expense Name is required')
  })
  const initialValues = {
    singleDay: true,
    date: new Date(),
    from: new Date(),
    to: new Date(),
    name: ''
  }
  const handleDate = (newDate, name) => {
    if (!newDate) {
      CEForm.setValues({ ...CEForm.values, [name]: null })
      return
    }
    if (newDate.toString() === 'Invalid Date') {
      CEForm.setValues({ ...CEForm.values, [name]: null })
      return
    }
    if (name === 'from' && newDate > CEForm.values.to) {
      return
    }
    if (name === 'to' && newDate < CEForm.values.to) {
      return
    }
    CEForm.setValues({ ...CEForm.values, [name]: newDate })
  }
  const CEForm = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async () => {
      const { successMsg, errorMsg } = JSON.parse(JSON.stringify(appState.data))
      const { msg, error } = await createExpense(groupId, CEForm.values)
      if (msg) {
        successMsg.push(msg)
        dispatch(saveAppState({ successMsg: successMsg }))
        dispatch(saveAppState({ createExpense: false }))
      } else {
        errorMsg.push(error)
        dispatch(saveAppState({ errorMsg: errorMsg }))
      }
    }
  })

  return (
    <div className="CreateExpense">
      {appState.data.createExpense ? (
        <>
          <Paper
            elevation={24}
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              padding: '10px 50px 50px 50px'
            }}
          >
            <Formik>
              <Form onSubmit={CEForm.handleSubmit}>
                <Title initialValues={initialValues} form={CEForm} />
                <TextField
                  type="text"
                  label="Name"
                  name="name"
                  value={CEForm.values.name}
                  onChange={CEForm.handleChange}
                  error={CEForm.touched.name && Boolean(CEForm.errors.name)}
                  helperText={CEForm.touched.name && CEForm.errors.name}
                />
                {CEForm.values.singleDay ? (
                  <DatePicker
                    selected={CEForm.values.date}
                    onChange={(date) => handleDate(date, 'date')}
                    className={Boolean(CEForm.errors.date) ? 'error-input' : ''}
                  />
                ) : (
                  <>
                    <DatePicker
                      name="from"
                      selected={CEForm.values.from}
                      onChange={(date) => handleDate(date, 'from')}
                      selectsStart
                      startDate={CEForm.values.from}
                      endDate={CEForm.values.to}
                    />
                    <DatePicker
                      name="to"
                      selected={CEForm.values.to}
                      onChange={(date) => handleDate(date, 'to')}
                      selectsEnd
                      startDate={CEForm.values.from}
                      endDate={CEForm.values.to}
                      minDate={CEForm.values.from}
                    />
                  </>
                )}
                <FormGroup>
                  <FormControlLabel
                    value={CEForm.values.singleDay}
                    onChange={() => CEForm.setFieldValue('singleDay', !CEForm.values.singleDay)}
                    control={<Switch checked={CEForm.values.singleDay} />}
                    label="Single day?"
                  />
                </FormGroup>
                <br />
                <Button type="submit" variant="contained">
                  Create
                </Button>
              </Form>
            </Formik>
          </Paper>
        </>
      ) : null}
    </div>
  )
}

export default CreateExpense
