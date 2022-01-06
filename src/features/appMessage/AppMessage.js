import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />
})

const AppMessage = () => {
  const { successMsg, errorMsg } = useSelector((state) => state.app.data)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  useEffect(() => {
    if (successMsg.length > 0) {
      setSuccessOpen(true)
    }
  }, [successMsg])

  useEffect(() => {
    if (errorMsg.length > 0) {
      setErrorOpen(true)
    }
  }, [errorMsg])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSuccessOpen(false)
    setErrorOpen(false)
  }

  return (
    <Snackbar open={successOpen || errorOpen} autoHideDuration={4000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={successOpen ? 'success' : errorOpen ? 'error' : ''}
        sx={{ width: '100%' }}
      >
        {successOpen ? successMsg[successMsg.length - 1] : null}
        {errorOpen ? errorMsg[errorMsg.length - 1] : null}
      </Alert>
    </Snackbar>
  )
}

export default AppMessage
