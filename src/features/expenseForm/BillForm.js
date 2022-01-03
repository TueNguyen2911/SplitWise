import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import React from 'react'

const BillForm = ({ isBillForm, formik, handleDescChange, handlePriceChange, editBillForm }) => {
  if (isBillForm) {
    return (
      <div className="billForm">
        <TableContainer>
          <Table sx={{ maxWidth: '60vw' }}>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {formik.values.billDesc.map((elem, index) => (
                <TableRow>
                  <TableCell>
                    <TextField
                      value={formik.values.billDesc[index]}
                      multiline
                      label="Item description"
                      onChange={(e) => handleDescChange(e, index)}
                      sx={{ width: '40vw' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      sx={{ width: '200px ' }}
                      value={formik.values.billPrice[index]}
                      onChange={(e) => handlePriceChange(e, index)}
                      type="number"
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={(e) => editBillForm(e, 'add')}>
                      <AddIcon />
                    </Button>
                    <Button onClick={(e) => editBillForm(e, 'remove', index)}>
                      <RemoveIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h6">Total:</Typography>
                  <TextField
                    InputProps={{
                      readOnly: true
                    }}
                    name="total"
                    id="total"
                    type="number"
                    value={formik.values.total}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  } else {
    return null
  }
}

export default BillForm
