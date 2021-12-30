import React from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Formik, Form, useFormik, FieldArray } from 'formik'
const SplitForm = ({ isBillForm, formik, handleFixedCheck, handleOwnedChange }) => {
  if (isBillForm || formik.values.billImg) {
    return (
      <div className="split-form">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Owned</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <FieldArray name="members">
                {({ push, remove }) => (
                  <>
                    {formik.values.members.map((elem, index) => {
                      const name = `members[${index}].owned`
                      const name2 = `members[${index}].fixed`
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              type="number"
                              margin="normal"
                              variant="outlined"
                              label="owned"
                              name={name}
                              value={elem.owned}
                              onChange={(e) => handleOwnedChange(e, index)}
                              required
                            />
                            <FormControlLabel
                              label="Fixed"
                              name={name2}
                              value={elem.fixed}
                              control={<Checkbox checked={elem.fixed} />}
                              onChange={(e) => handleFixedCheck(e, index)}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </>
                )}
              </FieldArray>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  } else {
    return null
  }
}

export default SplitForm
