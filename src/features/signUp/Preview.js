import { Avatar } from '@mui/material'
import React, { useState } from 'react'
const Preview = ({ imgFile }) => {
  const [preview, setPreview] = useState(null)
  if (imgFile) {
    const reader = new FileReader()
    reader.readAsDataURL(imgFile)
    reader.onload = () => {
      setPreview(reader.result)
    }
  }
  const imgstyle = {
    width: '200px'
  }
  return (
    <div>
      {preview ? (
        <Avatar alt="avatar" src={preview} sx={{ width: 100, height: 100, border: 'solid' }} />
      ) : (
        <Avatar
          alt="avatar"
          src="https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/default-avatar.png?alt=media&token=04c9d72c-c171-4717-9b13-94733eba3c86"
          sx={{ width: 100, height: 100, border: 'solid' }}
        />
      )}
    </div>
  )
}

export default Preview
