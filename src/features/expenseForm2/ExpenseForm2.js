import React from 'react'
import { Divider, Button, TextField, Checkbox, FormControlLabel } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FieldArray, Form, Formik, getIn, useFormik } from 'formik'
import * as yup from 'yup'

const debug = true

const ExpenseForm2 = () => {
  const initialValues = {
    members: [
      {
        owned: 2,
        fixed: false
      },
      {
        owned: 2,
        fixed: false
      },
      {
        owned: 2,
        fixed: false
      }
    ],
    total: 6
  }
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    }
  })
  const handleOwnedChange = (e, index) => {
    const value = Number(e.target.value)
    const average = formik.values.total / formik.values.members.length
    if (value > formik.values.total || value < 0) {
      return
    }
    if (average != value) {
      const newMemebers = formik.values.members
      newMemebers[index].fixed = true
      newMemebers[index].owned = value
      let allFixedOwned = 0
      newMemebers.forEach((elem, index) => {
        if (elem.fixed) {
          allFixedOwned += elem.owned
        }
      })
      const restTotal = formik.values.total - allFixedOwned
      if (restTotal < 0) return
      const newAvg = restTotal / newMemebers.length
      newMemebers.forEach((elem, index) => {
        if (!elem.fixed) {
          elem.owned = newAvg
        }
      })
    } else {
      const newMemebers = formik.values.members
      newMemebers[index].fixed = false
    }
    formik.handleChange(e)
  }
  return (
    <div>
      <Formik>
        <Form>
          <FieldArray name="members">
            {({ push, remove }) => (
              <div>
                {formik.values.members.map((elem, index) => {
                  const name = `members[${index}].owned`
                  const name2 = `members[${index}].fixed`
                  return (
                    <div key={index}>
                      <TextField
                        type="number"
                        margin="normal"
                        variant="outlined"
                        label="owned"
                        name={name}
                        value={elem.owned}
                        required
                        onChange={(e) => handleOwnedChange(e, index)}
                      />
                      <FormControlLabel
                        label="Fixed"
                        name={name2}
                        value={elem.fixed}
                        control={<Checkbox checked={elem.fixed} />}
                        onChange={formik.handleChange}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </FieldArray>
        </Form>
      </Formik>

      {debug && (
        <>
          <pre style={{ textAlign: 'left' }}>
            <strong>Values</strong>
            <br />
            {JSON.stringify(formik.values, null, 2)}
          </pre>
          <pre style={{ textAlign: 'left' }}>
            <strong>Errors</strong>
            <br />
            {JSON.stringify(formik.errors, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}

export default ExpenseForm2
