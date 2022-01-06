import { TextField } from '@mui/material'
import React from 'react'
const AddMember = ({ userId, setUserId }) => {
  const handleUserIdChange = (e) => {
    const value = String(e.target.value).trim()
    setUserId(value)
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
