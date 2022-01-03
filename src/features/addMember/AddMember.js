import { Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import React from 'react'
const AddMember = ({ userId, setUserId }) => {
  const handleUserIdChange = (e) => {
    const value = String(e.target.value).trim()
    if (value.length === 28) {
      setUserId(value)
    } else {
      setUserId('')
    }
  }
  return (
    <div className="AddMember">
      <TextField
        label="user id"
        value={userId}
        name="userId"
        sx={{ width: '400px' }}
        onChange={(e) => handleUserIdChange(e)}
      />
    </div>
  )
}

export default AddMember
