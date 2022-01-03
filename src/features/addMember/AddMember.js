import { Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import React from 'react'
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
const AddMember = () => {
  const appState = useSelector((state) => state.app)
  return (
    <div>
      {appState.data.addMember ? (
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
          <Title />
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TextField label="user id" />
            <Button variant="contained">Add</Button>
          </div>
        </Paper>
      ) : null}
    </div>
  )
}

export default AddMember
