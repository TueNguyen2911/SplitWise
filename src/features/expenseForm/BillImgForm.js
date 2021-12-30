import { TextField } from '@mui/material'
import React from 'react'

const BillImgForm = ({ formik, handleBillImgTotalChange }) => {
  if (formik.values.billImg) {
    return (
      <>
        <label>Total: </label>
        <TextField
          name="total"
          id="total"
          type="number"
          onChange={(e) => handleBillImgTotalChange(e)}
          value={formik.values.total}
        />
      </>
    )
  } else {
    return null
  }
}

export default BillImgForm
