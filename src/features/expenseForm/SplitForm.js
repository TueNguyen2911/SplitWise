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
  Checkbox,
  Avatar
} from '@mui/material'
import { Formik, Form, useFormik, FieldArray } from 'formik'
const SplitForm = ({ users, isBillForm, formik, handleFixedCheck, handleOwnedChange }) => {
  if (isBillForm || formik.values.billImg) {
    return (
      <div className="split-form">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Owned</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <FieldArray name="members">
                {({ push, remove }) => (
                  <>
                    {formik.values.members.map((elem, index) => {
                      const ownedName = `members[${index}].owned`
                      const fixedName = `members[${index}].fixed`
                      const noteName = `members[${index}].note`
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Avatar alt={users[index].userName} src={users[index].avatar} />
                            {users[index].userName}
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              margin="normal"
                              variant="outlined"
                              label="owned"
                              name={ownedName}
                              value={elem.owned}
                              onChange={(e) => handleOwnedChange(e, index)}
                            />
                            <FormControlLabel
                              label="Fixed"
                              name={fixedName}
                              value={elem.fixed}
                              control={<Checkbox checked={elem.fixed} />}
                              onChange={(e) => handleFixedCheck(e, index)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="text"
                              margin="normal"
                              variant="outlined"
                              label="Note"
                              name={noteName}
                              value={elem.note}
                              onChange={formik.handleChange}
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
