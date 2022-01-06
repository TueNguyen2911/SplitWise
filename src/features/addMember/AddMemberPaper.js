import { Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import React, { useState } from 'react'
import AddMember from './AddMember'
import Preview from './Preview'
const Title = () => {
  const dispatch = useDispatch()
  return (
    <Box>
      <Typography variant="h4" align="center">
        Add member
      </Typography>
      <IconButton
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8
        }}
        onClick={() => dispatch(saveAppState({ addMember: false }))}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  )
}
const AddMemberPaper = () => {
  const appState = useSelector((state) => state.app)
  const [userId, setUserId] = useState('')
  return (
    <div
      className="AddMemberPaper"
      style={{ position: 'absolute', top: '50px', left: '35%', transform: 'translate(0, 25%)' }}
    >
      {appState.data.addMember ? (
        <Paper
          elevation={24}
          sx={{
            pointerEvents: 'auto',
            padding: '10px 50px 50px 50px'
          }}
        >
          <Title />
          <AddMember setUserId={setUserId} userId={userId} />
          <Preview setUserId={setUserId} userId={userId} />
        </Paper>
      ) : null}
    </div>
  )
}

export default AddMemberPaper
